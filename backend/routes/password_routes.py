from flask import Blueprint, request, jsonify
from flask_mail import Message
import bcrypt
import secrets
import extensions
from config import Config

password_bp = Blueprint("password_bp", __name__)


# FORGOT PASSWORD
@password_bp.route("/forgot-password", methods=["POST"])
def forgot_password():

    data = request.json
    email = data.get("email")

    user = extensions.users.find_one({"email": email})

    if not user:
        return jsonify({"msg": "Email not found"}), 404

    # generate token
    token = secrets.token_hex(20)

    # save token in DB
    extensions.users.update_one(
        {"email": email},
        {"$set": {"reset_token": token}}
    )

    # reset link
    reset_url = f"http://localhost:3000/reset-password/{token}"
    
    return jsonify({
    "msg": "Reset link generated",
    "token": token
})

    
    msg = Message(
        "Password Reset",
        sender=Config.MAIL_USERNAME,
        recipients=[email]
    )
    msg.body = f"Reset your password: {reset_url}"
    extensions.mail.send(msg)
    

# RESET PASSWORD 
@password_bp.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):

    data = request.json
    new_password = data.get("password")

    user = extensions.users.find_one({"reset_token": token})

    if not user:
        return jsonify({"msg": "Invalid or expired token"}), 400

    # hash password
    hashed_pw = bcrypt.hashpw(
        new_password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode('utf-8')

    # update password & remove token
    extensions.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {"password": hashed_pw},
            "$unset": {"reset_token": ""}
        }
    )

    return jsonify({"msg": "Password updated successfully"})