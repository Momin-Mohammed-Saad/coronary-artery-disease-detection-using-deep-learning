from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import init_extensions, jwt
from database.db import init_db
from models.model_loader import load_model
from datetime import timedelta

# Import Routes
from routes.auth_routes import auth_bp
from routes.predict_routes import predict_bp
from routes.history_routes import history_bp
from routes.admin_routes import admin_bp
from routes.report_routes import report_bp
from routes.password_routes import password_bp
from routes.health_routes import health_bp

def create_app():
    app = Flask(__name__)

    # Configuration
    app.config.from_object(Config)
    app.config["MONGO_URI"] = "mongodb://localhost:27017/cad_database"
    app.config["JWT_SECRET_KEY"] = "super-secret-key-12345678901234567890"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)

    #  CORS
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
    
    # Initialize Extensions (JWT & Mail)
    init_extensions(app)

    # JWT Error Handlers 
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print(" INVALID TOKEN:", error)
        return {"error": "Invalid token"}, 422

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        print(" MISSING TOKEN:", error)
        return {"error": "Missing token"}, 401
    
    # Initialize Database 
    init_db(app)

    # Load AI Model
    load_model()

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(predict_bp, url_prefix="/api")
    app.register_blueprint(history_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api")
    app.register_blueprint(report_bp, url_prefix="/api")
    app.register_blueprint(password_bp, url_prefix="/api")
    app.register_blueprint(health_bp, url_prefix="/api")

    @app.route("/")
    def home():
        return "Backend Running Successfully"

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)