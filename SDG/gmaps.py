import googlemaps
import os
import json
from os.path import join, dirname
from dotenv import load_dotenv, find_dotenv

dotenv_path = join(dirname(__file__), ".env")
cassette_path = join(dirname(__file__), "/vcr.yaml")
load_dotenv(dotenv_path, override=True)

GOOGLE_PLACES_API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY")
GOOGLE_GEOLOCATION_API_KEY = os.environ.get("GOOGLE_GEOLOCATION_API_KEY")


#Client
gmaps = googlemaps.Client(key=GOOGLE_PLACES_API_KEY)
#distance search
def place_radius_search(location = (24.801798905507397, 120.97159605610153)): # Hsinchu Train station
    radius = 1000
    place_type = "cafe"
    places_result = gmaps.places_nearby(location,radius,place_type)
    places_JSON={}
    for place in places_result["results"]:
        place_id = place['place_id']
        place_name = place['name']
        my_fields = ["business_status", "name", "formatted_address", "geometry", "opening_hours", "rating", "user_ratings_total", "price_level"]
        place_info = gmaps.place(place_id = place_id, fields = my_fields)
        places_JSON[place_name] = place_info
    #with open("radius_search.json", "w") as fh:
    #    json.dump(places_JSON, fh, ensure_ascii=False, indent=4, separators=("," ,":"))
    return places_JSON

def place_name_search(target_place):
    """find place by a specified name"""
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
    print(place_arbitrary_search("spaghetti"))
    print(place_radius_search())