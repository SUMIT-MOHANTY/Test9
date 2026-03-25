from flask import Flask
from flask_cors import CORS
from routes.api import api_bp

app = Flask(__name__)

# Configure CORS to allow requests from frontend
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Register blueprints
app.register_blueprint(api_bp, url_prefix='/api')

@app.errorhandler(404)
def not_found(error):
    return {"error": "Resource not found"}, 404

@app.errorhandler(500)
def internal_error(error):
    return {"error": "Internal server error"}, 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
