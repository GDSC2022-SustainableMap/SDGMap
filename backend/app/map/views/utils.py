from numpy import sin, cos, arccos, pi, round
from app.membership.infrastructure import db
from app.map.domain.mapRepo import *
import time
import datetime
def rad2deg(radians):
    degrees = radians * 180 / pi
    return degrees

def deg2rad(degrees):
    radians = degrees * pi / 180
    return radians

def getDistanceBetweenPointsNew(latitude1, longitude1, latitude2, longitude2, unit = 'kilometers'):
    
    theta = longitude1 - longitude2
    
    distance = 60 * 1.1515 * rad2deg(
        arccos(
            (sin(deg2rad(latitude1)) * sin(deg2rad(latitude2))) + 
            (cos(deg2rad(latitude1)) * cos(deg2rad(latitude2)) * cos(deg2rad(theta)))
        )
    )
    
    if unit == 'miles':
        return round(distance, 2)
    if unit == 'kilometers':
        return round(distance * 1.609344, 2)
    
def get_values(dl, values_list):
    if isinstance(dl, dict):
        values_list += dl.values()
        map(lambda x: get_values(x, values_list), dl.values())
    elif isinstance(dl, list):
        map(lambda x: get_values(x, values_list), dl)

def addBadge (place_id, current_user):
    """ record the change in badges and coins """
    try:
        green_stores = db.child("green_stores").get().val()
        for key in green_stores:
            if (key == place_id):
                a = db.child("green_stores").child(key).get().val()
                badge_names = Badge().get_badges()
                for i in range(18):
                    user_score = db.child("users").child(current_user).child("coin").get().val()
                    unity_money = db.child("users_unity").child(current_user).child("money").get().val()
                    user_score += a[badge_names[i]]
                    unity_money += a[badge_names[i]] * 100
                    db.child("users").child(current_user).update({"coin": user_score})
                    bdg_num = db.child("users").child(current_user).child("badges").child(badge_names[i]).get().val()
                    bdg_num += a[badge_names[i]]
                    db.child("users").child(current_user).child("badges").update({badge_names[i]: bdg_num})
                    db.child("users_unity").child(current_user).update({"money":unity_money})

                return "check in successful"
        return "This store is not green"
    except Exception as e:
        return e
    
def find_store_type(types_of_store):
    if "restaurant" in types_of_store:
        return "Restaurant"
    elif "cafe" in types_of_store:
        return "CoffeeShop"
    elif "bar" in types_of_store:
        return "Bar"
    elif "bakery" in types_of_store:
        return "Bakery"
    else:
        return "Tent"

def user_log_records(place_type, current_user, gmap_result, place_id):
    have_log = db.child("user_log").child(place_type).child(current_user).get().val()
    # check if the user has log or not
    if have_log:
        pass
    else:
        db.child("user_log").child(place_type).child(current_user).set({"log_count": 0})
    time.sleep(1)
    current_log_count = db.child("user_log").child(place_type).child(current_user).child("log_count").get().val()
    log_dict = {k: v for k, v in gmap_result.items() if k not in ["types", "geometry"]}
    # user_log = Badge().get_user_log()
    user_log = log_dict
    user_log["user_name"] = (
        db.child("users").child(current_user).get().val()["name"]
    )
    user_log["time"] = str(datetime.datetime.now())
    user_log["place_id"] = place_id
    user_log["place_name"] = user_log["name"]
    del user_log["name"]
    print("user_log: ", user_log)

    db.child("user_log").child(place_type).child(current_user).child(f"log{current_log_count}").set(user_log)

    current_log_count += 1
    db.child("user_log").child(place_type).child(current_user).update({"log_count": current_log_count})
    return "user log finished"

def user_recent_log_records(current_user, gmap_result, place_id):
    have_recent_log = db.child("user_recent_log").child(current_user).get().val()
    print(have_recent_log)
    # check if user have recent log or not
    if have_recent_log:
        pass
    else:
        db.child("user_recent_log").child(current_user).set({"log_count": 0})
    time.sleep(1)
    recent_count = db.child("user_recent_log").child(current_user).child("log_count").get().val()
    print(recent_count)
    rec_log = recent_log(store_name = gmap_result["name"], store_id = place_id).get_recent_log()

    print(rec_log)
    if db.child("user_recent_log").child(current_user).child(f"log{recent_count}").get().val():
        db.child("user_recent_log").child(current_user).child(f"log{recent_count}").update(rec_log)
    else:
        db.child("user_recent_log").child(current_user).child(f"log{recent_count}").set(rec_log)

    recent_count += 1
    recent_count = recent_count % 5
    db.child("user_recent_log").child(current_user).update({"log_count": recent_count})
    return "recent log finished"