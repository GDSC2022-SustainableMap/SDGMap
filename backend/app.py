from flask import Flask, redirect, request, session, flash
from flask_cors import CORS
from google.gmaps import place_name_search, place_radius_search, place_arbitrary_search
from cafenomad.cafenomad import get_cafe, drop
from config import DevConfig
from utils import getDistanceBetweenPointsNew
from flask_session import Session
from functools import wraps
import pyrebase

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

config = {
  "apiKey": "??",
  "authDomain": "??",
  "databaseURL": "??",
  "storageBucket": "??"
}

#initialize firebase
firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()

# user info
person = {"name": "", "email":"","birthday":"", "user_id":""}

# Allow 
CORS(app)
@app.route("/login", methods=["GET", "POST"])
def login():
    """ Login to webpage. """
    # forget any user using
    session.clear()
    if request.method == "POST":
        receive = request.form
        user_email = receive["user_email"]
        user_birthday = receive["user_birthday"]
    try:
        #Try signing in the user with the given information
        user = auth.sign_in_with_email_and_password(user_email, user_birthday)
        #Insert the user data in the global person
        global person
        person["email"] = user["email"]
        person["user_id"] = user["localId"]

        # Remember which user has logged in
        session["user_id"] = user["localId"]

        #Get the name of the user
        data = db.child("users").get()
        person["name"] = data.val()[person["user_id"]]["name"]
        # Redirect to home page
        # needs further confirmation
        return redirect("/home")
    except:
        #If there is any error, redirect back to login
        return redirect("/login")
    
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        submit = request.form
        new_email = submit["email"]
        new_birthday = submit["pass"] #password
        new_name = submit["name"]
        try:
            auth.create_user_with_email_and_passowrd(new_email, new_birthday)
            #Append data to the firebase db
            data = {"name": new_name, "email": new_email, "birthday": new_birthday}
            db.child("users").child(person["uid"]).set(data)

            # Redirect to home page
            # needs further confirmation
            return redirect("/home")
        except:
            #If there is any error, redirect back to register
            return redirect("/register")
    else:
        if session.get("user_id"): 
            # Redirect to home page
            # needs further confirmation
            return redirect("/home")
        else:
            return redirect("/register")



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


if __name__ == "__main__":
    app.run()