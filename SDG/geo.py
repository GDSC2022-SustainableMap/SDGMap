import geocoder
g_me = geocoder.ip("me")

print("me " + str(g_me.city) + " "+ str(g_me.latlng))
#print("train" + str(g_google.latlng))