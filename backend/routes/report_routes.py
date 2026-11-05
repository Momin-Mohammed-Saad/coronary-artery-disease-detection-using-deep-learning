from flask import Blueprint, request, send_file, jsonify
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from bson import ObjectId
from database.db import get_patients
from utils.pdf_generator import generate_pdf

report_bp = Blueprint("report_bp", __name__)

@report_bp.route("/report/<id>", methods=["GET", "OPTIONS"])
@cross_origin(origins="http://localhost:3000")
@jwt_required()
def download_report(id):

    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        # fetch patient from database
        patients = get_patients()
        patient = patients.find_one({"_id": ObjectId(id)})

        if not patient:
            return jsonify({"error": "Report not found"}), 404

        
        pdf_buffer = generate_pdf(patient)

        
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=f"{patient['name'].replace(' ', '_')}_CAD_Report.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:
        print("REPORT ERROR:", e)
        return jsonify({"error": str(e)}), 500