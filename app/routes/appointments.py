from datetime import datetime

from flask import Blueprint, request, jsonify

from app.extensions import db
from app.models.appointment import Appointment
from app.models.customer import Customer
from app.models.barber import Barber
from app.models.service import Service
from app.models.service_record import ServiceRecord


appointments_bp = Blueprint(
    "appointments",
    __name__,
    url_prefix="/api/appointments"
)


@appointments_bp.route("", methods=["POST"])
def create_appointment():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    customer_id = data.get("customer_id")
    barber_id = data.get("barber_id")
    service_id = data.get("service_id")
    scheduled_at = data.get("scheduled_at")

    if not customer_id:
        return jsonify({
            "error": "Customer ID is required"
        }), 400

    if not service_id:
        return jsonify({
            "error": "Service ID is required"
        }), 400

    if not scheduled_at:
        return jsonify({
            "error": "Appointment time is required"
        }), 400

    customer = db.session.get(Customer, customer_id)

    if not customer:
        return jsonify({
            "error": "Customer not found"
        }), 404

    service = db.session.get(Service, service_id)

    if not service:
        return jsonify({
            "error": "Service not found"
        }), 404

    if not service.is_active:
        return jsonify({
            "error": "Service is not active"
        }), 400

    barber = None

    if barber_id:
        barber = db.session.get(Barber, barber_id)

        if not barber:
            return jsonify({
                "error": "Barber not found"
            }), 404

        if not barber.is_active:
            return jsonify({
                "error": "Barber is not active"
            }), 400

    try:
        appointment_time = datetime.fromisoformat(
            scheduled_at
        )
    except ValueError:
        return jsonify({
            "error": "Invalid appointment date/time"
        }), 400

    appointment = Appointment(
        customer_id=customer.id,
        barber_id=barber.id if barber else None,
        service_id=service.id,
        scheduled_at=appointment_time,
        status="scheduled"
    )

    db.session.add(appointment)
    db.session.commit()

    return jsonify({
        "message": "Appointment created successfully",
        "appointment": {
            "id": appointment.id,
            "customer_id": appointment.customer_id,
            "barber_id": appointment.barber_id,
            "service_id": appointment.service_id,
            "scheduled_at": appointment.scheduled_at.isoformat(),
            "status": appointment.status
        }
    }), 201


@appointments_bp.route("", methods=["GET"])
def get_appointments():

    appointments = Appointment.query.order_by(
        Appointment.scheduled_at
    ).all()

    return jsonify({
        "appointments": [
            {
                "id": appointment.id,
                "customer": {
                    "id": appointment.customer.id,
                    "customer_number": appointment.customer.customer_number,
                    "first_name": appointment.customer.first_name,
                    "last_name": appointment.customer.last_name
                },
                "barber": (
                    {
                        "id": appointment.barber.id,
                        "first_name": appointment.barber.first_name,
                        "last_name": appointment.barber.last_name
                    }
                    if appointment.barber else None
                ),
                "service": {
                    "id": appointment.service.id,
                    "name": appointment.service.name,
                    "price": float(appointment.service.price)
                },
                "scheduled_at": (
                    appointment.scheduled_at.isoformat()
                    if appointment.scheduled_at
                    else None
                ),
                "status": appointment.status
            }
            for appointment in appointments
        ]
    }), 200

@appointments_bp.route(
    "/<int:appointment_id>/check-in",
    methods=["PATCH"]
)
def check_in_appointment(appointment_id):

    appointment = db.session.get(
        Appointment,
        appointment_id
    )

    if not appointment:
        return jsonify({
            "error": "Appointment not found"
        }), 404

    if appointment.status != "scheduled":
        return jsonify({
            "error": "Only scheduled appointments can be checked in"
        }), 400

    appointment.status = "checked_in"
    appointment.checked_in_at = datetime.now().astimezone()

    db.session.commit()

    return jsonify({
        "message": "Customer checked in successfully",
        "appointment_id": appointment.id,
        "status": appointment.status,
        "checked_in_at": appointment.checked_in_at.isoformat()
    }), 200

    
@appointments_bp.route(
    "/<int:appointment_id>/start",
    methods=["PATCH"]
)
def start_appointment(appointment_id):

    appointment = db.session.get(
        Appointment,
        appointment_id
    )

    if not appointment:
        return jsonify({
            "error": "Appointment not found"
        }), 404

    if appointment.status != "checked_in":
        return jsonify({
            "error": "Customer must be checked in first"
        }), 400

    appointment.status = "in_progress"

    db.session.commit()

    return jsonify({
        "message": "Service started",
        "appointment_id": appointment.id,
        "status": appointment.status
    }), 200

@appointments_bp.route(
    "/<int:appointment_id>/complete",
    methods=["PATCH"]
)
def complete_appointment(appointment_id):

    appointment = db.session.get(
        Appointment,
        appointment_id
    )

    if not appointment:
        return jsonify({
            "error": "Appointment not found"
        }), 404

    if appointment.status != "in_progress":
        return jsonify({
            "error": "Appointment must be in progress"
        }), 400

    if appointment.barber_id is None:
        return jsonify({
            "error": "Appointment has no barber assigned"
        }), 400

    service_record = ServiceRecord(
        customer_id=appointment.customer_id,
        barber_id=appointment.barber_id,
        service_id=appointment.service_id,
        price_charged=appointment.service.price
    )

    appointment.status = "completed"

    db.session.add(service_record)
    db.session.commit()

    return jsonify({
        "message": "Service completed successfully",
        "appointment_id": appointment.id,
        "service_record_id": service_record.id,
        "status": appointment.status,
        "price_charged": float(service_record.price_charged)
    }), 200

@appointments_bp.route("/queue", methods=["GET"])
def get_queue():
    queue = Appointment.query.filter(
        Appointment.status.in_(["checked_in", "in_progress"])
    ).order_by(Appointment.checked_in_at).all()

    return jsonify({
        "queue": [
            {
                "appointment_id": appointment.id,
                "customer": {
                    "customer_number": appointment.customer.customer_number,
                    "first_name": appointment.customer.first_name,
                    "last_name": appointment.customer.last_name
                },
                "service": appointment.service.name,
                "barber": (
                    f"{appointment.barber.first_name} {appointment.barber.last_name}"
                    if appointment.barber
                    else None
                ),
                "status": appointment.status,
                "checked_in_at": (
                    appointment.checked_in_at.isoformat()
                    if appointment.checked_in_at
                    else None
                )
            }
            for appointment in queue
        ]
    }), 200

