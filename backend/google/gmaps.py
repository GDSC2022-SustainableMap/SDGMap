import googlemaps
import os
import json
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), "../.env")
cassette_path = join(dirname(__file__), "/vcr.yaml")
load_dotenv(dotenv_path, override=True)

GOOGLE_PLACES_API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY")
GOOGLE_GEOLOCATION_API_KEY = os.environ.get("GOOGLE_GEOLOCATION_API_KEY")


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
        my_fields = ["business_status", "name", "formatted_address", "geometry", "opening_hours", "rating", "user_ratings_total", "price_level"]
        place_info = gmaps.place(place_id = place_id, fields = my_fields)
        places.append(place_info['result'])
        json.dumps(places)
    return places

def place_name_search(params):
    """find place by a specified name"""

    place_search = gmaps.find_place(
            input = params["target_place"],
            input_type = "textquery",
            fields=["business_status", "name", "formatted_address", "geometry", "opening_hours", "rating", "user_ratings_total", "price_level","photos"],
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

    drop_index = ["icon", "icon_background_color", "plus_code" ,"place_id", "reference","icon_mask_base_uri"]
    for obj in place_search["results"]:
        for drop in drop_index:
            del obj[drop]
    return place_search["results"]

if __name__ == "__main__":
    print(place_name_search("Ink Coffee"),end = '\n\n\n')
