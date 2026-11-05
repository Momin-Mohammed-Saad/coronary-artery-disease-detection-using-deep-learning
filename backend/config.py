class Config:

    JWT_SECRET_KEY = "super-secret-key"

    MONGO_URI = "mongodb://localhost:27017/"
    DATABASE_NAME = "cad_database"

    MODEL_PATH = "model/CAD_DenseNet121_Final.keras"
    THRESHOLD = 0.56

    # Mail config
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'your_email@gmail.com'  # This email is used to send OTP.
    MAIL_PASSWORD = 'passward'              # Add Your, Google APP password (16 digit key) 
    MAIL_DEFAULT_SENDER = "your_email@gmail.com" 