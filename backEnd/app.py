from flask import Flask
from flask_cors import CORS

from routes.report import report_bp
from routes.voice_report import voice_report_bp


# Create Flask application
app = Flask(__name__)


# Enable React frontend connection
CORS(app)


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
        debug=True,
        port=5000
    )