from flask import Flask, jsonify, send_from_directory, render_template
import os
from config import Config
from routes.api import api_bp

app = Flask(__name__,
            static_folder='../frontend/build/static',
            template_folder='../frontend/build')

# Load configuration
app.config.from_object(Config)

# Register blueprints
app.register_blueprint(api_bp, url_prefix='/api')

# Serve React App - this will catch all routes not caught by other routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.template_folder, path)):
        return send_from_directory(app.template_folder, path)
    return render_template('index.html')

@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

@app.errorhandler(500)
def server_error(e):
    return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=Config.DEBUG)
