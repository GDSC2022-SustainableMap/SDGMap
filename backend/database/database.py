#Not implemented yet.
from os import path
print(path.abspath(path.dirname(__file__)))
user_setting = {
    "user_id": "",
    "name":"",
    "current_location":"",
    "email":"",
    "birthday":"",
    "change_name_chance":0,
    "friend_number": 0,
    "coins": 0,
    "biograph":"",
    "comments_count":0,
    "rating_count":0,
    "visited_store_count":0,
    "badges":{
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
        # "社會服務":0,
        "純素":0,
        "綠色採購":0,
        "蛋奶素":0,
        "關懷弱勢":0,
        "食育教育":0,
        "食農教育":0
    },
    "backpack":{
        "item_1":0,
        "item_2":0,
        "item_3":0,
        "item_4":0,
        "item_5":0,
        "item_6":0,
        "item_7":0,
        "item_8":0,
        "item_9":0,
        "item_10":0
    }
}

user_friend = {
    "friend_1":{
        "user_id":"",
        "name":""
    },
    "friend_2":{
        "user_id":"",
        "name":""
    },
    "friend_3":{
        "user_id":"",
        "name":""
    },
    "friend_4":{
        "user_id":"",
        "name":""
    },
    "friend_5":{
        "user_id":"",
        "name":""
    },
    "friend_6":{
        "user_id":"",
        "name":""
    },
    "friend_7":{
        "user_id":"",
        "name":""
    },
    "friend_8":{
        "user_id":"",
        "name":""
    },
    "friend_9":{
        "user_id":"",
        "name":""
    },
    "friend_10":{
        "user_id":"",
        "name":""
    },
    "friend_11":{
        "user_id":"",
        "name":""
    },
    "friend_12":{
        "user_id":"",
        "name":""
    },
    "friend_13":{
        "user_id":"",
        "name":""
    },
    "friend_14":{
        "user_id":"",
        "name":""
    },
    "friend_15":{
        "user_id":"",
        "name":""
    },
    "friend_16":{
        "user_id":"",
        "name":""
    },
    "friend_17":{
        "user_id":"",
        "name":""
    },
    "friend_18":{
        "user_id":"",
        "name":""
    },
    "friend_19":{
        "user_id":"",
        "name":""
    },
    "friend_20":{
        "user_id":"",
        "name":""
    },
}

# template for user check in
user_log = {
    "user_id":"",
    "time" : "",
    "place_id": ""
}

# template for user save store
user_save = {
    "user_id":"",
    "place_id": ""
}

place_id = {
    "praise":{
        "user_id":{

        },
    },
    "counts":{

    }
}

place_api = {}

# cafe_map = {
#     "place_api_id":""
# }

cafe_map = {}

badge_names = [
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