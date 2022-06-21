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
    if (msg.topic == 'vanetza/out/denm'):
      global car1_denm_mutex
      global car1_denm_data
      car1_denm_mutex.acquire()
      car1_denm_data.append(json.loads(msg.payload.decode('utf8')))
      car1_denm_mutex.release()
    elif (msg.topic == 'vanetza/out/cpm'):
      global car1_cpm_mutex
      global car1_cpm_data
      car1_cpm_mutex.acquire()
      car1_cpm_data.append(json.loads(msg.payload.decode('utf8')))
      car1_cpm_mutex.release()
    elif (msg.topic == 'vanetza/out/cam_full'):
      global bus_mutex
      global bus_data
      bus_mutex.acquire()
      bus_data = json.loads(msg.payload.decode('utf8'))
      bus_mutex.release()
    
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

def task2 ( ):
  # The callback for when the client receives a CONNACK response from the server.
  def on_connect(client, userdata, flags, rc):
      print("Connected with result code "+str(rc))
      # Subscribing in on_connect() means that if we lose the connection and
      # reconnect then subscriptions will be renewed.
      client.subscribe("vanetza/out/#")

  # The callback for when a PUBLISH message is received from the server.
  def on_message(client, userdata, msg):
    if (msg.topic == 'vanetza/out/cam_full'):
      global car1_mutex
      global car1_data
      car1_mutex.acquire()
      car1_data = json.loads(msg.payload.decode('utf8'))
      car1_mutex.release()
    
  client = mqtt.Client()
  client.on_connect = on_connect
  client.on_message = on_message

  client.connect("192.168.98.10", 1883, 60)

  # Blocking call that processes network traffic, dispatches callbacks and
  # handles reconnecting.
  # Other loop*() functions are available that give a threaded interface and a
  # manual interface.
  # started in a thread
  client.loop_forever()

# The handler of the web socket server
async def handler(websocket):
  while True:
    # print(bus_data)
    global bus_mutex
    global car1_mutex
    bus_mutex.acquire()
    car1_mutex.acquire()
    await websocket.send(json.dumps([bus_data, car1_data]))
    bus_mutex.release()
    car1_mutex.release()
    await asyncio.sleep(1)

# The handler of the web socket server
async def handler2(websocket):
  while True:
    global car1_denm_mutex
    global car1_denm_data
    car1_denm_mutex.acquire()
    await websocket.send(json.dumps(car1_denm_data))
    car1_denm_mutex.release()
    await asyncio.sleep(1)

# The handler of the web socket server
async def handler3(websocket):
  while True:
    global car1_cpm_mutex
    global car1_cpm_data
    car1_cpm_mutex.acquire()
    await websocket.send(json.dumps(car1_cpm_data))
    car1_cpm_mutex.release()
    await asyncio.sleep(1)

bus_mutex = threading.Lock()
car1_mutex = threading.Lock()
car1_denm_mutex = threading.Lock()
car1_cpm_mutex = threading.Lock()
bus_data = []
car1_data = []
car1_denm_data = []
car1_cpm_data = []

first = threading.Thread ( target = task1 )
second = threading.Thread ( target = task2 )
first.start ( )
second.start ( )

start_server = websockets.serve(handler , "127.0.0.1", 8888)
start_server2 = websockets.serve(handler2 , "127.0.0.2", 8887)
start_server3 = websockets.serve(handler3 , "127.0.0.3", 8889)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_until_complete(start_server2)
asyncio.get_event_loop().run_until_complete(start_server3)
asyncio.get_event_loop().run_forever()
