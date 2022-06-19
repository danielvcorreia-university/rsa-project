import time
import json
import paho.mqtt.client as mqtt
import csv

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("vanetza/out/#")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("192.168.98.20", 1884, 60)

with open('car_data.csv') as file_obj:

    # Create reader object by passing the file 
    # object to reader method
    reader_obj = csv.reader(file_obj)

    for row in reader_obj:

        #Sending Cams
        f = open("examples/in_cam.json")

        #Building the message
        message = json.load(f)

        message["stationType"] = 5

        message["stationID"] = 2

        message["altitude"] = float(row[9])

        message["heading"] = float(row[14])

        message["latitude"] = float(row[1])

        message["longitude"] = float(row[2])

        message["speed"] = float(row[13])

        print(message)

        #Sending the message
        client.publish("vanetza/in/cam", json.dumps(message))

        time.sleep(1)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()