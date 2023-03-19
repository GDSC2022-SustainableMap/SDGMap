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
            "publicissue":0,
            "freetrade":0,
            "creativecuisine":0,
            "creativevegetarian":0,
            "envfriend":0,
            "localgred":0,
            "petfriend":0,
            "appreciatefood":0,
            "organic":0,
            "stray":0,
            "noplastic":0,
            "sourcereduction":0,
            "vegetarianism":0,
            "greenprocurement":0,
            "ovolacto":0,
            "careforweak":0,
            "foodeduc":0,
            "foodagricultureeducation":0
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

class user_unity():
    """ Attirbutes for player's unity account """
    def __init__(self) -> None:
        self.background: int = 0
        self.bearCl: dict = {
            "normal": True,
            "plainClothes": False
        }
        self.bearIt: dict = {
            "honey": False,
            "normal": True,
            "salmon": False
        }
        self.bearItems : int = 0
        self.bearclothes : int = 0
        self.birdCl :dict = {
            "normal": True
        }
        self.birdIt : dict = {
            "fan": False,
            "flower": False,
            "normal": True
        }
        self.birdItems : int = 0
        self.birdclothes : int = 0
        self.carpet : int = 1
        self.character : int = 0
        self.chat1 : str = "Hello~"
        self.chat2 : str = "Let Adventure!"
        self.chat3 : str = "Hi!"
        self.deco : dict = {
            "bed": False,
            "bookcase": False,
            "lamp": False,
            "sofa": False,
            "switch": False,
            "treadmill": False,
            "tv": False,
            "window": False
        }
        self.exp : int = 10000
        self.friend : dict = {}
        self.glasses : int = 0
        self.hat : int = 0
        self.hbackground : dict = {
            "DarkWall": False,
            "SoftWall": False,
            "SweetWall": False,
            "WoodWall": False,
            "normal": True
        }
        self.hcarpet : dict = {
            "WhiteRug": False,
            "basketballCourt": False,
            "beach": False,
            "normal": True,
            "woodFloor": False
        }
        self.hdeco : dict = {
            "bed": False,
            "bookcase": False,
            "lamp": False,
            "sofa": False,
            "switch": False,
            "treadmill": False,
            "tv": False,
            "window": False
        }
        self.hglasses : dict = {
            "fasionglasses": False,
            "normal": True,
            "sunglasses": False
        }
        self.hhat : dict = {
            "atHelmat": False,
            "fasionHat": False,
            "normal": True,
            "xmasHat": False
        }
        self.hmask : dict = {
            "greenMask": False,
            "normal": True
        }
        self.hshoe : dict = {
            "bwShoe": False,
            "fasionShoe": False,
            "normal": True
        }
        self.login : bool = False
        self.mask : int = 0
        self.money : int = 2000
        self.monkeyCl : dict = {
            "normal": True,
            "workClothes": False
        }
        self.monkeyIt : dict = {
            "banana": False,
            "basketball": False,
            "normal": True
        }
        self.monkeyItems : int = 0
        self.monkeyclothes : int = 0
        self.name : str = "Player001"
        self.password: str = "001"
        self.shoe : int = 0
        self.sound1 : float = 0.5
        self.sound2 : float = 0.5

    def get_attribute(self):
        outer_attribute = self.__dict__
        return outer_attribute



