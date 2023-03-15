class Badge():
    def __init__(self) -> None:
        self.badges: list = [
            "公共議題分享",
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
            "食農教育"
        ]
        self.user_log: dict = {
            "user_id":"",
            "time" : "",
            "place_id": ""
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