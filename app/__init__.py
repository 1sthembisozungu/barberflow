from flask import Flask, send_from_directory

from .config import Config
from .extensions import db


def create_app():

    app = Flask(
        __name__,
        static_folder="../frontend",
        static_url_path=""
    )

    app.config.from_object(Config)

    db.init_app(app)

    from .models import (
        Customer,
        Barber,
        Service,
        Appointment,
        ServiceRecord
    )

    from .routes import (
        customers_bp,
        services_bp,
        barbers_bp,
        appointments_bp,
        dashboard_bp
    )

    app.register_blueprint(customers_bp)
    app.register_blueprint(services_bp)
    app.register_blueprint(appointments_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(barbers_bp)

    return app