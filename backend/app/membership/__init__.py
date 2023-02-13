from flask import Blueprint

bp = Blueprint('membership', __name__)

from app.membership import routes