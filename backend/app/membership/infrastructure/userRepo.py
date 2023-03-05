from app.membership.domain import User
from app.app import db, auth
from flask import session
from app.membership.domain.friend import Friend
class UserRepo():

    def __init__(self, ) -> None:
        self._context = db.child("users")

    def create(self, receive:dict) -> User:
        newUser = auth.create_user_with_email_and_password(receive["email"], receive["password"])
        user_id=newUser['localId']
        user = User(
            name=receive['userName'],
            email=receive['email'],
            birthday=receive['birthday'],
            password=receive['password'],
            user_id=user_id
        )
        data = user.get_attribute()
        # print(data)
        self._context.child(user_id).set(data)
        return user
    
    def update(self, receive:dict) -> User:
        current_user = session["user_id"]
        user_info = db.child("users").child(current_user).get().val()
        print(user_info)

        if ("name" in receive):
            if user_info["change_name_chance"] >= 1:
                db.child("users").child(current_user).update({"name":receive["name"],"change_name_chance":0})
                return "Changed sucessfully!"
            else:
                return "You can only change your name once!"
        if ("biograph" in receive):
            db.child("users").child(current_user).update({"biograph":receive["biograph"]})
            return "Changed sucessfully!"
        if ("friend" in receive):
            current_user_friend_num = db.child("users").child(current_user).get().val()["friends"]["friend_number"]
            current_user_friend = db.child("users").child(current_user).get().val()["friends"]

            #確認是否有這個id的人
            print(current_user)
            friend = self.read({'user_id':current_user})
            if (friend is None):
                return "This person does not exist!"
            friend_name = friend["name"]
        
            #確認是否重複加入好友
            for key, value in current_user_friend.items():
                if key != "friend_number":  
                    if current_user in value.values():
                        return "You have this frined already!"

            #如果好友多餘20個就回報錯誤
            if(current_user_friend_num >= 20):
                return "You can only have 20 frineds!"
            
            current_user_friend_num += 1
            friend = Friend(receive['friend'],friend_name).info
            # update new friend to firebase
            db.child("users").child(current_user).child("friends").child("friend_" + f"{current_user_friend_num:02d}").set(friend)
            db.child("users").child(current_user).child("friends").update({"friend_number":current_user_friend_num})
            return f"{receive['friend']} added as friend"

        
    def delete(self, receive:dict):
        print(db.child("users").child(receive['user_id']).get().val())
        if db.child("users").child(receive['user_id']).get().val():
            db.child("users").child(receive["user_id"]).remove()
            return "Delete successfully!"
        else:
            return "User does not exists!"
    
    def read(self, receive:dict):
        if db.child("users").child(receive['user_id']).get().val():
            return db.child("users").child(receive['user_id']).get().val()
        else:
            return None


        


