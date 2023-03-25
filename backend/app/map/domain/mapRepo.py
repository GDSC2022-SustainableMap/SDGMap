class Badge():
    def __init__(self) -> None:
        self.badges: list = [
            "publicissue",
            "freetrade",
            "creativecuisine",
            "creativevegetarian",
            "envfriend",
            "localgred",
            "petfriend",
            "appreciatefood",
            "organic",
            "stray",
            "noplastic",
            "sourcereduction",
            "vegetarianism",
            "greenprocurement",
            "ovolacto",
            "careforweak",
            "foodeduc",
            "foodagricultureeducation"
        ]
        self.user_log: dict = {
            "user_name":"",
            "time" : "",
            "place_id":"",
            "formatted_address":"",
            "name":"",
            "rating": float,
            "formatted_phone_number":""
        }
        self.user_save: dict = {
            "place_id": "",
            "formatted_address":"",
            "name":"",
            "rating": float,
            "formatted_phone_number":"",
            "place_id":""
        }
        self.user_save: dict = {
            "place_id": ""
        }
    def get_badges(self):
        return self.badges
    def get_user_log(self):
        return self.user_log
    def get_user_save(self):
        return self.user_save
    
class recent_log():
    def __init__(self, store_name : str, store_id : str):
        self.recent_log: dict = {
            "place_name" : store_name,
            "place_id" : store_id
        }
    def get_recent_log(self):
        return self.recent_log