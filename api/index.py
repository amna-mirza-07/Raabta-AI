import sys
import os

# Configure writable cache directory for serverless environments
if os.environ.get("VERCEL"):
    os.environ["HF_HOME"] = "/tmp/huggingface"

# Add backEnd directory to sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
BACKEND_DIR = os.path.join(ROOT_DIR, "backEnd")

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Import the existing Flask app from backEnd/app.py
from app import app


class VercelPathFixMiddleware:
    """
    WSGI middleware that restores the real requested path on Vercel.
    
    When Vercel rewrites requests to /api/index.py, the Vercel Python runtime
    populates PATH_INFO as '/' (the root of the serverless function) while
    preserving the original client request path in HTTP_X_MATCHED_PATH or
    REQUEST_URI.
    
    This middleware detects when PATH_INFO has been collapsed to '/' or the
    script name, and restores the original path (e.g. /api/text-report,
    /api/report, /api/voice-report, /api/health) so that Flask's URL routing
    matches the correct endpoint and method instead of hitting '@app.route('/')'
    and returning HTTP 405.
    """
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        matched_path = (
            environ.get("HTTP_X_MATCHED_PATH")
            or environ.get("REQUEST_URI")
            or environ.get("RAW_URI")
            or environ.get("HTTP_X_FORWARDED_URI")
            or environ.get("HTTP_X_ORIGINAL_URL")
        )

        if matched_path:
            clean_path = matched_path.split("?")[0]
            current_path = environ.get("PATH_INFO", "")
            if current_path in ("/", "", "/index.py", "/api/index.py", "/api", "/api/"):
                environ["PATH_INFO"] = clean_path

        return self.wsgi_app(environ, start_response)


# Wrap Flask's WSGI callable with the path-restoration middleware
app.wsgi_app = VercelPathFixMiddleware(app.wsgi_app)
