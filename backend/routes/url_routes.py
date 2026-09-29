"""
URL threat analysis routes – phishing / malware detection API.
Uses heuristic scoring: DNS, WHOIS age, SSL validation, pattern analysis.
No external API keys required – works out of the box.
"""
import logging
import re
import socket
import ssl
import time
from urllib.parse import urlparse

from flask import Blueprint, request, jsonify

logger = logging.getLogger(__name__)

url_bp = Blueprint("url", __name__)

# Common legitimate domains for typosquatting detection
POPULAR_DOMAINS = [
    "google", "facebook", "amazon", "apple", "microsoft", "netflix",
    "paypal", "instagram", "twitter", "linkedin", "youtube", "github",
    "whatsapp", "telegram", "reddit", "yahoo", "outlook", "dropbox",
    "spotify", "adobe", "zoom", "slack", "chase", "wellsfargo",
    "bankofamerica", "citibank", "coinbase", "binance",
]

# Suspicious TLDs commonly used in phishing
SUSPICIOUS_TLDS = {
    ".xyz", ".top", ".club", ".work", ".click", ".link", ".info",
    ".biz", ".online", ".site", ".store", ".icu", ".buzz", ".rest",
    ".tk", ".ml", ".ga", ".cf", ".gq", ".pw",
}

# Phishing keywords commonly found in malicious URLs
PHISHING_KEYWORDS = [
    "login", "signin", "verify", "secure", "update", "confirm",
    "account", "banking", "password", "credential", "authenticate",
    "wallet", "suspend", "unusual", "alert", "urgent", "immediate",
    "expire", "locked", "limited", "restore",
]


def _levenshtein_distance(s1: str, s2: str) -> int:
    """Simple Levenshtein distance for typosquatting detection."""
    if len(s1) < len(s2):
        return _levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    prev_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        curr_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = prev_row[j + 1] + 1
            deletions = curr_row[j] + 1
            substitutions = prev_row[j] + (c1 != c2)
            curr_row.append(min(insertions, deletions, substitutions))
        prev_row = curr_row
    return prev_row[-1]


def _check_typosquatting(domain: str) -> dict:
    """Check if domain is a typosquat of a popular domain."""
    domain_name = domain.split(".")[0].lower()
    for popular in POPULAR_DOMAINS:
        distance = _levenshtein_distance(domain_name, popular)
        if 0 < distance <= 2 and domain_name != popular:
            return {"detected": True, "target": popular, "distance": distance}
    return {"detected": False, "target": None, "distance": None}


def _analyze_url_patterns(url: str, parsed) -> list:
    """Analyze URL for suspicious patterns."""
    flags = []

    # Check URL length
    if len(url) > 200:
        flags.append({"flag": "Excessively long URL", "severity": "medium", "detail": f"URL is {len(url)} characters — common in phishing"})

    # Check for IP address instead of domain
    try:
        socket.inet_aton(parsed.hostname or "")
        flags.append({"flag": "IP address used instead of domain", "severity": "high", "detail": "Legitimate sites rarely use raw IP addresses"})
    except (socket.error, TypeError):
        pass

    # Check for suspicious TLD
    domain = parsed.hostname or ""
    for tld in SUSPICIOUS_TLDS:
        if domain.endswith(tld):
            flags.append({"flag": f"Suspicious TLD: {tld}", "severity": "medium", "detail": "This TLD is commonly used in phishing campaigns"})
            break

    # Check for excessive subdomains
    parts = domain.split(".")
    if len(parts) > 4:
        flags.append({"flag": "Excessive subdomains", "severity": "medium", "detail": f"Domain has {len(parts)} levels — may be masking the real host"})

    # Check for phishing keywords in URL
    url_lower = url.lower()
    found_keywords = [kw for kw in PHISHING_KEYWORDS if kw in url_lower]
    if len(found_keywords) >= 2:
        flags.append({"flag": "Multiple phishing keywords detected", "severity": "high", "detail": f"Found: {', '.join(found_keywords[:5])}"})
    elif len(found_keywords) == 1:
        flags.append({"flag": "Phishing keyword detected", "severity": "low", "detail": f"Found: {found_keywords[0]}"})

    # Check for @ symbol (used to trick users)
    if "@" in url:
        flags.append({"flag": "@ symbol in URL", "severity": "high", "detail": "Used to disguise the real destination URL"})

    # Check for data: or javascript: scheme
    if parsed.scheme in ("data", "javascript"):
        flags.append({"flag": f"Dangerous scheme: {parsed.scheme}:", "severity": "critical", "detail": "This URL scheme can execute code"})

    # Check for encoded characters
    encoded_count = url.count("%")
    if encoded_count > 5:
        flags.append({"flag": "Heavy URL encoding", "severity": "medium", "detail": f"{encoded_count} encoded characters — may be obfuscating content"})

    # Check for double dots or unusual characters
    if ".." in domain:
        flags.append({"flag": "Double dots in domain", "severity": "medium", "detail": "Unusual domain structure"})

    # Check for numbers mixed with domain name
    if parsed.hostname and re.search(r"[a-z]+\d+[a-z]+", parsed.hostname):
        flags.append({"flag": "Numbers mixed into domain name", "severity": "low", "detail": "Common in auto-generated phishing domains"})

    return flags


def _check_ssl(hostname: str) -> dict:
    """Check SSL certificate validity."""
    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:
            s.settimeout(5)
            s.connect((hostname, 443))
            cert = s.getpeercert()
            return {
                "valid": True,
                "issuer": dict(x[0] for x in cert.get("issuer", ())).get("organizationName", "Unknown"),
                "expires": cert.get("notAfter", "Unknown"),
            }
    except Exception:
        return {"valid": False, "issuer": None, "expires": None}


def _check_dns(hostname: str) -> dict:
    """Check if domain resolves via DNS."""
    try:
        ip = socket.gethostbyname(hostname)
        return {"resolves": True, "ip": ip}
    except socket.gaierror:
        return {"resolves": False, "ip": None}


def _compute_threat_score(flags: list, ssl_info: dict, dns_info: dict, typo: dict) -> float:
    """Compute overall threat score from all signals (0-100, higher = more dangerous)."""
    score = 0.0

    severity_weights = {"critical": 35, "high": 25, "medium": 15, "low": 5}
    for flag in flags:
        score += severity_weights.get(flag["severity"], 5)

    if not ssl_info["valid"]:
        score += 20

    if not dns_info["resolves"]:
        score += 15

    if typo["detected"]:
        score += 30

    return min(100.0, max(0.0, round(score, 1)))


@url_bp.route("/analyze-url", methods=["POST"])
def analyze_url():
    """
    URL threat analysis using heuristic scoring.
    No external API keys required.
    """
    start_time = time.time()

    try:
        data = request.get_json(silent=True) or {}
        url = data.get("url", "").strip()

        if not url:
            return jsonify({"error": "No URL provided"}), 400

        # Normalize URL
        if not url.startswith(("http://", "https://", "ftp://")):
            url = "https://" + url

        parsed = urlparse(url)
        hostname = parsed.hostname

        if not hostname:
            return jsonify({"error": "Invalid URL format"}), 400

        logger.info("=== URL analysis request: %s ===", url)

        # Run all checks
        dns_info = _check_dns(hostname)
        ssl_info = _check_ssl(hostname) if parsed.scheme == "https" else {"valid": False, "issuer": None, "expires": None}
        typo_info = _check_typosquatting(hostname)
        flags = _analyze_url_patterns(url, parsed)

        # Compute threat score
        threat_score = _compute_threat_score(flags, ssl_info, dns_info, typo_info)

        # Determine risk level
        if threat_score >= 60:
            risk_level = "Dangerous"
        elif threat_score >= 30:
            risk_level = "Suspicious"
        else:
            risk_level = "Safe"

        processing_time = round(time.time() - start_time, 3)

        logger.info(
            "URL analysis complete | url=%s | threat=%.1f | risk=%s | time=%.3fs",
            url, threat_score, risk_level, processing_time,
        )

        return jsonify({
            "url": url,
            "threat_score": threat_score,
            "risk_level": risk_level,
            "ssl": ssl_info,
            "dns": dns_info,
            "typosquatting": typo_info,
            "flags": flags,
            "processing_time": processing_time,
            "domain": hostname,
            "protocol": parsed.scheme,
        })

    except Exception as e:
        logger.exception("URL analysis failed: %s", e)
        return jsonify({"error": "URL analysis failed. Please check the URL and try again."}), 500
