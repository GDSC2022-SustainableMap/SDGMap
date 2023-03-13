from flask import Blueprint, request, render_template, redirect,flash,jsonify

from werkzeug.exceptions import InternalServerError

from app.membership.infrastructure import db,auth
from app.membership.domain.register_form import RegisterForm
from app.membership.infrastructure import UserRepo


from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required
from datetime import datetime, timedelta, timezone
import json
bp = Blueprint('user', __name__, url_prefix='/user')


from functools import wraps
from flask import redirect

userrepo = UserRepo()

@bp.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response
    
@bp.route("/register", methods=["GET", "POST"])
def register():
    """ Let user register account. """
    WTF_CSRF_ENABLED = False
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
        if get_jwt_identity(): 
            # Redirect to home page
            return redirect("/")
        else:
            # temporary
            return redirect("/register")
        
@bp.route("/login", methods=["GET", "POST"])
def login():    
    """ Login to webpage. """
    if request.method == "POST":
        receive = request.get_json()
        try:
            user = auth.sign_in_with_email_and_password(receive["email"], receive["password"])
            # Remember which user has logged in
            access_token = create_access_token(identity=user["localId"])

            # return f"login successful, userid: {user['localId']},access_token: {access_token}"
            response = {"access_token":access_token,"msg":"Login successfully!"}
            return response
        except:
            raise "login info unreconizable"
    else:
        if get_jwt_identity(): 
            # Redirect to home page
            return {}
        else:
            # temporary
            return {}
        
@bp.route("/edit_profile", methods=["GET", "POST"])
@jwt_required()
def edit_profile():
    """ allow user to change profile. """

    if request.method == "POST":
        receive = request.get_json()
        current_user = get_jwt_identity()
        receive['user_id'] = current_user
        result = userrepo.update(receive)
        print(receive)
        return result
    else:
        return redirect("/")

@bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    """ allow user to get profile. """
    current_user = get_jwt_identity()
    receive = {'user_id':current_user}
    result = userrepo.read(receive)
    return result
    
@bp.route("/reset_password", methods=["POST"])
@jwt_required()
def reset_password():
    """ allow user to reset password """
    receive = request.get_json()

    auth.send_password_reset_email(receive['email'])
    return "reset password email successfully sent"


@bp.route("/logout")
@jwt_required()
def logout():
    """Log user out"""
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@bp.route("/delete", methods=["POST"])
def delete():
    """ allow user to reset password """
    receive = request.get_json()

    result = userrepo.delete(receive)
    return result

@bp.route("/add_friend", methods=["POST"])
@jwt_required()
def add_friend():
    """allow user to make friends, passint the friend's uuid to become friends"""
    receive = request.get_json()

    result = userrepo.update(receive)
    return result

#I don't know what is this XD. Frank Hu
@bp.route("/track_userlog", methods=["POST"])
def get_specific_userlog():
    """ gives back the userlog of a specific user """
    submit = request.get_json()
    params = {
        "user_uuid":submit["user_uuid"]
    }
    obj = {}
    user_log = db.child("user_log").get().val()
    for key in user_log:
        if (key == "log_count"):
            continue
        elif (params["user_uuid"] == user_log[key]["user_id"]):
            obj[key] = user_log[key]
    return obj