from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
import bcrypt
import extensions

admin_bp = Blueprint("admin_bp", __name__)

def is_admin(user_id):
    
    if extensions.users is None:
        print("Error: extensions.users is still None!")
        return False
        
    user = extensions.users.find_one({"_id": ObjectId(user_id)})
    return user and user.get("role") == "admin"


@admin_bp.route("/get-all-doctors", methods=["GET"])
@jwt_required()
def get_doctors():
    uid = get_jwt_identity()

    if not is_admin(uid):
        return jsonify({"msg": "Admin access required"}), 403

    
    docs = list(extensions.users.find({"role": "doctor"}))

    for d in docs:
        d["_id"] = str(d["_id"])
        
        d.pop("password", None)

    return jsonify(docs)


@admin_bp.route("/delete-doctor/<doctor_id>", methods=["DELETE"])
@jwt_required()
def delete_doctor(doctor_id):
    uid = get_jwt_identity()

    if not is_admin(uid):
        return jsonify({"msg": "Admin access required"}), 403

    
    extensions.users.delete_one({"_id": ObjectId(doctor_id)})
    extensions.patients.delete_many({"doctor_id": doctor_id})

    return jsonify({"msg": "Doctor deleted"})