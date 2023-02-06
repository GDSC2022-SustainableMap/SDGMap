from flask import Flask, redirect, request, session, flash, send_file
from flask_cors import CORS
from google.gmaps import place_name_search, place_radius_search, place_arbitrary_search, get_references_from_a_spot, get_photo_from_a_reference
from cafenomad.cafenomad import get_cafe, drop
from config import DevConfig
from utils import getDistanceBetweenPointsNew
from flask_session import Session
from functools import wraps
import pyrebase
import os
import json
from os.path import join, dirname
from dotenv import load_dotenv


def login_required(f):
    """ Decorate routes to require login. """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function

app = Flask(__name__)
app.config.from_object(DevConfig)

# read firebase configuration
dotenv_path = join(dirname(__file__), ".env")
load_dotenv(dotenv_path, override=True)
config = json.loads(os.environ.get("USER_DB_CONFIG"))

# initialize firebase
firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()

# user info
person = {"name":"", "email":"","birthday":"", "user_id":"", "change_name_chance":0}

# Allow 
CORS(app)
@app.route("/login", methods=["GET", "POST"])
def login():
    """ Login to webpage. """
    # forget any user using
    session.clear()
    if request.method == "POST":
        receive = request.form
        user_email = receive["email"]
        user_password = receive["password"]
        try:
            #Try signing in the user with the given information
            user = auth.sign_in_with_email_and_password(user_email, user_password)
            #Insert the user data in the global person
            global person
            person["email"] = user["email"]
            person["user_id"] = user["localId"]
            person["change_name_chance"] = user["change_name_chance"]

            # Remember which user has logged in
            session["user_id"] = user["localId"]

            #Get the name of the user
            data = db.child("users").get()
            person["name"] = data.val()[person["user_id"]]["name"]

            # Redirect to home page
            return redirect("/")
        except:
            #If there is any error, redirect back to login
            return redirect("/login")
    else:
        if session.get("user_id"): 
            # Redirect to home page
            return redirect("/")
        else:
            return redirect("/login")
    
@app.route("/register", methods=["GET", "POST"])
def register():
    """ Let user register account. """
    if request.method == "POST":
        submit = request.form
        new_email = submit["email"]
        new_password = submit["password"] 
        new_birthday = submit["birthday"] 
        new_name = submit["name"]
        try:
            auth.create_user_with_email_and_password(new_email, new_password)
            #Append data to the firebase db
            data = {"name": new_name, "email": new_email, "birthday": new_birthday, "change_name_chance": 1}
            db.child("users").child(person["uid"]).set(data)

            # Redirect to home page
            return redirect("/")
        except:
            #If there is any error, redirect back to register
            return redirect("/register")
    else:
        if session.get("user_id"): 
            # Redirect to home page
            return redirect("/")
        else:
            return redirect("/register")

@app.route("/edit_profile", methods=["GET", "POST"])
@login_required
def edit_profile():
    """ allow user to change profile. """
    global person
    if request.method == "POST":
        submit = request.form
        if person["change_name_chance"]:
            person["change_name_chance"]-=1
            new_name = submit["name"]
            db.child("users").child(person["uid"]).update({"name":new_name})
        else:
            flash("Cannot change profile anymore.")
    else:
        return redirect("/")


@app.route("/logout")
@login_required
def logout():
    """Log user out"""
    session.clear()
    return redirect("/")

@app.route("/")
def hello():
	return "Hello World!"

@app.route("/name_search", methods=['POST'])
def get_spot_from_name():

    receive = request.get_json()
    params = {
        "target_place": receive['target_place'],
    }

    try:
        gmap_result = place_name_search(params)["candidates"][0]
        cafenomad_raw = get_cafe()



        cafenomad_result = list(filter(lambda x:params["target_place"] == x["name"] or params["target_place"] in x["name"],cafenomad_raw))
        cafenomad_result = list(map(lambda x: drop(x), cafenomad_result))
        if cafenomad_result:
            cafenomad_result[0]["standing_desk"] = 2  if(cafenomad_result[0]["standing_desk"] == "yes") else 0
            cafenomad_result[0]["limited_time"] = 2  if(cafenomad_result[0]["limited_time"] == "yes") else 0
            merged_result = dict(list(gmap_result.items()) + list(cafenomad_result[0].items()))
            return merged_result
        return gmap_result
    except:
        return {}

#if you don't want to use condition in this api, just let condition be {}.
@app.route("/radius_search", methods=['POST'])
def get_spot_from_radius():

    receive = request.get_json()
    params = {
        "lat": receive["lat"],
        "lng": receive["lng"],
        "condition": receive["condition"]
    }


    gmap_raw = place_radius_search(params)
    cafenomad_raw = get_cafe()
    #merge cafenomad and google api
    cafenomad_index = ['wifi','seat', 'quiet', 'tasty', 'cheap', 'music', 'url', 'limited_time', 'socket', 'standing_desk']

    #if there is no data in cafenomad, then the data become 0
    for obj in gmap_raw:
        for index in cafenomad_index:
            obj[index] = 0
        params["target_place"] = obj["name"]
        obj["distance"] = -getDistanceBetweenPointsNew(params["lat"],params["lng"],obj["geometry"]["location"]["lat"],obj["geometry"]["location"]["lng"])
        if(obj["name"]):
            try:
                result = list(filter(lambda x:params["target_place"] == x["name"] or params["target_place"] in x["name"],cafenomad_raw))
                result = list(map(lambda x: drop(x), result))
                if result:
                    result[0]["standing_desk"] = 2  if(result[0]["standing_desk"] == "yes") else 0
                    result[0]["limited_time"] = 2  if(result[0]["limited_time"] == "yes") else 0
            except:
                result = []
        if(result):
            obj.update(result[0])
    #sort part
    """
        condition: {
            "0":"wifi",
            "1": "quiet",
            "2": "seat",
            "3": "standing_desk",
            "4": "tasty",
            "5": "cheap",
            "6": "music",
            "7": "limited_time"
            "8": "distance"
            }
    """
    conditions = []
    if(params["condition"]):
        get_values(params["condition"], conditions)
        gmap_raw = sorted(gmap_raw, key=lambda k: (-k[conditions[0]],-k[conditions[1]],-k[conditions[2]],-k[conditions[3]],-k[conditions[4]],-k[conditions[5]],-k[conditions[6]],-k[conditions[7]]))
    for obj in gmap_raw:
        obj["distance"] = -obj["distance"]
    return gmap_raw

#if you don't want to use lat and lng in this api, just let use_location be "no".
#if you don't want to use condition in this api, just let condition be {}.
@app.route("/arbitrary_search", methods=['POST'])
def get_spot_arbitrary():
    receive = request.get_json()
    params = {
        "target_place": receive['target_place'],
        "lat": receive["lat"],
        "lng": receive["lng"],
        "use_location": receive["use_location"],
        "condition": receive["condition"],
    }

    # try:
    gmap_raw = place_arbitrary_search(params)
    cafenomad_raw = get_cafe()
    #merge cafenomad and google api
    cafenomad_index = ['wifi','seat', 'quiet', 'tasty', 'cheap', 'music', 'url', 'limited_time', 'socket', 'standing_desk']

    #if there is no data in cafenomad, then the data become 0
    for obj in gmap_raw:
        for index in cafenomad_index:
            obj[index] = 0
        params["target_place"] = obj["name"]
        obj["distance"] = -getDistanceBetweenPointsNew(params["lat"],params["lng"],obj["geometry"]["location"]["lat"],obj["geometry"]["location"]["lng"])
        if(obj["name"]):
            try:
                result = list(filter(lambda x:params["target_place"] == x["name"] or params["target_place"] in x["name"],cafenomad_raw))
                result = list(map(lambda x: drop(x), result))
                if result:
                    result[0]["standing_desk"] = 2  if(result[0]["standing_desk"] == "yes") else 0
                    result[0]["limited_time"] = 2  if(result[0]["limited_time"] == "yes") else 0
            except:
                result = []
        if(result):
            obj.update(result[0])
    #sort part
    """
        "condition": {
            "0":"wifi",
            "1": "quiet",
            "2": "seat",
            "3": "standing_desk",
            "4": "tasty",
            "5": "cheap",
            "6": "music",
            "7": "limited_time",
            "8": "distance"
            }
    """
    conditions = []
    if(params["condition"]):
        get_values(params["condition"], conditions)
        gmap_raw = sorted(gmap_raw, key=lambda k: (-k[conditions[0]],-k[conditions[1]],-k[conditions[2]],-k[conditions[3]],-k[conditions[4]],-k[conditions[5]],-k[conditions[6]],-k[conditions[7]]))
    for obj in gmap_raw:
        obj["distance"] = -obj["distance"]
    return gmap_raw

def get_values(dl, values_list):
    if isinstance(dl, dict):
        values_list += dl.values()
        map(lambda x: get_values(x, values_list), dl.values())
    elif isinstance(dl, list):
        map(lambda x: get_values(x, values_list), dl)


#check if the user is in the correct distance from the spot
@app.route("/check_in", methods=['POST'])
def check_in_spot():
    receive = request.get_json()
    params = {
        "target_place": receive['target_place'],
        "user_lat": receive["user_lat"],
        "user_lng": receive["user_lng"],
        "scope": receive["scope"]
    }

    try:
        gmap_result = place_name_search(params)["candidates"][0]
        cafenomad_raw = get_cafe()

        cafenomad_result = list(filter(lambda x:params["target_place"] == x["name"] or params["target_place"] in x["name"],cafenomad_raw))
        cafenomad_result = list(map(lambda x: drop(x), cafenomad_result))
        if cafenomad_result:
            cafenomad_result[0]["standing_desk"] = 2  if(cafenomad_result[0]["standing_desk"] == "yes") else 0
            cafenomad_result[0]["limited_time"] = 2  if(cafenomad_result[0]["limited_time"] == "yes") else 0
            merged_result = dict(list(gmap_result.items()) + list(cafenomad_result[0].items()))
            
            spot_lat = merged_result["geometry"]["location"]["lat"]
            spot_lng = merged_result["geometry"]["location"]["lng"]
            distance = getDistanceBetweenPointsNew(params["user_lat"] ,params["user_lng"], spot_lat, spot_lng)
            return str(distance < params["scope"])
    except:
        return {}

#check if the user is in the correct distance from the spot
@app.route("/get_references_from_spot", methods=['GET'])
def get_references_from_spot():
    receive = request.get_json()
    params = {
        "place_id": receive['place_id'],
        "photo_num": receive["photo_num"]
    }

    photo_references = get_references_from_a_spot(params["place_id"],params["photo_num"])
    return photo_references

@app.route("/get_photo_from_reference", methods=['GET'])
def get_photo_from_reference():
    receive = request.get_json()
    params = {
        "reference": receive['reference'],
        "maxwidth": receive["maxwidth"],
        "maxheight": receive["maxheight"]
    }
    return get_photo_from_a_reference(params["reference"],params["maxwidth"],params["maxheight"])
if __name__ == "__main__":
    # app.run()
    print("test test: " + config['apiKey'])
    print("test test: " + config['authDomain'])