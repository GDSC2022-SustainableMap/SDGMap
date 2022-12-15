from flask import Flask
from flask_cors import CORS
from config import DevConfig
from cafenomad import cafenomad

app = Flask(__name__)
app.config.from_object(DevConfig)
app.register_blueprint(cafenomad,  url_prefix='/cafenomad')

# Allow 
CORS(app)

@app.route("/")
def hello():
	return "Hello World!"

if __name__ == '__main__':
    app.run()