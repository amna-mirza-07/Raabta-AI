import sys
import os

if sys.platform == "win32":
    try:
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        if hasattr(sys.stderr, "reconfigure"):
            sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from dotenv import load_dotenv

# Reliable environment loading
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_env = os.path.join(current_dir, ".env")
root_env = os.path.join(current_dir, "..", ".env")
legacy_env = os.path.join(current_dir, "config.env")

if os.path.exists(backend_env):
    load_dotenv(backend_env)
elif os.path.exists(root_env):
    load_dotenv(root_env)
elif os.path.exists(legacy_env):
    load_dotenv(legacy_env)
else:
    load_dotenv()

# Safe API key diagnostics (never print or expose the key)
if os.getenv("GOOGLE_API_KEY"):
    print("[OK] GOOGLE_API_KEY detected")
else:
    print("[WARNING] GOOGLE_API_KEY not detected")

from flask import Flask, jsonify
from flask_cors import CORS

from routes.report import report_bp
from routes.voice_report import voice_report_bp

# Create Flask application
app = Flask(__name__)

import re

# Configure CORS safely (supports local dev and all Vercel production/preview deployments)
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    re.compile(r"^https://.*\.vercel\.app$")
]

cors_env = os.getenv("CORS_ORIGINS", "")
if cors_env:
    for origin in cors_env.split(","):
        origin = origin.strip()
        if origin and origin not in allowed_origins:
            allowed_origins.append(origin)

CORS(
    app,
    resources={r"/api/*": {"origins": allowed_origins}},
    supports_credentials=True
)

# Register Blueprints for both /api prefix and root (supports all serverless rewrite modes)
app.register_blueprint(
    report_bp,
    url_prefix="/api",
    name="report_api"
)
app.register_blueprint(
    report_bp,
    url_prefix="",
    name="report_direct"
)

app.register_blueprint(
    voice_report_bp,
    url_prefix="/api",
    name="voice_report_api"
)
app.register_blueprint(
    voice_report_bp,
    url_prefix="",
    name="voice_report_direct"
)

# Home Route
@app.route("/")
def home():
    return "Welcome to Raabta AI Backend!"

# Health Check Endpoint (supports both /api/health and /health)
@app.route("/api/health", methods=["GET"])
@app.route("/health", methods=["GET"])
def health():
    api_key = os.getenv("GOOGLE_API_KEY")
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    return jsonify({
        "success": True,
        "service": "Raabta AI API",
        "status": "healthy",
        "ai_configured": bool(api_key),
        "model": model
    }), 200

# Run Flask Server
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )