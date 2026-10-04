from app.extensions import db


class Appointment(db.Model):
    __tablename__ = "appointments"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    customer_id = db.Column(
        db.Integer,
        db.ForeignKey("customers.id"),
        nullable=False
    )

    barber_id = db.Column(
        db.Integer,
        db.ForeignKey("barbers.id"),
        nullable=True
    )

    service_id = db.Column(
        db.Integer,
        db.ForeignKey("services.id"),
        nullable=False
    )

    scheduled_at = db.Column(
        db.DateTime(timezone=True)
    )

    checked_in_at = db.Column(
        db.DateTime(timezone=True)
    )

    status = db.Column(
        db.String(20),
        nullable=False,
        default="scheduled"
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now()
    )

    customer = db.relationship(
        "Customer",
        backref="appointments"
    )

    barber = db.relationship(
        "Barber",
        backref="appointments"
    )

    service = db.relationship(
        "Service",
        backref="appointments"
    )