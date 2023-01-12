# Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

1. Install [Python](https://www.python.org/).
2. Install depenencies for backend.

    For backend:

    ```bash
        pip install -r requirements.txt
    ```
### Run Client Server

1. Change into the repo directory: `cd backend`
2. Run the flask server (will start on port 5000 by default):
    ```bash
        ./app.py
    ```
    
# APIs:
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
