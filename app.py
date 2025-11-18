from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config

# Import blueprints
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.services import services_bp
from routes.messages import messages_bp
from routes.requests import requests_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS with proper configuration
    CORS(app,
         resources={r"/api/*": {"origins": Config.CORS_ORIGINS}},
         supports_credentials=True,
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         expose_headers=['Content-Type'],
         max_age=3600)

    # Register blueprints with /api prefix
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(profile_bp, url_prefix='/api')
    app.register_blueprint(services_bp, url_prefix='/api')
    app.register_blueprint(messages_bp, url_prefix='/api')
    app.register_blueprint(requests_bp, url_prefix='/api')

    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({'status': 'ok', 'database': 'supabase'}), 200

    # Handle CORS preflight (only if needed - Flask-CORS usually handles this)
    @app.after_request
    def after_request(response):
        origin = request.headers.get('Origin')
        if origin in Config.CORS_ORIGINS:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        return response

    return app

if __name__ == '__main__':
    app = create_app()
    print("🚀 Server starting...")
    print("📊 Connected to Supabase")
    print("🌐 API running on http://localhost:5000")
    app.run(debug=True, port=5000, host='0.0.0.0')