import requests

def get_cafe():
	url = "https://cafenomad.tw/api/v1.2/cafes"
	r = requests.get(url)
	dict = r.json()		
	return dict



def drop(obj):
	drop_index = ["address", "city", "id" , "latitude", "mrt", "name", "longitude", "open_time"]
	for drop in drop_index:
		del obj[drop]

	return obj