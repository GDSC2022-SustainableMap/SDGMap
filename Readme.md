### Frontend has not implemented:
1. Login.js function merging. (Normal login and google login.)
2. Some css style rendered incorrectly. (eg: signup.js)

# Backend
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

1. Install [Python](https://www.python.org/).
2. Install depenencies for backend.
    Change directory to backend and run:
    ```bash
    pip install -r requirements.txt
    ```
3. Go to Google Api to get a API key
4. Go to fire base to get another key for database

### Run Backend Server

1. Change into the repo directory: `cd backend/app`
2. Run the flask server (will start on port 5000 by default):
    ```bash
    set FLASK_APP=__init__.py
    flask run
    ```

## map APIs:
### 1. /map/name_search
+ Search place by its name
#### (a)Input:

```yaml
    {
    "target_place":"墨咖啡"
    }
```

### 2. /map/radius_search
+ Search places by the given location and its radius
#### (a)Input:
```yaml
{
    "lat":24.801798905507397,
    "lng":120.97159605610153,
    "condition": {
        "0":"distance",
        "1": "quiet",
        "2": "seat",
        "3": "standing_desk",
        "4": "tasty",
        "5": "cheap",
        "6": "music",
        "7": "limited_time",
        "8": "wifi"
    }
}
```
#### (b) Details:
+ If you don't want to use condition, just let it be empty.
+ The distance field is caculated by input's lat/lng and the object's lat/lng.

### 3. /map/arbitrary_search
+ Search for a place with any key word you like
#### (a)Input:
```yaml
{
    "target_place":"墨咖",
    "lat":24.8017989055073971,
    "lng":120.97159605610153,
    "use_location":"no",
    "condition": {
        "0":"distance",
        "1": "quiet",
        "2": "seat",
        "3": "standing_desk",
        "4": "tasty",
        "5": "cheap",
        "6": "music",
        "7": "limited_time",
        "8": "wifi"
        }
}
```
#### (b) Details:
+ If you don't want to use condition, just let it be empty.
+ You should use either target_place or lat/lng, or it will return empty.
+ If you don't want to use lat/lng, let use_location be "no", or it will return objects according to the lat/lng.
+ The distance field is caculated by input's lat/lng and the object's lat/lng.
+ "target_place" should not be empty.

### 3. /map/find_place_result
#### (a) Input:
```yaml
    {
        "place_id": place id of google api
    }    
```

### 4. /map/user_recent_log
+ return the 5 most recent places the designated user visited.
#### (a)Input:
```yaml
    {
        "place_id": place id of google api
    }  
```

### 5. /map/check_in
+ check if the user in in a designated position, if true check the user in
+ checking in can give user coins and badges
#### (a)Input:
```yaml
    {
        "place_id": place id from google places API
        "user_lat": latitude,
        "user_lng": longitude,
        "scope":1
    }
```
#### (b)details:
+ longitude and latitude is given by the location given by browser.
+ scope is the endurable distance error between the user and store (in kilometer)

### 5. /map/save_store
+ Save the designated store as a favorite sorte of the user.
#### (a)Input:
```yaml
    {
        "place_id": place id from google places API
    }
```

### 6. /map/delete_saved_store
+ Remove a store in the saved list.
#### (a)Input:
```yaml
    {
        "place_id": place id from google places API
    }
```

### 7. /map/get_references_from_spot
+ give pictures of the designated store.
#### (a) Input:
```yaml
    {
        "place_id": place id of google api,
        "photo_num": photo numbers
    }    
```
#### (b)Details
+ This API gives bask the picture attributes given from google API.
+ The format is a json recording all the photos called

### 8. /map/get_photo_from_reference
+ Turn the called photo intop the size desired
#### (a) Input:
```yaml
    {
        "reference": receive["reference"],
        "maxwidth": receive["maxwidth"],
        "maxheight": receive["maxheight"],
    }    
```


## user APIs:
### 1. /user/register
Registers into the website
#### (a)Input:

```yaml
    {
        "userName" : "username",
        "password" : "abcdefg",
        "birthday" : "2020-10-31",
        "email" : "username@gmail.com"
    }
```

### 2. /user/login
Login to the website
#### (a)Input:
```yaml
    {
        "email": "username@gmail.com",
        "password": "abcdefg"
    }
```

### 3. /user/edit_profile
+ Edit the logged in user's profile
+ Login required
#### (a)Input:
```yaml
    "name": "newname",
    "biograph": "some things you want to show"
```
#### (b)details:
+ 1.There are limited chances to change username.
- 2.Name or biograph can be left empty while submitting the json.

### 4. /user/profile
+ Get the profile of the current loggend in user.
+ Login required
#### (a)Input:
No input required

### 5. /user/reset_password
+ Reset password of the given account
#### (a)Input:
```yaml
    "email" : email of the user
```
#### (b)details:
+ an email will be sent to the given email to reset the password.

### 6. /user/logout
+ Logout the current user.
+ Login required
#### (a)Input:
No input required

### 7. /user/delete
+ Delete account
### (a)Input:
```yaml
    "email" : email of the user
```

### 8./user/add_friend
+ Add an existing account as a friend.
+ Login required
### (a)Input:
```yaml
    "email" : email of a friend
```

### 9./user/delete_friend
+ Remove an existing friend
+ Login required
### (a)Input:
```yaml
    "email" : email of a friend
```

### 10./user/track_userlog
+ See the places where the current user visited
+ Login required
### (a)Input:
No input required

### 11./user/track_usersave
+ See the places where the current user saved
+ Login required
### (a)Input:
No input required

### 12./user/upload_image
+ Upload an image as the profile picture
+ Login required
### (a)Input:
```yaml
    "base64_image" : base64 code of image
```
### (b)Details:
+ This API can only read png files currently.

### 13./user/get_image
+ Return the profile picture of the designated user
+ Login required
### (a) Input:
```yaml
{
    "user_uuid" : uuid of user
}
```

### 14./user/leaderboard
+ Return the leading users (by ranking the badges collected)
+ Login required
### (a)Input:
No input required

### 15./user/search
+ Find an existing user by the user's email.
### (a)Input:
```yaml
    "email" : email of a friend
```

### 16. /user/email_to_userid
+ give the uuid of user from email
### (a)Input:
```yaml
    "email" : email of user
```