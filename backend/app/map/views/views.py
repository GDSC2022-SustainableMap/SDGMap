from flask import  request
from app.map.infrastructure.google.gmaps import *
from app.map.infrastructure.cafenomad.cafenomad import *
from app.map.views.utils import *
from app.map.domain.badge import Badge
from flask import Blueprint
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required
import pyrebase
from instance.config import Config
import datetime

# read firebase configuration
config = Config.USER_DB_CONFIG
# initialize firebase
firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()

bp = Blueprint('main', __name__,url_prefix='/map')

@bp.route("/name_search", methods=['POST'])
def get_spot_from_name():

    receive = request.get_json()
    params = {
        "target_place": receive['target_place'],
    }

    # try:
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
    # except:
    #     return {}

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
    return gmap_raw

#check if the user is in the correct distance from the spot
@bp.route("/check_in", methods=['POST'])
@jwt_required()
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
        # return gmap_result


        distance = getDistanceBetweenPointsNew(float(params["user_lat"]) ,float(params["user_lng"]), float(spot_lat), float(spot_lng))
        current_user = get_jwt_identity()
        if (distance<params["scope"]):
            current_log_count = 0
            # already have log
            if db.child("user_log").child(current_user).get().val():
                current_log_count = db.child("user_log").child(current_user).child("log_count").get().val()
            # not yet have log
            else:
                db.child("user_log").child(current_user).set({"log_count": 0})
                
            user_log = Badge().get_user_log()
            user_log["user_id"] = current_user
            user_log["time"] = str(datetime.datetime.now())
            user_log["place_id"] = params["place_id"]

            #db.child("user_log").child(f"log{current_log_count}").set(user_log)
            db.child("user_log").child(current_user).child(f"log{current_log_count}").set(user_log)

            current_log_count += 1
            db.child("user_log").child(current_user).update({"log_count":current_log_count})

            # record the badges and coins obtained
            addBadge (params["place_id"], current_user)
        return str(distance < params["scope"])
    except Exception as e:
        return e
    
@bp.route("/save_store", methods=["POST"])
@jwt_required()
def save_spot():
    receive = request.get_json()
    params = {
        "place_id": receive['place_id']
    }
    current_user = get_jwt_identity()
    gmap_result = find_place_detail(params["place_id"])
    if (gmap_result):
        current_save_count = 0
        # already have log
        if db.child("user_save").child(current_user).get().val():
            current_save_count = db.child("user_save").child(current_user).child("save_count").get().val()
        # not yet have log
        else:
            db.child("user_save").child(current_user).set({"save_count": 0})
        
        user_save = Badge().get_user_save()
        user_save["user_id"] = current_user
        user_save["place_id"] = params["place_id"]
        db.child("user_save").child(current_user).child(f"save{current_save_count}").set(user_save)

        current_save_count += 1
        db.child("user_save").child(current_user).update({"save_count": current_save_count})

        return f'{params["place_id"]} saved, {current_save_count}'
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