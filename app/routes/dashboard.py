from datetime import datetime
from zoneinfo import ZoneInfo

from flask import Blueprint, jsonify
from sqlalchemy import func

from app.extensions import db
from app.models.customer import Customer
from app.models.appointment import Appointment
from app.models.service_record import ServiceRecord


dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/api/dashboard"
)


SOUTH_AFRICA = ZoneInfo("Africa/Johannesburg")


@dashboard_bp.route("", methods=["GET"])
def get_dashboard():

    now = datetime.now(SOUTH_AFRICA)

    start_of_day = now.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    end_of_day = start_of_day.replace(
        hour=23,
        minute=59,
        second=59,
        microsecond=999999
    )

    customers_today = Customer.query.filter(
        Customer.created_at >= start_of_day,
        Customer.created_at <= end_of_day
    ).count()

    appointments_today = Appointment.query.filter(
        Appointment.scheduled_at >= start_of_day,
        Appointment.scheduled_at <= end_of_day
    ).count()

    completed_today = ServiceRecord.query.filter(
        ServiceRecord.served_at >= start_of_day,
        ServiceRecord.served_at <= end_of_day
    ).count()

    revenue_today = db.session.query(
        func.coalesce(
            func.sum(ServiceRecord.price_charged),
            0
        )
    ).filter(
        ServiceRecord.served_at >= start_of_day,
        ServiceRecord.served_at <= end_of_day
    ).scalar()

    return jsonify({

        "date": now.date().isoformat(),

        "customers_registered_today":
            customers_today,

        "appointments_today":
            appointments_today,

        "services_completed_today":
            completed_today,

        "revenue_today":
            float(revenue_today)

    }), 200