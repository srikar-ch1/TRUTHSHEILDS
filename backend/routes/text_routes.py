"""
Text credibility / misinformation analysis routes.
Uses NLP heuristics: readability, emotional language, clickbait patterns, bias markers.
No external API keys required – works out of the box.
"""
import logging
import math
import re
import time

from flask import Blueprint, request, jsonify

logger = logging.getLogger(__name__)

text_bp = Blueprint("text", __name__)

# Clickbait patterns
CLICKBAIT_PATTERNS = [
    r"you won'?t believe",
    r"shocking",
    r"this is why",
    r"what happens next",
    r"doctors hate",
    r"one weird trick",
    r"mind.?blowing",
    r"jaw.?dropping",
    r"you need to see",
    r"the truth about",
    r"exposed",
    r"they don'?t want you to know",
    r"breaking\s*:",
    r"urgent\s*:",
    r"alert\s*:",
    r"exclusive\s*:",
    r"\d+ reasons? why",
    r"number \d+ will",
    r"this (?:one )?simple",
    r"goes viral",
    r"you'?ll never guess",
]

# Emotional / loaded language
EMOTIONAL_WORDS = [
    "outrageous", "disgusting", "horrifying", "terrifying", "unbelievable",
    "devastating", "catastrophic", "explosive", "bombshell", "scandalous",
    "despicable", "atrocious", "appalling", "sinister", "evil",
    "revolutionary", "miraculous", "incredible", "amazing", "stunning",
    "brilliant", "genius", "perfect", "flawless", "epic",
    "destroying", "obliterating", "annihilating", "crushing", "demolishing",
    "radical", "extreme", "dangerous", "toxic", "vile",
]

# Bias indicators
BIAS_MARKERS = {
    "political_left": ["progressive", "social justice", "inequality", "systemic", "marginalized", "privilege"],
    "political_right": ["patriot", "freedom", "liberty", "tradition", "values", "radical left"],
    "sensationalist": ["breaking", "exclusive", "bombshell", "exposed", "leaked", "insider"],
    "conspiratorial": ["coverup", "cover-up", "they don't want", "the truth", "wake up", "sheeple", "deep state", "controlled", "puppet"],
}

# Credibility indicators (positive)
CREDIBILITY_POSITIVE = [
    r"according to",
    r"study (?:shows|finds|suggests)",
    r"research (?:shows|indicates|suggests)",
    r"data (?:shows|suggests|indicates)",
    r"published in",
    r"peer.?review",
    r"source[sd]?(?:\s*:|\s+say)",
    r"evidence suggests",
    r"statistics show",
    r"experts? say",
    r"university of",
    r"journal of",
    r"cited",
    r"meta.?analysis",
]


def _compute_readability(text: str) -> dict:
    """Compute readability metrics."""
    sentences = re.split(r"[.!?]+", text)
    sentences = [s.strip() for s in sentences if s.strip()]
    words = text.split()
    syllable_count = sum(max(1, len(re.findall(r"[aeiouy]+", w.lower()))) for w in words)

    num_sentences = max(1, len(sentences))
    num_words = max(1, len(words))

    # Flesch-Kincaid Grade Level
    grade = 0.39 * (num_words / num_sentences) + 11.8 * (syllable_count / num_words) - 15.59
    grade = max(0, min(18, grade))

    # Flesch Reading Ease
    ease = 206.835 - 1.015 * (num_words / num_sentences) - 84.6 * (syllable_count / num_words)
    ease = max(0, min(100, ease))

    if grade <= 8:
        level = "Easy"
    elif grade <= 12:
        level = "Moderate"
    else:
        level = "Advanced"

    return {
        "grade_level": round(grade, 1),
        "reading_ease": round(ease, 1),
        "level": level,
        "sentence_count": num_sentences,
        "word_count": num_words,
    }


def _detect_clickbait(text: str) -> list:
    """Detect clickbait patterns in text."""
    text_lower = text.lower()
    found = []
    for pattern in CLICKBAIT_PATTERNS:
        matches = re.findall(pattern, text_lower)
        if matches:
            found.append({"pattern": pattern.replace(r"\s*", " ").replace(r"'?", "'"), "count": len(matches)})
    return found


def _detect_emotional_language(text: str) -> dict:
    """Detect emotional/loaded language."""
    text_lower = text.lower()
    words = text_lower.split()
    total_words = max(1, len(words))

    found = [w for w in EMOTIONAL_WORDS if w in text_lower]
    emotional_count = sum(text_lower.count(w) for w in found)
    density = emotional_count / total_words

    if density > 0.05:
        level = "High"
    elif density > 0.02:
        level = "Moderate"
    else:
        level = "Low"

    return {
        "level": level,
        "density": round(density, 4),
        "words_found": found[:10],
        "count": emotional_count,
    }


def _detect_bias(text: str) -> dict:
    """Detect bias markers in text."""
    text_lower = text.lower()
    detected = {}
    for category, markers in BIAS_MARKERS.items():
        found = [m for m in markers if m in text_lower]
        if found:
            detected[category] = found

    if not detected:
        return {"level": "Low", "categories": {}, "detail": "No significant bias markers detected"}

    num_categories = len(detected)
    if num_categories >= 3 or "conspiratorial" in detected:
        level = "High"
    elif num_categories >= 2:
        level = "Moderate"
    else:
        level = "Low"

    return {"level": level, "categories": detected, "detail": f"Detected bias markers in {num_categories} categories"}


def _detect_credibility_signals(text: str) -> dict:
    """Detect positive credibility signals."""
    text_lower = text.lower()
    found = []
    for pattern in CREDIBILITY_POSITIVE:
        matches = re.findall(pattern, text_lower)
        if matches:
            found.append(pattern.replace(r"(?:", "(").replace(r")", ")").replace(r"\s+", " "))

    # Check for quotes (attribution)
    quote_count = len(re.findall(r'[""][^""]+[""]', text))

    # Check for numbers / statistics
    stat_count = len(re.findall(r"\d+(?:\.\d+)?%|\d{2,}", text))

    return {
        "source_citations": len(found),
        "citation_patterns": found[:5],
        "quoted_content": quote_count,
        "statistics_referenced": stat_count,
    }


def _compute_credibility_score(
    readability: dict,
    clickbait: list,
    emotional: dict,
    bias: dict,
    credibility_signals: dict,
    text: str,
) -> float:
    """Compute overall credibility score (0-100, higher = more credible)."""
    score = 70.0  # Start at neutral-positive

    # Clickbait penalty
    score -= min(25, len(clickbait) * 8)

    # Emotional language penalty
    emotion_penalties = {"High": 15, "Moderate": 7, "Low": 0}
    score -= emotion_penalties.get(emotional["level"], 0)

    # Bias penalty
    bias_penalties = {"High": 20, "Moderate": 10, "Low": 0}
    score -= bias_penalties.get(bias["level"], 0)

    # Credibility signal bonus
    score += min(15, credibility_signals["source_citations"] * 5)
    score += min(5, credibility_signals["quoted_content"] * 2)
    score += min(5, credibility_signals["statistics_referenced"] * 1)

    # ALL CAPS penalty
    words = text.split()
    caps_words = sum(1 for w in words if w.isupper() and len(w) > 2)
    caps_ratio = caps_words / max(1, len(words))
    if caps_ratio > 0.15:
        score -= 15
    elif caps_ratio > 0.05:
        score -= 7

    # Exclamation marks penalty
    exclamation_count = text.count("!")
    if exclamation_count > 5:
        score -= 10
    elif exclamation_count > 2:
        score -= 5

    # Short text dampener only when no overt misinformation signals exist
    if len(words) < 25 and not clickbait and emotional["level"] == "Low" and bias["level"] == "Low":
        score = max(score, 50)

    return round(max(0.0, min(100.0, score)), 1)


@text_bp.route("/analyze-text", methods=["POST"])
def analyze_text():
    """
    Text credibility / misinformation analysis using NLP heuristics.
    No external API keys required.
    """
    start_time = time.time()

    try:
        data = request.get_json(silent=True) or {}
        text = data.get("text", "").strip()

        if not text:
            return jsonify({"error": "No text provided"}), 400

        if len(text) < 20:
            return jsonify({"error": "Text too short for meaningful analysis. Please provide at least 20 characters."}), 400

        if len(text) > 50000:
            return jsonify({"error": "Text too long. Maximum 50,000 characters."}), 400

        logger.info("=== Text analysis request: %d chars ===", len(text))

        # Run all analyses
        readability = _compute_readability(text)
        clickbait = _detect_clickbait(text)
        emotional = _detect_emotional_language(text)
        bias = _detect_bias(text)
        credibility_signals = _detect_credibility_signals(text)

        # Compute overall score
        credibility_score = _compute_credibility_score(
            readability, clickbait, emotional, bias, credibility_signals, text,
        )

        # Risk level
        if credibility_score >= 70:
            risk_level = "Credible"
        elif credibility_score >= 40:
            risk_level = "Questionable"
        else:
            risk_level = "Likely Misinformation"

        # Generate explanation
        issues = []
        if clickbait:
            issues.append(f"{len(clickbait)} clickbait pattern(s) detected")
        if emotional["level"] != "Low":
            issues.append(f"{emotional['level'].lower()} emotional language density")
        if bias["level"] != "Low":
            issues.append(f"{bias['level'].lower()} bias indicators")

        if issues:
            explanation = f"Analysis flagged: {'; '.join(issues)}. "
        else:
            explanation = "No significant misinformation indicators detected. "

        if credibility_signals["source_citations"] > 0:
            explanation += f"Found {credibility_signals['source_citations']} source citation(s), which improves credibility."
        else:
            explanation += "No source citations found — credibility assessment is based on linguistic analysis only."

        processing_time = round(time.time() - start_time, 3)

        logger.info(
            "Text analysis complete | chars=%d | credibility=%.1f | risk=%s | time=%.3fs",
            len(text), credibility_score, risk_level, processing_time,
        )

        return jsonify({
            "credibility_score": credibility_score,
            "risk_level": risk_level,
            "explanation": explanation,
            "readability": readability,
            "clickbait": {"detected": len(clickbait) > 0, "patterns": clickbait},
            "emotional_language": emotional,
            "bias": bias,
            "credibility_signals": credibility_signals,
            "processing_time": processing_time,
        })

    except Exception as e:
        logger.exception("Text analysis failed: %s", e)
        return jsonify({"error": "Text analysis failed. Please try again."}), 500
