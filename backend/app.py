from flask import Flask
from flask_cors import CORS
from routes import api

def create_app():
    app = Flask(__name__)

    # Configure CORS
    # Allow requests from the frontend origin
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000", "https://your-production-domain.com"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Register blueprints
    app.register_blueprint(api.bp, url_prefix='/api')

    @app.route('/health', methods=['GET'])
    def health_check():
        return {"status": "healthy"}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
