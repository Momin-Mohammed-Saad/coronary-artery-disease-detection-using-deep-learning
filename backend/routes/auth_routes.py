from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from flask_mail import Message
import secrets
import bcrypt
from bson import ObjectId
import extensions
from config import Config
import random

auth_bp = Blueprint("auth_bp", __name__)

otp_store = {}


#  REGISTER STEP 1 (SEND OTP) 
@auth_bp.route("/send-otp", methods=["POST"])
def send_otp():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"msg": "Email required"}),400

    # check already exists
    if extensions.users.find_one({"email": email}):
        return jsonify({"msg": "Email already exists"}), 400

    otp = str(random.randint(100000, 999999))
    otp_store[email] = otp

    msg = Message(
    subject="Verify Your Email - OTP Code",
    sender="your_email@gmail.com",
    recipients=[email],
    body=f"""
Hello,
Thank you for registering with CAD Diagnostic AI.
Your verification code is: {otp}
This code will expire in 5 minutes.

For your security, never share this OTP with anyone.
If you did not request this, please ignore this email.

Best regards,  
CAD AI Support Team
"""
)

    try:
        extensions.mail.send(msg)
        return jsonify({"msg": "OTP sent"}), 200

    except Exception as e:
        print("MAIL ERROR:", e) 
        return jsonify({"msg": "Failed to send OTP"}), 500


# REGISTER STEP 2 (VERIFY OTP + CREATE USER)
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data["email"]
    otp = data["otp"]

    if otp_store.get(email) != otp:
        return jsonify({"msg": "Invalid OTP"}), 400

    hashed_pw = bcrypt.hashpw(
        data["password"].encode("utf-8"),
        bcrypt.gensalt()
    )

    user_count = extensions.users.count_documents({})
    user_role = "admin" if user_count == 0 else "doctor"

    extensions.users.insert_one({
        "name": data["name"],
        "email": email,
        "password": hashed_pw,
        "role": user_role
    })

    otp_store.pop(email, None)

    return jsonify({"msg": "Registered successfully"})


#  LOGIN 
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    user = extensions.users.find_one({"email": data["email"]})

    if not user:
        return jsonify({"msg": "User not found"}), 404

    if not bcrypt.checkpw(
        data["password"].encode("utf-8"),
        user["password"]
    ):
        return jsonify({"msg": "Wrong password"}), 401

    token = create_access_token(identity=str(user["_id"]))

    return jsonify({
        "token": token,
        "name": user["name"],
        "role": user.get("role", "doctor")
    })

