from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models.barber import Barber


barbers_bp = Blueprint(
    "barbers",
    __name__,
    url_prefix="/api/barbers"
)


# ======================================================
# GET ALL ACTIVE BARBERS
# GET /api/barbers
# ======================================================

@barbers_bp.route("", methods=["GET"])
def get_barbers():

    barbers = Barber.query.filter_by(
        is_active=True
    ).order_by(Barber.first_name).all()

    return jsonify({
        "barbers": [
            {
                "id": barber.id,
                "first_name": barber.first_name,
                "last_name": barber.last_name
            }
            for barber in barbers
        ]
    }), 200


# ======================================================
# CREATE BARBER
# POST /api/barbers
# ======================================================

@barbers_bp.route("", methods=["POST"])
def create_barber():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required."
        }), 400


    first_name = data.get("first_name")
    last_name = data.get("last_name")


    if not first_name or not last_name:

        return jsonify({
            "error": "First name and last name are required."
        }), 400


    first_name = first_name.strip()
    last_name = last_name.strip()


    if not first_name or not last_name:

        return jsonify({
            "error": "First name and last name cannot be empty."
        }), 400


    barber = Barber(
        first_name=first_name,
        last_name=last_name
    )


    db.session.add(barber)
    db.session.commit()


    return jsonify({
        "message": "Barber created successfully.",
        "barber": {
            "id": barber.id,
            "first_name": barber.first_name,
            "last_name": barber.last_name,
            "is_active": barber.is_active
        }
    }), 201