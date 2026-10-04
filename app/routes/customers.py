from flask import Blueprint, request, jsonify

from app.extensions import db
from app.models.customer import Customer
from app.models.service_record import ServiceRecord
from app.utils.customer_number import generate_customer_number
from app.utils.phone import normalize_phone


customers_bp = Blueprint(
    "customers",
    __name__,
    url_prefix="/api/customers"
)


@customers_bp.route("", methods=["POST"])
def create_customer():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    first_name = data.get("first_name")
    last_name = data.get("last_name")
    phone = normalize_phone(data.get("phone", "")) #edited

    if not first_name:
        return jsonify({
            "error": "First name is required"
        }), 400

    if not last_name:
        return jsonify({
            "error": "Last name is required"
        }), 400

    if not phone:
        return jsonify({
            "error": "Phone number is required"
        }), 400

    existing_customer = Customer.query.filter_by(
        phone=phone
    ).first()

    if existing_customer:
        return jsonify({
            "message": "Customer already exists",
            "customer": {
                "id": existing_customer.id,
                "customer_number": existing_customer.customer_number,
                "first_name": existing_customer.first_name,
                "last_name": existing_customer.last_name,
                "phone": existing_customer.phone
            }
        }), 200

    customer_number = generate_customer_number(
        first_name,
        last_name,
        phone
    )

    existing_number = Customer.query.filter_by(
        customer_number=customer_number
    ).first()

    if existing_number:
        return jsonify({
            "error": "Unable to generate a unique customer number"
        }), 409

    customer = Customer(
        customer_number=customer_number,
        first_name=first_name,
        last_name=last_name,
        phone=phone
    )

    db.session.add(customer)
    db.session.commit()

    return jsonify({
        "message": "Customer created successfully",
        "customer": {
            "id": customer.id,
            "customer_number": customer.customer_number,
            "first_name": customer.first_name,
            "last_name": customer.last_name,
            "phone": customer.phone
        }
    }), 201



@customers_bp.route("", methods=["GET"])
def get_customers():

    customers = Customer.query.order_by(
        Customer.first_name
    ).all()

    return jsonify({
        "customers": [
            {
                "id": customer.id,
                "customer_number": customer.customer_number,
                "first_name": customer.first_name,
                "last_name": customer.last_name,
                "phone": customer.phone
            }
            for customer in customers
        ]
    }), 200


@customers_bp.route(
    "/<int:customer_id>/history",
    methods=["GET"]
)
def get_customer_history(customer_id):

    customer = db.session.get(
        Customer,
        customer_id
    )

    if not customer:
        return jsonify({
            "error": "Customer not found"
        }), 404

    records = ServiceRecord.query.filter_by(
        customer_id=customer.id
    ).order_by(
        ServiceRecord.served_at.desc()
    ).all()

    return jsonify({
        "customer": {
            "id": customer.id,
            "customer_number": customer.customer_number,
            "first_name": customer.first_name,
            "last_name": customer.last_name,
            "phone": customer.phone
        },
        "service_history": [
            {
                "id": record.id,
                "service": record.service.name,
                "barber": (
                    f"{record.barber.first_name} "
                    f"{record.barber.last_name}"
                ),
                "price_charged": float(record.price_charged),
                "served_at": record.served_at.isoformat()
            }
            for record in records
        ]
    }), 200