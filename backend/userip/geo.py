import requests
import os
from os.path import join, dirname
from dotenv import load_dotenv, find_dotenv

#dotenv_path = "/Users/raychang/Desktop/SDGMap/backend/google/.env"
dotenv_path = join(dirname(dirname(__file__)),"../.env")
print(dotenv_path)
load_dotenv(dotenv_path, override=True)
GOOGLE_GEOLOCATION_API_KEY = os.environ.get("GOOGLE_GEOLOCATION_API_KEY")

def user_location():
    response = requests.post(f"https://www.googleapis.com/geolocation/v1/geolocate?key={GOOGLE_GEOLOCATION_API_KEY}").json()
    #print(response)
    return response

if __name__ == "__main__":
    user_location()