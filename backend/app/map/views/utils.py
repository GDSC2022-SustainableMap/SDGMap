from numpy import sin, cos, arccos, pi, round
from app.membership.infrastructure import db
from app.map.domain.badge import Badge
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
                    user_score += a[badge_names[i]]
                    db.child("users").child(current_user).update({"coin": user_score})
                    bdg_num = db.child("users").child(current_user).child("badges").child("badges").child(badge_names[i]).get().val()
                    bdg_num += a[badge_names[i]]
                    bdg_num = db.child("users").child(current_user).child("badges").child("badges").update({badge_names[i]: bdg_num})
                return "check in successful"
        return "This store is not green"
    except Exception as e:
        return e