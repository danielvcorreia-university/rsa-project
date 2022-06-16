import time
import json
import paho.mqtt.client as mqtt
import csv

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

client = mqtt.Client()
client.on_connect = on_connect

client.connect("192.168.98.10", 1883, 60)


with open('bus_data.csv') as file_obj:

    # Create reader object by passing the file 
    # object to reader method
    reader_obj = csv.reader(file_obj)

    for row in reader_obj:

        #Sending Cams
        f = open("examples/in_cam.json")

        message = json.load(f)

        message["stationType"] = 6

        message["stationID"] = 1

        message["altitude"] = float(row[9])

        message["heading"] = float(row[14])

        message["latitude"] = float(row[1])

        message["longitude"] = float(row[2])

        message["speed"] = float(row[13])

        print(message)

        client.publish("vanetza/in/cam", json.dumps(message))

        time.sleep(1)

client.loop_forever()