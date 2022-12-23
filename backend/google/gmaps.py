import googlemaps
import os
import json
from os.path import join, dirname
from dotenv import load_dotenv
from flask import Blueprint, request

gmap = Blueprint('gmap', __name__)
dotenv_path = join(dirname(__file__), "../.env")
cassette_path = join(dirname(__file__), "/vcr.yaml")
load_dotenv(dotenv_path, override=True)

GOOGLE_PLACES_API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY")
GOOGLE_GEOLOCATION_API_KEY = os.environ.get("GOOGLE_GEOLOCATION_API_KEY")


#Client
gmaps = googlemaps.Client(key=GOOGLE_PLACES_API_KEY)
#distance search
@gmap.route("/radius", methods=["GET"])
def place_radius_search(): # Hsinchu Train station
    # location = (24.801798905507397, 120.97159605610153)
    location = (request.args.get('lat'), request.args.get('lng'))
    radius = 1000
    place_type = "cafe"
    places_result = gmaps.places_nearby(location,radius,place_type)
    places_JSON={}
    places = []
    for place in places_result["results"]:
        place_id = place['place_id']
        my_fields = ["business_status", "name", "formatted_address", "geometry", "opening_hours", "rating", "user_ratings_total", "price_level"]
        place_info = gmaps.place(place_id = place_id, fields = my_fields)
        places.append(place_info['result'])
        json.dumps(places)
    return places


@gmap.route("/", methods=["GET"])
def place_name_search():
    """find place by a specified name"""
    target_place = request.args.get('name')
    place_search = gmaps.find_place(
            input = target_place,
            input_type = "textquery",
            fields=["business_status", "name", "formatted_address", "geometry", "opening_hours", "rating", "user_ratings_total", "price_level"],
            location_bias = "circle:10000@24.801798905507397,120.97159605610153",
            language = "zh-TW"
        )
    #with open("name_search.json", "w") as fh:
    #    json.dump(place_search, fh, ensure_ascii=False, indent=4, separators=("," ,":"))
    return place_search

def place_arbitrary_search(anything):
    place_search = gmaps.places(
        query = anything,
        location = "24.801798905507397,120.97159605610153",
        radius = "10000",
        language = "zh-TW",
        type = "food",
    )
    #with open("arbitrary_search.json", "w") as fh:
    #    json.dump(place_search, fh, ensure_ascii=False, indent=4, separators=("," ,":"))
    return place_search

if __name__ == "__main__":
    print(place_name_search("Ink Coffee"),end = '\n\n\n')
    # print(place_arbitrary_search("spaghetti"))
    # print(place_radius_search())