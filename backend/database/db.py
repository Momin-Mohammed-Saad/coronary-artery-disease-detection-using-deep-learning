from pymongo import MongoClient
import extensions

client = None
db = None

def init_db(app):
    global client, db
    try:
        
        client = MongoClient(app.config["MONGO_URI"])
        db = client["cad_database"]

    
        extensions.users = db["users"]
        extensions.patients = db["patients"]

        print("MongoDB Connected & Extensions Initialized")
    except Exception as e:
        print(f"MongoDB Connection Error: {e}")

def get_patients():
    
    if db is not None:
        return db["patients"]
    return None