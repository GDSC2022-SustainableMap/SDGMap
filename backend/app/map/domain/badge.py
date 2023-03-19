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
            "formatted_phone_number":""

        }
    def get_badges(self):
        return self.badges
    def get_user_log(self):
        return self.user_log
    def get_user_save(self):
        return self.user_save