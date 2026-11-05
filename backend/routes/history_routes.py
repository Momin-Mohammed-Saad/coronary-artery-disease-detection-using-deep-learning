from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
import extensions

history_bp = Blueprint("history_bp", __name__)

@history_bp.route("/history", methods=["GET"])
@jwt_required()
def history():
    doctor_id = get_jwt_identity()


    if extensions.patients is None:
        return jsonify({"msg": "Database patients collection not initialized"}), 500

    records = list(extensions.patients.find({"doctor_id": doctor_id}))

    for r in records:
        r["_id"] = str(r["_id"])

    return jsonify(records)

@history_bp.route("/delete-history/<patient_id>", methods=["DELETE"])
@jwt_required()
def delete_history(patient_id):
    doctor_id = get_jwt_identity()

    if extensions.patients is None:
        return jsonify({"msg": "Database error"}), 500

    result = extensions.patients.delete_one({
        "_id": ObjectId(patient_id),
        "doctor_id": doctor_id
    })

    if result.deleted_count == 0:
        return jsonify({"msg":"Record not found"}), 404

    return jsonify({"msg":"History deleted successfully"})