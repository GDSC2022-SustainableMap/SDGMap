# Getting Started

## Prerequisites
1. Install Python.
2. Install dependencies.
    * For app.py: <br>
        1. Install Anaconda https://docs.anaconda.com/anaconda/install/
        2. install dependencies
             ```bash
            $ pip install -U googlemaps
            $ pip install geocoder
## Run
1. change to the repo directory: `cd SDG`
2. run flask server
    ```bash
    $ flask run

## Usage
1. search by radius: input a longitude and latitude coordinate to search box.<br>(ex. `24.801798905507397, 120.97159605610153`)
2. search by name: input a name of the target in search box.<br>(ex. `墨咖啡`)
3. search by anything: input anything you would like to search for.<br>
(ex. `義大利麵`)<br>

`Searching language supports Traditional Chinese(Taiwan) and English.`

`"outoutFormat" directory records the formatted output object for each search method.`