from functools import wraps
from flask import redirect, session

def login_required(f):
    """ Decorate routes to require login. """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function