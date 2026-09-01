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

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load config.env if present
config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.env")
if os.path.exists(config_path):
    load_dotenv(config_path)

from routes.report import report_bp
from routes.voice_report import voice_report_bp



# Create Flask application
app = Flask(__name__)


# Enable React frontend connection
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000", "*"]}}, supports_credentials=True)


# Register Blueprints
app.register_blueprint(
    report_bp,
    url_prefix="/api"
)

app.register_blueprint(
    voice_report_bp,
    url_prefix="/api"
)


print(app.url_map)


# Home Route
@app.route("/")
def home():
    return "Welcome to Raabta AI Backend!"


# Run Flask Server
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )