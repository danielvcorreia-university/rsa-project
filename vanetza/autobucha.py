import time
import json
import paho.mqtt.client as mqtt
import csv
import threading 

#Signal to know when the bus is stopped
stoped = 0

#function to process videos to detect persons and cars
def video_process():
    
    while (stoped==1):
        
        print("\n hello")

        time.sleep(1)

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

t1 = threading.Thread(target=video_process)
t1.start()

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

        #Building the message
        message = json.load(f)

        message["stationType"] = 6

        message["stationID"] = 1

        message["altitude"] = float(row[9])

        message["heading"] = float(row[14])

        message["latitude"] = float(row[1])

        message["longitude"] = float(row[2])

        message["speed"] = float(row[13])

        #Detecting when the bus has stopped
        if (float(row[13])<0.20):

            stoped = 1

        else: 

            stoped = 0    

        print(message)

        print(stoped)

        #Sending the message
        client.publish("vanetza/in/cam", json.dumps(message))

        time.sleep(1)

client.loop_forever()