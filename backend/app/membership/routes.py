import pyrebase
from instance.config import Config
from app.membership import bp
from flask import redirect, request, session, flash
from app.membership.utils import login_required
from os import path
from firebase import firebase as fb

from app.membership.utils import login_required
import sys
basedir = path.abspath(path.dirname(path.abspath(path.dirname(path.abspath(path.dirname(__file__))))))
basedir+="/database"
sys.path.append(basedir)
import database

# read firebase configuration
config = Config.USER_DB_CONFIG

# initialize firebase
firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()

@bp.route("/login", methods=["GET", "POST"])
def login():
    """ Login to webpage. """
    # forget any user using
    session.clear()
    if request.method == "POST":
        receive = request.get_json()
        params = {
            "user_email" : receive["email"],
            "user_password" : receive["password"]
        }
        try:
            #Try signing in the user with the given information
            user = auth.sign_in_with_email_and_password(params["user_email"], params["user_password"])           

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
    
@bp.route("/register", methods=["GET", "POST"])
def register():
    """ Let user register account. """
    if request.method == "POST":
        submit = request.get_json()
        params = {
            "new_email" : submit["email"],
            "new_password" : submit["password"],
            "new_birthday" : submit["birthday"],
            "new_name" : submit["userName"]
        }
        try:
            newUser = auth.create_user_with_email_and_password(params["new_email"], params["new_password"])
            # new user info
            person = database.user_setting.copy()
            person["email"] = params["new_email"]
            person["name"] = params["new_name"]
            person["birthday"] = params["new_birthday"]
            db.child("users").child(newUser['localId']).set(person)
            return "register successful"
        except:
            raise "not able to create account"
            # return "not able to create account"
    else:
        if session.get("user_id"): 
            # Redirect to home page
            return redirect("/")
        else:
            # temporary
            return redirect("/register")

@bp.route("/edit_profile", methods=["GET", "POST"])
@login_required
def edit_profile():
    """ allow user to change profile. """
    submit = request.get_json()
    params = {
        "biograph":submit["biograph"],
        "name":submit["name"]
    }
    try:
        if (params["biograph"]):
            db.child("users").child(session["user_id"]).update({"biograph":params["biograph"]})
        if (params["name"]):
            db.child("users").child(session["user_id"]).update({"name":params["name"]})
        return "successfully changed profile"
    except:
        return "error"

@bp.route("/reset_password", methods=["POST"])
def reset_password():
    """ allow user to reset password """
    submit = request.get_json()
    params = {
        "email" : submit["email"],
    }
    auth.send_password_reset_email(params['email'])
    return "reset password email successfully sent"

@bp.route("/add_friend", methods=["POST"])
@login_required
def add_friend():
    """allow user to make friends, passint the friend's uuid to become friends"""
    submit = request.get_json()
    params = {
        "friend_uuid":submit["friend_uuid"]
    }
    friend_name = db.child("users").child(params["friend_uuid"]).get().val()["name"]
    current_user = session["user_id"]
    current_user_friend_num = db.child("users").child(current_user).get().val()["friends"]["friend_number"]
    current_user_friend_num += 1
    
    # update new friend to firebase
    db.child("users").child(current_user).child("friends").child(f"friend_{current_user_friend_num}").update({"name":friend_name, "user_id":params["friend_uuid"]})
    db.child("users").child(current_user).child("friends").update({"friend_number":current_user_friend_num})
    return f"{params['friend_uuid']} added as friend"

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


@bp.route("/logout")
@login_required
def logout():
    """Log user out"""
    session.clear()
    return "logged out"