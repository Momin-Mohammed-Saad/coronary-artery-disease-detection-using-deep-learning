import os
from datetime import datetime
from bson import ObjectId  
from database.db import get_patients
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import models.model_loader as ml
from utils.preprocess import preprocess
import extensions
from config import Config
from werkzeug.utils import secure_filename  

predict_bp = Blueprint("predict_bp", __name__)

os.makedirs("uploads", exist_ok=True)


@predict_bp.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    try:
        print("---- REQUEST START ----")
        print("HEADERS:", request.headers)

        # Model check
        if not ml.model_ready:
            return jsonify({"error": "Model not loaded"}), 500

        # JWT
        try:
            doctor_id = get_jwt_identity()
            print("Doctor ID:", doctor_id)
        except Exception as e:
            print("JWT ERROR:", e)
            return jsonify({"error": "Invalid token"}), 401

        # Form data
        name = request.form.get("name")
        age = request.form.get("age")
        gender = request.form.get("gender")
        image = request.files.get("image")

        print("FORM:", name, age, gender)
        print("FILES:", image)

        if not name or not age or not gender or not image:
            return jsonify({"error": "Missing required fields"}), 400

        # Save image
        filename = secure_filename(image.filename) or "upload.jpg"
        image_path = os.path.join("uploads", filename)
        image.save(image_path)
        print("Image saved:", image_path)

        # Prediction
        processed = preprocess(image_path)
        print("Processed shape:", processed.shape)

        prediction = ml.model.predict(processed)
        print("Raw prediction:", prediction)

        score = float(prediction[0][0])
        print("Score:", score)

        # Threshold
        threshold = getattr(Config, "THRESHOLD", 0.6)

        if score >= threshold:
            result = "Positive - CAD Detected"
            label= "CAD"
            confidence = score
        else:
            result = "Negative - No CAD"
            label="Normal"
            confidence = 1 - score

        # Doctor name
        doctor_name = "Unknown Doctor"
        try:
            user_data = extensions.users.find_one({"_id": ObjectId(doctor_id)})
            if user_data:
                doctor_name = user_data.get("name", "Unknown Doctor")
        except Exception as e:
            print("Doctor error:", e)

        # Save DB
        patient_data = {
            "doctor_id": str(doctor_id),
            "doctor_name": doctor_name,
            "name": name,
            "age": age,
            "gender": gender,
            "prediction": result,
            "label": label,
            "confidence": round(float(confidence) * 100, 2),
            "date": datetime.utcnow()
        }

        patients_col = get_patients()
        inserted = patients_col.insert_one(patient_data)

        # Response
        response_data = {
            "_id": str(inserted.inserted_id),
            "name": name,
            "prediction": result,
            "label": label,
            "confidence": round(float(confidence) * 100, 2),
            "doctor_name": doctor_name,
            "date": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        }

        print("SUCCESS RESPONSE")

        return jsonify(response_data), 200

    except Exception as e:
        print("FINAL ERROR:", e)
        return jsonify({"error": str(e)}), 500