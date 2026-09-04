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
