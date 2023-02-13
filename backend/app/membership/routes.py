import pyrebase
from instance.config import Config
from app.membership import bp
from flask import redirect, request, session, flash
from app.membership.utils import login_required

# read firebase configuration
config = Config.USER_DB_CONFIG

# initialize firebase
firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()

# user info
person = {"name":"", "email":"","birthday":"", "user_id":"", "change_name_chance":0}

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
            "new_name" : submit["userName"],
            "new_region": submit["region"]
        }
        try:
            newUser = auth.create_user_with_email_and_password(params["new_email"], params["new_password"])
            #Append data to the firebase db
            data = {"name": params["new_name"], "email": params["new_email"], "birthday": params["new_birthday"], "region": params["new_region"],"change_name_chance": 1}
            db.child("users").child(newUser['localId']).set(data)
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
    global person
    if request.method == "POST":
        submit = request.get_json()
        if person["change_name_chance"]:
            person["change_name_chance"]-=1
            new_name = submit["name"]
            db.child("users").child(person["user_id"]).update({"name":new_name})
        else:
            flash("Cannot change profile anymore.")
    else:
        return redirect("/")

@bp.route("/reset_password", methods=["POST"])
def reset_password():
    """ allow user to reset password """
    submit = request.get_json()
    params = {
        "email" : submit["email"],
    }
    auth.send_password_reset_email(params['email'])
    return "reset password email successfully sent"


@bp.route("/logout")
@login_required
def logout():
    """Log user out"""
    session.clear()
    return redirect("/")