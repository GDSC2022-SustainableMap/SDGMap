import base64
import io
from PIL import Image
from app.membership.infrastructure import db,auth
def base64_to_png(base64_image):
    img_bytes = base64.b64decode(base64_image.split()[0])
    img_stream = io.BytesIO(img_bytes)
    img = Image.open(img_stream)

    png_stream = io.BytesIO()
    img.save(png_stream, "PNG")

    png_bytes = png_stream.getvalue()

    png_str = 'data:image/png;base64,' + base64.b64encode(png_bytes).decode('utf-8')
    return png_str

def email_to_userid(email):
    users = db.child("users").get()
    for user in users:
        if(user.val()["email"] == email):
            return user.key()
    return users

def get_user_attributes(email):
    users = db.child("users").get()
    for user in users:
        if(user.val()["email"] == email):
            return user.val()
    return {"msg": "notfound"}