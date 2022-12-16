# MoneyPlan

Overview
--
Moneyplan is a web service that allows you search the coffee shop near you or the coffee shop located at targeted region.
We use 3 API to provide you a information integration platform for cafe shop.

1. Short-term usability goals
Integreted cafe nomad and the data of place api


2. API  information
* Name : Cafe nomad
* Url : https://cafenomad.tw/api/v1.2/cafes
* Description : 

Open-source Cafe platform. No need for the token.

* Name : place api
* Url : https://maps.googleapis.com/maps/api/place/textsearch/json?query=#{input}&key=#{token}&language=zh-TW

* Description : 
We use the place api, which is supported by Google, to search regional cafe shop information on google map. However, due to this api is charable, we saved it in out database as cache and use vcr package to lower the request sending demand for our platform.

3. Long-term usability goals

Added addtional api for locate the user without loggin required.
It haven't been built yet. We will build this function in the future.

* Name : google map
* Url : https://developers.google.com/maps?hl=zh-tw
* Description : 

Get the users location. We will use the longitude and latitude of user to caculate the distance of the cofffee shops to recommended.


