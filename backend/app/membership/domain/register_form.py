from flask_wtf import FlaskForm

from wtforms import StringField, PasswordField, DateField
from wtforms.validators import Length, Email, InputRequired

class RegisterForm(FlaskForm):
    userName = StringField(
        'userName',
        validators=[InputRequired("Please enter your username."), Length(min=2, max=25)]
    )
    password = PasswordField(
        'password',
        validators=[InputRequired("Please enter your password."), Length(min=2, max=25)]
    )
    birthday = DateField(
        'birthday',
        validators=[InputRequired("Please enter your birthday.")]
    )
    email = StringField("email",  [InputRequired("Please enter your email address."), Email("This field requires a valid email address")])
