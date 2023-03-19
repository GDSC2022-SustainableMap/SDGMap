from flask import request
from app.map.infrastructure.google.gmaps import *
from app.map.infrastructure.cafenomad.cafenomad import *
from app.map.views.utils import *
from app.map.domain.mapRepo import Badge, recent_log
from flask import Blueprint
from flask_jwt_extended import get_jwt_identity, jwt_required
import datetime
from app.membership.infrastructure import db
from app.map.domain.spot import Spot


bp = Blueprint("main", __name__, url_prefix="/map")


@bp.route("/name_search", methods=["POST"])
def get_spot_from_name():

    receive = request.get_json()
    params = {
        "target_place": receive["target_place"],
    }

    # try:
    gmap_result = place_name_search(params)["candidates"][0]
    cafenomad_raw = get_cafe()

    cafenomad_result = list(
        filter(
            lambda x: params["target_place"] == x["name"]
            or params["target_place"] in x["name"],
            cafenomad_raw,
        )
    )
    cafenomad_result = list(map(lambda x: drop(x), cafenomad_result))
    if cafenomad_result:
        cafenomad_result[0]["standing_desk"] = (
            2 if (cafenomad_result[0]["standing_desk"] == "yes") else 0
        )
        cafenomad_result[0]["limited_time"] = (
            2 if (cafenomad_result[0]["limited_time"] == "yes") else 0
        )
        gmap_result = dict(
            list(gmap_result.items()) + list(cafenomad_result[0].items())
        )

    green_result = db.child("green_stores").child(gmap_result["place_id"]).get().val()
    if green_result:
        gmap_result = dict(list(gmap_result.items()) + list(green_result.items()))

    spot = Spot.fromdict(gmap_result)
    print(spot.get_attribute())

    return spot.get_attribute()
    # except:
    #     return {}


# if you don't want to use condition in this api, just let condition be {}.
@bp.route("/radius_search", methods=["POST"])
def get_spot_from_radius():

    receive = request.get_json()
    params = {
        "lat": float(receive["lat"]),
        "lng": float(receive["lng"]),
        "condition": receive["condition"],
    }

    gmap_raw = place_radius_search(params)
    cafenomad_raw = get_cafe()

    # merge cafenomad and google api
    cafenomad_index = [
        "wifi",
        "seat",
        "quiet",
        "tasty",
        "cheap",
        "music",
        "url",
        "limited_time",
        "socket",
        "standing_desk",
    ]

    # if there is no data in cafenomad, then the data become 2.5
    for obj in gmap_raw:
        for index in cafenomad_index:
            if index != "socket":
                obj[index] = 2.5
            else:
                obj[index] = "no"
        params["target_place"] = obj["name"]
        obj["distance"] = -getDistanceBetweenPointsNew(
            params["lat"],
            params["lng"],
            obj["geometry"]["location"]["lat"],
            obj["geometry"]["location"]["lng"],
        )
        if obj["name"]:
            try:
                result = list(
                    filter(
                        lambda x: params["target_place"] == x["name"]
                        or params["target_place"] in x["name"],
                        cafenomad_raw,
                    )
                )
                result = list(map(lambda x: drop(x), result))
                if result:
                    result[0]["standing_desk"] = (
                        2 if (result[0]["standing_desk"] == "yes") else 0
                    )
                    result[0]["limited_time"] = (
                        2 if (result[0]["limited_time"] == "yes") else 0
                    )
            except:
                result = []
        if result:
            obj.update(result[0])

    for obj in gmap_raw:
        spot = Spot.fromdict(obj)
        obj.update(spot.get_attribute())
        green_result = db.child("green_stores").child(obj["place_id"]).get().val()
        if green_result:
            obj_new = dict(list(obj.items()) + list(green_result.items()))
            obj.update(obj_new)

    def compare(ObjA, **params):
        scoreA = 0
        for key, value in params.items():
            if key == "limited_time":
                if key in ObjA and ObjA[key] <= value:
                    scoreA += 1
                    continue
            if key == "wifi":
                if key in ObjA and ObjA[key] <= value:
                    scoreA += 1
                    continue
            if key in ObjA and ObjA[key] == value:
                scoreA += 1
        return scoreA

    # filtered_gmap = filter_condition(gmap_raw,"wifi" in params["condition"].values(),"socket" in params["condition"].values(),"limited_time" in params["condition"].values(),"open_now" in params["condition"].values())
    sorted_map = sorted(
        gmap_raw,
        key=lambda x: compare(
            x,
            wifi=2.5,
            socket="yes",
            limited_time=2.5,
            open_now=True,
            publicissue=1,
            freetrade=1,
            creativecuisine=1,
            creativevegetarian=1,
            envfriend=1,
            localgred=1,
            petfriend=1,
            appreciatefood=1,
            organic=1,
            stray=1,
            noplastic=1,
            sourcereduction=1,
            vegetarianism=1,
            greenprocurement=1,
            ovolacto=1,
            careforweak=1,
            foodeduc=1,
            foodagricultureeducation=1,
        ),
        reverse=True,
    )
    print(sorted_map)
    return sorted_map


# if you don't want to use lat and lng in this api, just let use_location be "no".
# if you don't want to use condition in this api, just let condition be {}.
@bp.route("/arbitrary_search", methods=["POST"])
def get_spot_arbitrary():
    receive = request.get_json()
    params = {
        "target_place": receive["target_place"],
        "lat": receive["lat"],
        "lng": receive["lng"],
        "use_location": receive["use_location"],
        "condition": receive["condition"],
    }

    # try:
    gmap_raw = place_arbitrary_search(params)
    print(gmap_raw)
    cafenomad_raw = get_cafe()
    # merge cafenomad and google api
    cafenomad_index = [
        "wifi",
        "seat",
        "quiet",
        "tasty",
        "cheap",
        "music",
        "url",
        "limited_time",
        "socket",
        "standing_desk",
    ]

    # if there is no data in cafenomad, then the data become 0
    for obj in gmap_raw:
        for index in cafenomad_index:
            obj[index] = 0
        params["target_place"] = obj["name"]
        obj["distance"] = -getDistanceBetweenPointsNew(
            params["lat"],
            params["lng"],
            obj["geometry"]["location"]["lat"],
            obj["geometry"]["location"]["lng"],
        )
        if obj["name"]:
            try:
                result = list(
                    filter(
                        lambda x: params["target_place"] == x["name"]
                        or params["target_place"] in x["name"],
                        cafenomad_raw,
                    )
                )
                result = list(map(lambda x: drop(x), result))
                if result:
                    result[0]["standing_desk"] = (
                        2 if (result[0]["standing_desk"] == "yes") else 0
                    )
                    result[0]["limited_time"] = (
                        2 if (result[0]["limited_time"] == "yes") else 0
                    )
            except:
                result = []
        if result:
            obj.update(result[0])
    # sort part
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
    if params["condition"]:
        get_values(params["condition"], conditions)
        gmap_raw = sorted(
            gmap_raw,
            key=lambda k: (
                -k[conditions[0]],
                -k[conditions[1]],
                -k[conditions[2]],
                -k[conditions[3]],
                -k[conditions[4]],
                -k[conditions[5]],
                -k[conditions[6]],
                -k[conditions[7]],
            ),
        )
    for obj in gmap_raw:
        obj["distance"] = -obj["distance"]
    return gmap_raw


@bp.route("/find_place_result", methods=["POST"])
def find_format():
    receive = request.get_json()
    gmap_result = find_place_detail(receive["place_id"])
    return gmap_result

# check if the user is in the correct distance from the spot
@bp.route("/check_in", methods=["POST"])
@jwt_required()
def check_in_spot():
    receive = request.get_json()
    params = {
        "place_id": receive["place_id"],
        "user_lat": receive["user_lat"],
        "user_lng": receive["user_lng"],
        "scope": receive["scope"],
    }

    try:
        my_fields = [
            "place_id",
            "name",
            "formatted_address",
            "rating",
            "price_level",
            "type",
            "geometry",
            "formatted_phone_number",
        ]
        gmap_result = gmaps.place(
            place_id=params["place_id"], fields=my_fields, language="zh-tw"
        )["result"]
        print(gmap_result)
        place_type = find_store_type(gmap_result["types"])

        print(place_type)

        if gmap_result:
            spot_lat = gmap_result["geometry"]["location"]["lat"]
            spot_lng = gmap_result["geometry"]["location"]["lng"]
        # return gmap_result

        distance = getDistanceBetweenPointsNew(
            float(params["user_lat"]),
            float(params["user_lng"]),
            float(spot_lat),
            float(spot_lng),
        )
        current_user = get_jwt_identity()
        print(current_user)

        current_log_count = db.child("user_log").child(place_type).child(current_user).child("log_count").get().val()
        recent_count = db.child("user_recent_log").child(current_user).child("log_count").get().val()

        if distance < params["scope"]:
            # already have log
            if current_log_count:
                pass
            # not yet have log
            else:
                current_log_count = 0
                db.child("user_log").child(current_user).set({"log_count": 0})

            log_dict = {
                k: v for k, v in gmap_result.items() if k not in ["types", "geometry"]
            }

            db.child("user_log").child(place_type).child(current_user).set({"log_count": 0})
            db.child("user_log").child(place_type).child(current_user).child("log_count").get().val()

            # already have log
            if recent_count:
                pass
            # not yet have log
            else:
                db.child("user_recent_log").child(current_user).set({"log_count": 0})
                db.child("user_recent_log").child(current_user).child("log_count").get().val()
            

            user_log = Badge().get_user_log()
            user_log = log_dict
            user_log["user_name"] = (
                db.child("users").child(current_user).get().val()["name"]
            )
            user_log["time"] = str(datetime.datetime.now())
            user_log["place_id"] = params["place_id"]
            print(user_log)
            rec_log = recent_log(store_name = gmap_result["result"]["name"], store_id = params["place_id"]).get_recent_log()
           
            print(rec_log)

            if current_log_count:
                db.child("user_log").child(current_user).child(place_type).child(
                    f"log{current_log_count}"
                ).update(user_log)
            else:
                db.child("user_log").child(current_user).child(place_type).child(
                    f"log{current_log_count}"
                ).set(user_log)

            if recent_count:
                db.child("user_recent_log").child(current_user).child(f"log{current_log_count}").update(rec_log)
            else:
                db.child("user_recent_log").child(current_user).child(f"log{current_log_count}").set(rec_log)

            current_log_count += 1

            recent_count += 1
            recent_count = recent_count % 5
            db.child("user_log").child(place_type).child(current_user).update({"log_count": current_log_count})
            db.child("user_recent_log").child(current_user).update({"log_count": recent_count})

            # record the badges and coins obtained
            addBadge(params["place_id"], current_user)

            return {"msg": "You have checked in successfully!"}
        else:
            return {"msg": "You should come to this place to check in!"}
        return "as"
    except Exception as e:
        return e


@bp.route("/save_store", methods=["POST"])
@jwt_required()
def save_spot():
    receive = request.get_json()
    params = {"place_id": receive["place_id"]}
    current_user = get_jwt_identity()
    my_fields = [
        "place_id",
        "name",
        "formatted_address",
        "rating",
        "price_level",
        "formatted_phone_number",
    ]
    gmap_result = gmaps.place(
        place_id=params["place_id"], fields=my_fields, language="zh-tw"
    )["result"]
    gmaps
    current_save_count = (
        (db.child("user_save").child(current_user).child("save_count").get().val())
        if db.child("user_save").child(current_user).child("save_count").get().val()
        else 0
    )
    print(current_save_count)
    print(gmap_result)
    if gmap_result:
        # already have log, check if the place is already saved
        user_db = db.child("user_save").child(current_user).get().val()
        if user_db:
            for i in range(user_db["save_count"]):
                save_log = (
                    db.child("user_save")
                    .child(current_user)
                    .child(f"save{i}")
                    .get()
                    .val()
                )
                if save_log == None:
                    continue
                if (
                    db.child("user_save")
                    .child(current_user)
                    .child(f"save{i}")
                    .get()
                    .val()["place_id"]
                    == params["place_id"]
                ):
                    return {"msg": "place already saved"}
        # not yet have log
        else:
            db.child("user_save").child(current_user).set({"save_count": 0})

        user_save = Badge().get_user_save()
        # user_save["place_id"] = params["place_id"]
        user_save = gmap_result
        db.child("user_save").child(current_user).child(
            f"save{current_save_count}"
        ).update(user_save)

        current_save_count += 1
        db.child("user_save").child(current_user).update(
            {"save_count": current_save_count}
        )

        return {"msg": f'{params["place_id"]} saved, {current_save_count}'}, 201
    else:
        return {"msg": "this place doesn't exist"}


@bp.route("/delete_saved_store", methods=["POST"])
@jwt_required()
def delete_store():
    receive = request.get_json()
    params = {"place_id": receive["place_id"]}
    current_user = get_jwt_identity()
    current_user_save_count = (
        db.child("user_save").child(current_user).child("save_count").get().val()
    )
    for i in range(current_user_save_count):
        save_log = (
            db.child("user_save").child(current_user).child(f"save{i}").get().val()
        )
        if save_log == None:
            continue
        if save_log["place_id"] == params["place_id"]:
            db.child("user_save").child(current_user).child(f"save{i}").remove()
            current_user_save_count -= 1
            print(current_user_save_count)
            db.child("user_save").child(current_user).update(
                {"save_count": current_user_save_count}
            )
            break

    return {"msg": f'{params["place_id"]} deleted, {current_user_save_count}'}, 201


@bp.route("/get_references_from_spot", methods=["POST"])
def get_references_from_spot():
    receive = request.get_json()
    params = {"place_id": receive["place_id"], "photo_num": receive["photo_num"]}

    photo_references = get_references_from_a_spot(
        params["place_id"], params["photo_num"]
    )
    return photo_references


@bp.route("/get_photo_from_reference", methods=["POST"])
def get_photo_from_reference():
    receive = request.get_json()
    params = {
        "reference": receive["reference"],
        "maxwidth": receive["maxwidth"],
        "maxheight": receive["maxheight"],
    }
    return get_photo_from_a_reference(
        params["reference"], params["maxwidth"], params["maxheight"]
    )

@bp.route("/get_friend",  methods=["POST"])
@jwt_required()
def query_friends():
   current_user = get_jwt_identity()
   friends = db.child("users").child(current_user).child("friends").get().val()
   print(friends)
   return friends
