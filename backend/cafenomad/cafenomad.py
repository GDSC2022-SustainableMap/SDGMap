from flask import Blueprint
import requests

cafenomad = Blueprint('cafenomad', __name__)

@cafenomad.route('/', defaults={'name': ''},strict_slashes=False)
@cafenomad.route("/<name>", methods=["GET"])
def get_cafe(name):
	url = "https://cafenomad.tw/api/v1.2/cafes"
	r = requests.get(url)
	dict = r.json()

	if(name == ''):
		return dict

	#回傳包含搜尋字串的餐館
	return list(filter(lambda x:name in x["name"],dict))