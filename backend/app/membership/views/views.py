from flask import Blueprint, request, render_template, redirect, session,flash

from werkzeug.exceptions import InternalServerError

from app.membership.infrastructure import db,auth
from app.membership.domain.user import User
from app.membership.domain.register_form import RegisterForm
from app.membership.infrastructure import UserRepo

bp = Blueprint('user', __name__, url_prefix='/user')


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

userrepo = UserRepo()


@bp.route("/register", methods=["GET", "POST"])
def register():
    """ Let user register account. """
    form = RegisterForm(meta={'csrf': False})
    if request.method == "POST":
        if not form.validate_on_submit():
            # print(form.errors)
            raise InternalServerError('Invalid form')
        try:
            receive = request.get_json()
            #Append data to the firebase db
            userrepo.create(receive)
            return "register successful"
        except:
            raise "not able to create account"
    else:
        if session.get("user_id"): 
            # Redirect to home page
            return redirect("/")
        else:
            # temporary
            return redirect("/register")
        
@bp.route("/login", methods=["GET", "POST"])
def login():    
    """ Login to webpage. """
    # forget any user using
    session.clear()
    if request.method == "POST":
        receive = request.get_json()
        try:
            user = auth.sign_in_with_email_and_password(receive["email"], receive["password"])
            # Remember which user has logged in
            session["user_id"] = user["localId"]
            # #Get the name of the user
            # data = db.child("users").get()
            # person["name"] = data.val()[person["user_id"]]["name"]
            return f"login successful, userid: {user['localId']}"
        except:
            raise "login info unreconizable"
    else:
        if session.get("user_id"): 
            # Redirect to home page
            return {}
        else:
            # temporary
            return {}
        
@bp.route("/edit_profile", methods=["GET", "POST"])
@login_required
def edit_profile():
    """ allow user to change profile. """

    if request.method == "POST":
        receive = request.get_json()

        result = userrepo.update(receive)

        return result
    else:
        return redirect("/")
    
@bp.route("/reset_password", methods=["POST"])
def reset_password():
    """ allow user to reset password """
    receive = request.get_json()

    auth.send_password_reset_email(receive['email'])
    return "reset password email successfully sent"


@bp.route("/logout")
@login_required
def logout():
    """Log user out"""
    session.clear()
    return redirect("/")

@bp.route("/delete", methods=["POST"])
def delete():
    """ allow user to reset password """
    receive = request.get_json()

    result = userrepo.delete(receive)
    return result

@bp.route("/add_friend", methods=["POST"])
@login_required
def add_friend():
    """allow user to make friends, passint the friend's uuid to become friends"""
    receive = request.get_json()

    result = userrepo.update(receive)
    return result


#I don't know what is this XD. Frank Hu
@bp.route("/track_userlog", methods=["POST"])
def stalking():
    submit = request.get_json()
    params = {
        "user_uuid":submit["user_uuid"]
    }
    obj = {}
    obj.update(db.child("users").child(params["user_uuid"]).get().val())
    user_log = db.child("user_log").get().val()
    for i in user_log:
        if (i == "log_count"):
            continue
        elif (params["user_uuid"] == user_log[i]["user_id"]):
            obj[i] = user_log[i]
    return obj