from flask import Flask, flash, redirect, render_template, request, session
from flask_cors import CORS
import os
import json
import geocoder
from os.path import join, dirname
from dotenv import load_dotenv
from helpers import apology
from gmaps import gmap

app = Flask(__name__)
app.register_blueprint(gmap,  url_prefix='/gmap')


# Allow 
CORS(app)

# Make sure API key is setted
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path, override=True)
if not os.environ.get("GOOGLE_PLACES_API_KEY"):
    raise RuntimeError("API_KEY not setted")

@app.route("/")
def hello():
	return "Hello World!"

@app.route("/apology")
def apol():
    """allow place search"""
    return apology("not implemented")

if __name__ == "__main__":
    app.run()