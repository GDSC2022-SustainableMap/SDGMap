from flask import Blueprint, request, render_template, redirect,flash,jsonify

from werkzeug.exceptions import InternalServerError

from app.app import db, auth, storage
from app.membership.domain.register_form import RegisterForm
from app.membership.infrastructure import UserRepo
from app.membership.domain.friend import Friend
from app.app import firebase
from app.membership.views.utils import *
Db = firebase.database()
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required
from datetime import datetime, timedelta, timezone
import json


bp = Blueprint('user', __name__, url_prefix='/user')

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
    print(request.get_json())
    WTF_CSRF_ENABLED = False
    form = RegisterForm(meta={'csrf': False})
    if request.method == "POST":
        if not form.validate_on_submit():
            print(form.errors)
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
            print(f"user: {user}")
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
        # print(receive)
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
    new_dict = {key:val for key, val in result.items() if key in  ["backpack","badges","biograph","coin","email","name"]}
    new_dict["friend_number"] = result["friends"]["friend_number"]
    print(new_dict)
    return new_dict
    
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
    current_user = get_jwt_identity()
    messages = {}
    if ("friend_email" in receive):
        current_user = get_jwt_identity()
        friend_id = email_to_userid(receive['friend_email'])
        print(friend_id)
        #確認是否是加自己
        if(friend_id == current_user):
            messages["msg"] = "Cannot add yourself!"
            status = 502
            return messages, status
        current_user_friend_num = db.child("users").child(current_user).get().val()["friends"]["friend_number"]
        current_user_friend = db.child("users").child(current_user).get().val()["friends"]

        #確認是否有這個id的人
        print(current_user)
        friend = db.child("users").child(friend_id).get().val()
        print(friend)
        if (friend is None):
            messages["msg"] = "This person does not exist!"
            status = 204
        friend_name = friend["name"]
    
        #確認是否重複加入好友
        # print(current_user_friend.items())
        for key, value in current_user_friend.items():
            if key != "friend_number":
                print(value)
                if friend_id in value.values():
                    messages["msg"] = "You have this frined already!"
                    status = 502
                    return messages, status
        #如果好友多餘20個就回報錯誤
        if(current_user_friend_num >= 20):
            messages["msg"] = "You can only have 20 frineds!"
            status = 502
            return messages, status
        current_user_friend_num += 1
        friend = Friend(friend_id,friend_name).info
        # update new friend to firebase
        db.child("users").child(current_user).child("friends").child("friend_" + f"{current_user_friend_num}").set(friend)
        db.child("users").child(current_user).child("friends").update({"friend_number":current_user_friend_num})

        messages["msg"] = f"{receive['friend_email']} added as friend"
        status = 201
        return messages, status
    return messages

@bp.route("/delete_friend", methods=["POST"])
@jwt_required()
def delete_friend():
    receive = request.get_json()
    params = {"user_email": receive['friend_email']}
    current_user = get_jwt_identity()
    friend_id = email_to_userid(params["user_email"])
    current_user_friend_count = (
                db.child("users")
                .child(current_user)
                .child("friends")
                .child("friend_number")
                .get()
                .val()
            )
    if(current_user == friend_id):
        return {"msg":f"You cannot delete youself! Current friend number:{current_user_friend_count}"},502
    
    friends = db.child("users").child(current_user).child("friends").get().val()

    for key,val in friends.items():

        if(key == "friend_number"):
            continue
        if (val["user_id"] == friend_id):
            friend_key = key[7:]

            db.child("users").child(current_user).child("friends").child(f"friend_{friend_key}").remove()
            current_user_friend_count -= 1

            db.child("users").child(current_user).child("friends").update({"friend_number": current_user_friend_count})
            return {"msg":f'{params["user_email"]} deleted!  Current friend number:{current_user_friend_count}'},201
    return {"msg":f"This friend dos not exists! Current friend number:{current_user_friend_count}"},502
    

@bp.route("/track_userlog", methods=["GET","POST"])
@jwt_required(True)
def get_specific_userlog():
    """ gives back the userlog of a specific user """
    # submit = request.get_json()
    # params = {
    #     "user_uuid":submit["user_uuid"]
    # }
    # obj = {}
    # user_log = db.child("user_log").get().val()
    # for key in user_log:
    #     if (key == "log_count"):
    #         continue
    #     elif (params["user_uuid"] == user_log[key]["user_id"]):
    #         obj[key] = user_log[key]
    current_user = get_jwt_identity()
    print(current_user)
    user_log = db.child("user_log").child(current_user).get().val()
    print(user_log)
    obj = {"log_spots":[]}
    if(user_log):
        for key in user_log:
            if (key == "log_count"):
                continue
            else:
                for inner_key in user_log[key]:
                    obj["log_spots"].append(user_log[key][inner_key])
        print(obj)
        return obj
    else:
        return {"msg":"No user_save record!"},204


@bp.route("/track_usersave", methods=["GET","POST"])
@jwt_required(True)
def get_specific_usersave():
    """ gives back the usersave of a specific user """
    # submit = request.get_json()
    # params = {
    #     "user_uuid":submit["user_uuid"]
    # }
    # obj = {}
    # user_log = db.child("user_log").get().val()
    # for key in user_log:
    #     if (key == "log_count"):
    #         continue
    #     elif (params["user_uuid"] == user_log[key]["user_id"]):
    #         obj[key] = user_log[key]
    current_user = get_jwt_identity()
    print(current_user)
    user_save = db.child("user_save").child(current_user).get().val()
    obj = {"save_spots_id":[],"save_spots":[]}
    if(user_save):
        for key in user_save:
            if (key == "save_count"):
                continue
            else:
                obj["save_spots_id"].append(user_save[key]["place_id"])
                obj["save_spots"].append(user_save[key])
        print(obj)
        return obj,201
    else:
        return obj,201


@bp.route("/upload_image", methods=["GET", "POST"])
@jwt_required()
def add_profile_image():
    """ This allows the user to upload its own profile picture."""
    current_user = get_jwt_identity()
    submit = request.get_json()
    base64_image = submit["base64_image"]
    png_str = base64_to_png(base64_image)
    Db.child("profile_pics").child(current_user).set(png_str)
    # return '<img src="data:{}">'.format(png_str)
    return jsonify({"data":png_str})

@bp.route("/get_image", methods=["GET", "POST"])
@jwt_required()
def get_user_image():
    # submit = request.get_json()
    # params = {
    #     "user_uuid": submit["user_uuid"]
    # }
    current_user = get_jwt_identity()
    user_base64img = Db.child("profile_pics").child(current_user).get().val()
    return jsonify(user_base64img)

@bp.route("/leaderboard", methods=["GET"])
@jwt_required()
def get_leaderboard():
    all_user = Db.child("users").get().val()
    sorted_user = sorted(all_user.items(),key=lambda x: x[1]["coin"],reverse=True)


    ordered_user = []
    for i in sorted_user[:5]:
        new_dict = {key:val for key, val in i[1].items() if key in  ["backpack","badges","biograph","coin","email","name"]}
        
        new_dict["friend_number"] = i[1]["friends"]["friend_number"]
        user_log = db.child("user_log").child(i[0]).get().val()
        # print(user_log)
        log_obj = {"log_spots":[]}
        if(user_log):
            for key in user_log:
                if (key == "log_count"):
                    continue
                else:
                    for inner_key in user_log[key]:
                        log_obj["log_spots"].append(user_log[key][inner_key])
        print(log_obj)
        user_save = db.child("user_save").child(i[0]).get().val()
        save_obj = {"save_spots_id":[],"save_spots":[]}
        if(user_save):
            for key in user_save:
                if (key == "save_count"):
                    continue
                else:
                    save_obj["save_spots_id"].append(user_save[key]["place_id"])
                    save_obj["save_spots"].append(user_save[key])
            print(save_obj)
        # print({"user_data":new_dict,"user_log":user_log,"user_save":user_save})
        user_base64img = Db.child("profile_pics").child(i[0]).get().val()
        ordered_user.append({"user_data":new_dict,"user_log":log_obj,"user_save":save_obj,"user_pic":user_base64img})

    return {"users":ordered_user},201

@bp.route("/search", methods=["POST"])
def search():
    receive = request.get_json()
    params = {"user_email": receive['search_email']}
    # current_user = get_jwt_identity()
    search_id = email_to_userid(params["user_email"])
    try:
        search_data = userrepo.read({"user_id":search_id})
        # print(search_data)

        new_dict = {key:val for key, val in search_data.items() if key in  ["backpack","badges","biograph","coin","email","name"]}
        new_dict["friend_number"] = search_data["friends"]["friend_number"]
        # print(search_data["friends"]["friend_number"])
        user_log = db.child("user_log").child(search_id).get().val()
        # print(user_log)
        log_obj = {"log_spots":[]}
        if(user_log):
            for key in user_log:
                if (key == "log_count"):
                    continue
                else:
                    for inner_key in user_log[key]:
                        log_obj["log_spots"].append(user_log[key][inner_key])
        print(log_obj)
        user_save = db.child("user_save").child(search_id).get().val()
        save_obj = {"save_spots_id":[],"save_spots":[]}
        if(user_save):
            for key in user_save:
                if (key == "save_count"):
                    continue
                else:
                    save_obj["save_spots_id"].append(user_save[key]["place_id"])
                    save_obj["save_spots"].append(user_save[key])
            print(save_obj)
        # print({"user_data":new_dict,"user_log":user_log,"user_save":user_save})
        user_base64img = Db.child("profile_pics").child(search_id).get().val()
        return {"msg":"Find user!","result":{"user_data":new_dict,"user_log":log_obj,"user_save":save_obj,"user_pic":user_base64img}},201
    except:
        return {"msg":"Cannot find the user!"},502

@bp.route("/email_to_userid", methods=["GET","POST"])
def mail_to_id():
    """return user id from email for unity login"""
    receive = request.get_json()
    params = {"user_email": receive['user_email']}
    user_id = email_to_userid(params["user_email"])
    if user_id:
        return user_id
    else:
        return {"msg":"Cannot find the user!"},502
    