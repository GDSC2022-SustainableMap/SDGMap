from flask import Flask
from flask_cors import CORS
from instance.config import Config
from flask_session import Session
import pyrebase
from instance.config import Config
from flask_jwt_extended import JWTManager
import os
# read firebase configuration
config = Config.USER_DB_CONFIG
# initialize firebase
firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()
jwt_key = Config.JWT_SECRET_KEY


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.update(SECRET_KEY=os.urandom(24))
    jwt = JWTManager(app)
    # app.config.from_object(config_class)

    # Initialize Flask extensions here
    CORS(app)
    app.config.from_object(config_class)
    #Session(app)
    # # Register blueprints
    # from app.main import bp as main_bp
    # app.register_blueprint(main_bp)

    # from app.membership import bp as membership_bp
    # app.register_blueprint(membership_bp, url_prefix='/membership')
    from .membership import views as user_views
    from .map import views as map_views
    views = [user_views,map_views]
    register_blueprints(app, views)
    @app.route('/')
    def hello():
        return 'Hi! You are in backend.'

    return app


def register_blueprints(app, views):
    for view in views:
        app.register_blueprint(view.bp)