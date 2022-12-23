from flask import Flask, flash, redirect, render_template, request, session
from flask_cors import CORS
from google.helpers import apology
from google.gmaps import gmap
from cafenomad.cafenomad import cafenomad
from config import DevConfig

app = Flask(__name__)
app.config.from_object(DevConfig)
app.register_blueprint(gmap,  url_prefix='/gmap')
app.register_blueprint(cafenomad,  url_prefix='/cafenomad')

# Allow 
CORS(app)

@app.route("/")
def hello():
	return "Hello World!"

if __name__ == "__main__":
    app.run()