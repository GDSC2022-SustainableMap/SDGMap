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
            "badge_01":False,
            "badge_02":False,
            "badge_03":False,
            "badge_04":False,
            "badge_05":False,
            "badge_06":False,
            "badge_07":False,
            "badge_08":False,
            "badge_09":False,
            "badge_10":False
        }
        self.backpack: dict = {
            "item_01":False,
            "item_02":False,
            "item_03":False,
            "item_04":False,
            "item_05":False,
            "item_06":False,
            "item_07":False,
            "item_08":False,
            "item_09":False,
            "item_10":False
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



