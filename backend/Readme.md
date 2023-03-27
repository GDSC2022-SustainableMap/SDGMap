# Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

1. Install [Python](https://www.python.org/).
2. Install depenencies for backend.

    For backend:

    ```bash
        pip install -r requirements.txt
    ```
3. Go to Trello's 資源倉庫, download .env and put it in to this directory.

### Run Backend Server

1. Change into the repo directory: `cd backend/app`
2. Run the flask server (will start on port 5000 by default):
    ```bash
        set FLASK_APP=__init__.py
        flask run
    ```
    
# map APIs:
### 1. /name_search

#### (a)Input:

```yaml
    {
    "target_place":"墨咖啡"
    }
```



#### (b) Details:
Nothing special here.:) 

---
### 2. /radius_search

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
(1) If you don't want to use condition, just let it be empty.

(2) The distance field is caculated by input's lat/lng and the object's lat/lng.

---
### 3. /arbitrary_search

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
### (b) Details:

(1) If you don't want to use condition, just let it be empty.

(2) You should use either target_place or lat/lng, or it will return empty.

(3) If you don't want to use lat/lng, let use_location be "no", or it will return objects according to the lat/lng.

(4) The distance field is caculated by input's lat/lng and the object's lat/lng.

(5) "target_place" should not be empty.


### 4. /membership/login
#### (a)Input:

```yaml
{
    "email": "testuuid@gmail.com",
    "password": "abcdefg"
}
```

### 5. /membership/register

#### (a)Input:

```yaml
{

    "email": "anything@gmail.com",
    "password": "abcdefg",
    "birthday": "1111-11-11",
    "name": "NAME"
}
```

### 6. /membership/reset_password

#### (a)Input:

```yaml
{
    "email": yourEmail
}
```

### 7. /get_references_from_spot    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AND  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/get_photo_from_reference


#### (a-1)/get_references_from_spot Input:

```yaml
{
    "place_id": "ChIJb1dSFvo2aDQRVIbVaIC8rXc",
    "photo_num":999
}
```
#### (b-1)/get_references_from_spot details:
(1) place_id should obtain by 1/2/3 search.

(2) You can choose how many photos reference you want by controlling photo_num.

(3) After get the photo references array, you can use it in /get_photo_from_reference.

(4) Due to the security issue, we cannot pass photo url dirrectly to frontend (google api key is in photo url). So you should use /get_photo_from_reference to get the photo.

#### (a-2)/get_photo_from_reference Input:

```yaml
{
    "reference": "AfLeUgMpttK0GqpyqKGyZImGHZBWnlbzGZfGWoTIdFJs-4J8ZJ5oyNKgYnOYvGcXc4f4Nb63x_YHh_n8L0ANDM_BJBWh05Go8iYUqjWUpXAHm9MXPql1FGP4DwTNwlD3SxS-mIj9nMWQxVLqk2dIzmNEnRSirM-VdeXzlrjTEJMaCWjRnaDo&key=AIzaSyDdYv7-xuoVVF-snwdTmo0e7sXng6gZ6eI",
    "maxwidth": 500,
    "maxheight": 500
}
```

### 8. /check_in
### (a) Inputs:
```yaml
{
    "place_id":"ChIJb1dSFvo2aDQRVIbVaIC8rXc",
    "user_lat":24.8017989055073971,
    "user_lng":120.97159605610153,
    "scope":1
}
```
### (b) Details:
(1) place_id should obtain by 1/2/3 search.

(2) Scope is scaled by KM.

(3)If the distance between place_id's location and user's location is smaller than the scope(KM), it returns True, otherwise False. 


# map APIs

### /upload_image
### (a) Inputs:
```yaml
{
    "base64_image" : <image in base64>
}
```
### (b) Details:
* The input code of base64 should not include "data:image/png;base64," (this header string will be added by the function implemented by backend)

### /get_user_image
### (a) Inputs:
```yaml
{
    "user_uuid" : <uuid of user>
}
```
This will return the png file of the designated user