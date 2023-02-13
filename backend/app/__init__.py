from flask import Flask
from flask_cors import CORS
from instance.config import Config
from flask_session import Session

def create_app(config_class=Config):
    app = Flask(__name__)
    # app.config.from_object(config_class)

    # Initialize Flask extensions here
    CORS(app)
    Session(app)
    app.config.from_object(config_class)

    # Register blueprints
    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    from app.membership import bp as membership_bp
    app.register_blueprint(membership_bp, url_prefix='/membership')

    @app.route('/')
    def hello():
        return 'Hi! You are in backend.'

    return app