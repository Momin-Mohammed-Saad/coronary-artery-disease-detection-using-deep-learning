from flask_jwt_extended import JWTManager
from flask_mail import Mail
from pymongo import MongoClient


jwt = JWTManager()

mail = Mail()
users = None
patients = None

def init_extensions(app):
    jwt.init_app(app)
    mail.init_app(app)
