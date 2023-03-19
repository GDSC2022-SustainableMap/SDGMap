class Spot(object):
    @classmethod
    def fromdict(cls, d):
        allowed = (
            "business_status",
            "formatted_address",
            "geometry",
            "name",
            "place_id",
            "price_level",
            "rating",
            "user_ratings_total",
            "socket",
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
            "cheap",
            "music",
            "quiet",
            "seat",
            "standing_desk",
            "limited_time",
            "tasty",
            "wifi",
            "seat",
            "opening_hours"

        )
        df = {k: v for k, v in d.items() if k in allowed}
        return cls(**df)

    def __init__(
        self,
        business_status: str,
        formatted_address: str,
        geometry: dict,
        name: str,
        place_id: str,
        price_level= None,
        rating= None,
        user_ratings_total= None,
        publicissue= None,
        freetrade= None,
        creativecuisine= None,
        creativevegetarian= None,
        envfriend= None,
        localgred= None,
        petfriend= None,
        appreciatefood= None,
        organic= None,
        stray= None,
        noplastic= None,
        sourcereduction= None,
        vegetarianism= None,
        greenprocurement= None,
        ovolacto=None,
        careforweak= None,
        foodeduc= None,
        foodagricultureeducation=None,
        cheap= None,
        limited_time= None,
        music= None,
        quiet= None,
        seat= None,
        standing_desk= None,
        tasty= None,
        wifi= None,
        socket=None,
        opening_hours=None
    ) -> None:
        DEFAULT_NUM = 2.5
        self.business_status: str = business_status
        self.formatted_address: str = formatted_address
        self.geometry: dict = geometry
        self.name: str = name
        self.place_id: str = place_id
        if( price_level is not None):
            self.price_level: int = price_level
        else:
            self.price_level = 0
        if( opening_hours is not None):
            self.opening_hours: opening_hours
        else:
            self.opening_hours: dict = {"open_now": False}
        if( user_ratings_total is not None):
            self.user_ratings_total: int = user_ratings_total
        else:
            self.user_ratings_total = 0
        if( rating is not None):
            self.rating: float = rating
        else:
            self.rating = 2.5
        if publicissue is not None:
            self.publicissue = publicissue
            self.freetrade = freetrade
            self.creativecuisine= creativecuisine 
            self.creativevegetarian= creativevegetarian 
            self.envfriend= envfriend 
            self.organic= organic 
            self.localgred= localgred 
            self.petfriend= petfriend 
            self.appreciatefood= appreciatefood 
            self.stray= stray
            self.noplastic= noplastic
            self.sourcereduction= sourcereduction
            self.vegetarianism= vegetarianism
            self.greenprocurement= greenprocurement
            self.ovolacto= ovolacto
            self.careforweak= careforweak
            self.foodeduc= foodeduc
            self.foodagricultureeducation= foodagricultureeducation
        else :
            self.publicissue = 0
            self.freetrade = 0
            self.creativecuisine= 0 
            self.creativevegetarian= 0 
            self.envfriend= 0 
            self.organic= 0 
            self.localgred= 0 
            self.petfriend= 0 
            self.appreciatefood= 0 
            self.stray= 0
            self.noplastic= 0
            self.sourcereduction= 0
            self.vegetarianism= 0
            self.greenprocurement= 0
            self.ovolacto= 0
            self.careforweak= 0
            self.foodeduc= 0
            self.foodagricultureeducation= 0
        if cheap is not None:
            self.cheap= cheap
            self.music= music
            self.quiet= quiet
            self.seat= seat
            self.standing_desk= standing_desk
            self.limited_time= limited_time
            self.tasty= tasty
            self.wifi= wifi
            self.socket = socket
        else:
            self.cheap= DEFAULT_NUM
            self.music= DEFAULT_NUM
            self.quiet= DEFAULT_NUM
            self.seat= DEFAULT_NUM
            self.standing_desk= DEFAULT_NUM
            self.limited_time= DEFAULT_NUM
            self.tasty= DEFAULT_NUM
            self.wifi= DEFAULT_NUM
            self.socket = "no"
    def get_attribute(self):
        outer_attribute = self.__dict__
        return outer_attribute