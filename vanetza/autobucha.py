import json
import paho.mqtt.client as mqtt

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

client = mqtt.Client()
client.on_connect = on_connect

client.connect("192.168.98.10", 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.

f = open("examples/in_denm.json")

message = json.load(f)

message["stationType"] = 6

message["management"]["actionID"]["originatingStationID"] = 1

client.publish("vanetza/in/denm", json.dumps(message))

client.loop_forever()