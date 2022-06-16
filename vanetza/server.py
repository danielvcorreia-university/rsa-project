import paho.mqtt.client as mqtt
import asyncio
import websockets
import json
import threading

def task1 ( ):
  # The callback for when the client receives a CONNACK response from the server.
  def on_connect(client, userdata, flags, rc):
      print("Connected with result code "+str(rc))
      # Subscribing in on_connect() means that if we lose the connection and
      # reconnect then subscriptions will be renewed.
      client.subscribe("vanetza/out/#")

  # The callback for when a PUBLISH message is received from the server.
  def on_message(client, userdata, msg):
    global data
    data = json.loads(msg.payload.decode('utf8'))
    
  client = mqtt.Client()
  client.on_connect = on_connect
  client.on_message = on_message

  client.connect("192.168.98.20", 1884, 60)

  # Blocking call that processes network traffic, dispatches callbacks and
  # handles reconnecting.
  # Other loop*() functions are available that give a threaded interface and a
  # manual interface.
  # started in a thread
  client.loop_forever()

# The handler of the web socket server
async def handler(websocket):
  while True:
    # print(data)
    await websocket.send(json.dumps([data]))
    await asyncio.sleep(1)

data = {}

first = threading.Thread ( target = task1 )
first.start ( )

start_server = websockets.serve(handler , "127.0.0.1", 8888)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
