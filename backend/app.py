from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import config
from routes import init_app

def create_app(config_name='default'):
    app = Flask(__name__,
                static_folder='static',
                template_folder='templates')

    # Load configuration
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    # Enable CORS
    CORS(app)

    # Register blueprints
    init_app(app)

    @app.route('/')
    def index():
        return jsonify({"message": "Welcome to GenAI Landing Page API"})

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"error": "Server error"}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
