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
            "公平交易",
            "創意料理",
            "創新蔬食",
            "友善環境",
            "在地食材",
            "寵物友善",
            "惜食不浪費",
            "有機小農",
            "流浪動物",
            "減塑",
            "源頭減量",
            "純素",
            "綠色採購",
            "蛋奶素",
            "關懷弱勢",
            "食育教育",
            "食農教育",
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
        創意料理= None,
        創新蔬食= None,
        友善環境= None,
        在地食材= None,
        寵物友善= None,
        惜食不浪費= None,
        有機小農= None,
        流浪動物= None,
        減塑= None,
        源頭減量= None,
        純素= None,
        綠色採購= None,
        蛋奶素= None,
        關懷弱勢= None,
        食育教育= None,
        食農教育= None,
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
        if 創意料理 is not None:
            self.創意料理= 創意料理 
            self.創新蔬食= 創新蔬食 
            self.友善環境= 友善環境 
            self.在地食材= 在地食材 
            self.寵物友善= 寵物友善 
            self.惜食不浪費= 惜食不浪費 
            self.有機小農= 有機小農 
            self.流浪動物= 流浪動物
            self.減塑= 減塑
            self.源頭減量= 源頭減量
            self.純素= 純素
            self.綠色採購= 綠色採購
            self.蛋奶素= 蛋奶素
            self.關懷弱勢= 關懷弱勢
            self.食育教育= 食育教育
            self.食農教育= 食農教育
        else :
            self.創意料理= 0
            self.創新蔬食= 0
            self.友善環境= 0
            self.在地食材= 0
            self.寵物友善= 0
            self.惜食不浪費= 0
            self.有機小農= 0
            self.流浪動物= 0
            self.減塑= 0
            self.源頭減量= 0
            self.純素= 0
            self.綠色採購= 0
            self.蛋奶素= 0
            self.關懷弱勢= 0
            self.食育教育= 0
            self.食農教育= 0
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