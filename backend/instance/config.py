"""Flask configuration."""
from os import path
from dotenv import load_dotenv
import json
import os

basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, '.env'))


class Config(object):
    # Ensure templates are auto-reloaded
    TEMPLATES_AUTO_RELOAD = True
    # set application
    SESSION_PERMANENT = False
    SESSION_TYPE = "filesystem"
    GOOGLE_PLACES_API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY")
    GOOGLE_GEOLOCATION_API_KEY = os.environ.get("GOOGLE_GEOLOCATION_API_KEY")
    USER_DB_CONFIG = json.loads(os.environ.get("USER_DB_CONFIG"))
    #set secret key
    SECRET_KEY="secretstring"

class ProductionConfig(Config):
    FLASK_ENV = 'production'
    DEBUG = False


class DevelopmentConfig(Config):
    ENV = 'development'
    DEBUG = True


class TestingConfig(Config):
    TESTING = True