from app.membership.domain.friend import Friend

class User():
    def __init__(self,  name: str, birthday: str,  user_id:str, email: str,password:str) -> None:
        self.name: str = name
        self.email: str = email
        self.birthday: str = birthday
        self.user_id: str = user_id
        self.change_name_chance: int = 1
        self.password: str = password
        self.friends = self.FriendDict()
        self.current_location: str = ""
        self.coin: int = 0
        self.biograph: str = ""
        self.comment_count: int = 0
        self.rating_count: int = 0
        self.visited_count: int = 0
        self.badges: dict = {
            "公共議題分享":0,
            "公平交易":0,
            "創意料理":0,
            "創新蔬食":0,
            "友善環境":0,
            "在地食材":0,
            "寵物友善":0,
            "惜食不浪費":0,
            "有機小農":0,
            "流浪動物":0,
            "減塑":0,
            "源頭減量":0,
            "純素":0,
            "綠色採購":0,
            "蛋奶素":0,
            "關懷弱勢":0,
            "食育教育":0,
            "食農教育":0
        }
        self.backpack: dict = {
            "banana":0,
            "caterpillar":0,
            "the_egg":0,
            "earthworm":0,
            "honey":0,
            "ant":0,
            "red_fruit":0,
            "grape":0,
            "nuts":0,
        }
    def change_name(self, new_name: str):
        if (not new_name or not len(new_name)):
            raise ValueError("Cannot change to empty")
        if (self.change_name_chance < 1):
            raise ValueError("You can only change name one time!")
        self.name = new_name
        return self
    def get_attribute(self):
        outer_attribute = self.__dict__
        outer_attribute["friends"] = self.friends.__dict__
        return outer_attribute

    class FriendDict:
        def __init__(self):
            self.friend_number: int = 0
            self.friends: dict = {}
        def add_friend(self,user_id, name):
            friend = Friend(user_id, name)
            friend_str = "friend_" + f"{self.friend_number:02d}"
            self.friends[friend_str] = friend.info



