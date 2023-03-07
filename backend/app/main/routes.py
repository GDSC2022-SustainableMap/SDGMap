from flask import  request
from app.main import bp
from app.main.google.gmaps import place_name_search, place_radius_search, place_arbitrary_search, get_references_from_a_spot, get_photo_from_a_reference, find_place_detail
from app.main.cafenomad.cafenomad import get_cafe, drop
from app.main.utils import getDistanceBetweenPointsNew, get_values

from app.membership.utils import login_required
import datetime
from os import path
from flask import redirect, request, session, flash

import datetime
from os import path

import pyrebase
from instance.config import Config

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

badge_names = database.badge_names

def addBadge (place_id):
    green_stores = db.child("green_stores").get().val()
    for key in green_stores:
        if (key == place_id):
            a = db.child("green_stores").child(key).get().val()
            for i in range(18):
                if badge_names[i]:
                    user_score = db.child("users").child(session["user_id"]).child("coins").get().val()
                    user_score += a[badge_names[i]]
                    bdg_num = db.child("users").child(session["user_id"]).update({"coins": user_score})
                    bdg_num = db.child("users").child(session["user_id"]).child("badges").child(badge_names[i]).get().val()
                    bdg_num += a[badge_names[i]]
                    bdg_num = db.child("users").child(session["user_id"]).child("badges").update({badge_names[i]: bdg_num})
    return "aaa"
    

@bp.route("/name_search", methods=['POST'])
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
@bp.route("/radius_search", methods=['POST'])
def get_spot_from_radius():

    receive = request.get_json()
    params = {
        "lat": float(receive["lat"]),
        "lng": float(receive["lng"]),
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
@bp.route("/arbitrary_search", methods=['POST'])
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
    # add to firebase
    db.child("place_api").child(gmap_raw[0]["place_id"]).set(gmap_raw[0])
    return gmap_raw

#check if the user is in the correct distance from the spot
@bp.route("/check_in", methods=['POST'])
@login_required
def check_in_spot():
    receive = request.get_json()
    params = {
        "place_id": receive['place_id'],
        "user_lat": receive["user_lat"],
        "user_lng": receive["user_lng"],
        "scope": receive["scope"]
    }

    try:
        # gmap_result = place_name_search(params)["candidates"][0]
        gmap_result = find_place_detail(params["place_id"])
        if(gmap_result):
            spot_lat = gmap_result["result"]["geometry"]["location"]["lat"]
            spot_lng = gmap_result["result"]["geometry"]["location"]["lng"]

        distance = getDistanceBetweenPointsNew(float(params["user_lat"]) ,float(params["user_lng"]), float(spot_lat), float(spot_lng))
        if (distance<params["scope"]):
            current_log_count = db.child("user_log").child("log_count").get().val()
            user_log = database.user_log.copy()
            user_log["user_id"] = session["user_id"]
            user_log["time"] = str(datetime.datetime.now())
            user_log["place_id"] = params["place_id"]
            db.child("user_log").child(f"log{current_log_count}").set(user_log)
            current_log_count += 1
            db.child("user_log").update({"log_count":current_log_count})

            addBadge(params["place_id"])

        return str(distance < params["scope"])
    except Exception as e:
        return e
    
@bp.route("/test", methods = ["POST"])
def test():
    green_stores = db.child("green_stores").get().val()
    greens = []
    for key in green_stores:
        greens.append(key)
    return greens

@bp.route("/save_store", methods=["POST"])
@login_required
def save_spot():
    receive = request.get_json()
    params = {
        "place_id": receive['place_id']
    }
    gmap_result = find_place_detail(params["place_id"])
    if (gmap_result):
        current_save_count = db.child("user_log").child("save_count").get().val()
        user_save = database.user_save.copy()
        user_save["user_id"] = session["user_id"]
        user_save["place_id"] = params["place_id"]
        db.child("user_save").child(f"save{current_save_count}").set(user_save)
        current_save_count += 1
        db.child("user_saved").update({"save_count": current_save_count})
        return f'{params["place_id"]} saved'
    else:
        return "this place doesn't exist"


@bp.route("/get_references_from_spot", methods=['POST'])
def get_references_from_spot():
    receive = request.get_json()
    params = {
        "place_id": receive['place_id'],
        "photo_num": receive["photo_num"]
    }

    photo_references = get_references_from_a_spot(params["place_id"],params["photo_num"])
    return photo_references

@bp.route("/get_photo_from_reference", methods=['POST'])
def get_photo_from_reference():
    receive = request.get_json()
    params = {
        "reference": receive['reference'],
        "maxwidth": receive["maxwidth"],
        "maxheight": receive["maxheight"]
    }
    return get_photo_from_a_reference(params["reference"],params["maxwidth"],params["maxheight"])

@bp.route("/build_DB", methods = ['POST'])
def build_DB():
    receive = request.get_json()
    params = {
        "address" : receive["address"]
    }
    gmap_result = place_name_search(params)["candidates"][0]
    return gmap_result