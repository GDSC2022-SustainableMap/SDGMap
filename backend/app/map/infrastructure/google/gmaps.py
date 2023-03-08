import googlemaps
import json
from PIL import Image
import requests
import io
from flask import send_file
from instance.config import Config

GOOGLE_PLACES_API_KEY = Config.GOOGLE_PLACES_API_KEY
GOOGLE_GEOLOCATION_API_KEY = Config.GOOGLE_GEOLOCATION_API_KEY

#Client
gmaps = googlemaps.Client(key=GOOGLE_PLACES_API_KEY)
#distance search
def place_radius_search(params):
    location = (params["lat"], params["lng"])
    radius = 1000
    place_type = "cafe"
    places_result = gmaps.places_nearby(location,radius,place_type)
    places = []
    for place in places_result["results"]:
        place_id = place['place_id']
        my_fields = ["place_id","business_status", "name", "formatted_address", "geometry", "opening_hours", "rating", "user_ratings_total", "price_level"]
        place_info = gmaps.place(place_id = place_id, fields = my_fields)
        places.append(place_info['result'])
        json.dumps(places)
    return places

def place_name_search(params):
    """find place by a specified name"""

    place_search = gmaps.find_place(
            input = params["target_place"],
            input_type = "textquery",
            fields=["place_id", "business_status", "name", "formatted_address", "geometry", "opening_hours", "rating", "user_ratings_total", "price_level","photos"],
            location_bias = "circle:10000@24.801798905507397,120.97159605610153",
            language = "zh-TW"
        )
    return place_search

def place_arbitrary_search(params):
    if(params["use_location"] == "no"):
        place_search = gmaps.places(
            query = params["target_place"],
            radius = "1000",
            type = "cafe",
        )
    else:
        place_search = gmaps.places(
            query = params["target_place"],
            location = (params["lat"], params["lng"]),
            radius = "1000",
            type = "cafe",
        )

    drop_index = ["icon", "icon_background_color", "plus_code" , "reference","icon_mask_base_uri"]
    for obj in place_search["results"]:
        for drop in drop_index:
            del obj[drop]
    return place_search["results"]

def display_photo(photo_reference, photo_height=400, photo_width=400):
    img_data = gmaps.places_photo(photo_reference = photo_reference, max_height=photo_height, max_width=photo_width)
    with open("myImg.jpg", "wb") as f:
        for chunk in img_data:
            if chunk:
                f.write(chunk)
    im = Image.open("myImg.jpg")
    im.show()

def find_place_detail(place_id):
    url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=name%2Cphoto%2Cformatted_phone_number%2Cgeometry&key={GOOGLE_PLACES_API_KEY}"
    response = requests.post(url).json()
    return response

#Due to the security issue, we cannot directly pass photo urls to frontend (because the api key is in the url), so we should get reference first then use the reference solely to get the photo.
def get_references_from_a_spot(place_id, photo_num):
    place_detail = find_place_detail(place_id)
    photo_references = []
    for i in place_detail['result']['photos']:
        photo_references.append(i['photo_reference'])

    return photo_references[:photo_num]

def get_photo_from_a_reference(reference,maxwidth,maxheight):
    url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth={maxwidth}&maxheight={maxheight}&photo_reference={reference}&key={GOOGLE_PLACES_API_KEY}"

    r = requests.get(url)
    file_like_object = io.BytesIO(r.content)

    return send_file(file_like_object, mimetype='image/png')