from app.extensions import db


class ServiceRecord(db.Model):
    __tablename__ = "service_records"

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
        nullable=False
    )

    service_id = db.Column(
        db.Integer,
        db.ForeignKey("services.id"),
        nullable=False
    )

    price_charged = db.Column(
        db.Numeric(10, 2),
        nullable=False
    )

    served_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now()
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        server_default=db.func.now()
    )

    customer = db.relationship(
        "Customer",
        backref="service_records"
    )

    barber = db.relationship(
        "Barber",
        backref="service_records"
    )

    service = db.relationship(
        "Service",
        backref="service_records"
    )