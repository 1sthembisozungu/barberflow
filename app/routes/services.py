from flask import Blueprint, jsonify

from app.models.service import Service


services_bp = Blueprint(
    "services",
    __name__,
    url_prefix="/api/services"
)


@services_bp.route("", methods=["GET"])
def get_services():

    services = Service.query.filter_by(
        is_active=True
    ).order_by(Service.name).all()

    return jsonify({
        "services": [
            {
                "id": service.id,
                "name": service.name,
                "description": service.description,
                "price": float(service.price),
                "estimated_duration": service.estimated_duration
            }
            for service in services
        ]
    }), 200