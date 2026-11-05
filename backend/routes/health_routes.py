from flask import Blueprint, jsonify, current_app

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
def health():
    try:
        model = current_app.config.get("MODEL")

        if model is not None:
            return jsonify({"status": "online"}), 200
        else:
            return jsonify({"status": "offline"}), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500