from app.membership.domain import User, user_unity
from app.app import db, auth, storage
from app.membership.domain.friend import Friend
from PIL import Image
# from base64 import decodestring
import base64
import time

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
        unity = user_unity()
        data = user.get_attribute()
        unity_data = unity.get_attribute()
        # print(data)
        db.child(user_id).set(data)
        db.child("users_unity").child(user_id).set(unity_data)
        return user
    
    def update(self, receive:dict) -> User:

        messages={}
        if ("name" in receive and len(receive["name"]) > 0):
            current_user = receive["user_id"]
            user_info = db.child("users").child(current_user).get().val()

            if user_info["change_name_chance"] >= 1:
                db.child("users").child(current_user).update({"name":receive["name"],"change_name_chance":0})
                messages["msg_name"] = "Name changed sucessfully!"
            else:
                messages["msg_name"] = "You can only change your name once!"
        if ("biograph" in receive):
            current_user = receive["user_id"]
            user_info = db.child("users").child(current_user).get().val()

            db.child("users").child(current_user).update({"biograph":receive["biograph"]})
            messages["msg_biograph"] = "Biograph changed sucessfully!"
        return messages

        
    def delete(self, receive:dict):
        print(db.child("users").child(receive['user_id']).get().val())
        if db.child("users").child(receive['user_id']).get().val():
            db.child("users").child(receive["user_id"]).remove()
            return "Delete successfully!"
        else:
            return "User does not exists!"
    
    def read(self, receive:dict):
        if db.child("users").child(receive['user_id']).get().val():
            print(db.child("users").child(receive['user_id']).get().val())
            return db.child("users").child(receive['user_id']).get().val()
        else:
            return None



        


