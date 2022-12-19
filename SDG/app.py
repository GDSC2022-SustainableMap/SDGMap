from flask import Flask, flash, redirect, render_template, request, session
import os
import json
import geocoder
from os.path import join, dirname
from dotenv import load_dotenv
from helpers import apology
from gmaps import place_radius_search, place_name_search, place_arbitrary_search
app = Flask(__name__)

# Make sure API key is setted
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path, override=True)
if not os.environ.get("GOOGLE_PLACES_API_KEY"):
    raise RuntimeError("API_KEY not setted")

@app.route("/", methods=["GET", "POST"])
def index():
    """allow place search"""
    if request.method == "POST":
        info = {}
        if request.form.get("radius_search"):
            place_radius_query = request.form.get("radius_search")
            prs = place_radius_search(place_radius_query)
            info = prs
        if request.form.get("name_search"):
            place_name_query = request.form.get("name_search")
            pns = place_name_search(place_name_query)
            info = pns
        if request.form.get("arbitrary_search"):
            place_arbitrary_query = request.form.get("radius_search")
            pas = place_arbitrary_search(place_arbitrary_query)
            info = pas     
        return render_template("layout.html", info=json.dumps(info, ensure_ascii=False, indent=4, separators=("," ,":")))
    if request.method == "GET":
        return render_template("layout.html")

@app.route("/apology")
def apol():
    """allow place search"""
    return apology("not implemented")

if __name__ == "__main__":
    app.run()