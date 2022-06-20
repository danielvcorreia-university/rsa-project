import time
import json
import paho.mqtt.client as mqtt
import csv
import threading
import cv2
import numpy as np 

#Signal to know when the bus is stopped
stoped = 0

#function to process videos to detect persons and cars
def video_process():

    # The callback for when the client receives a CONNACK response from the server.
    def on_connect(client, userdata, flags, rc):
        print("Connected with result code "+str(rc))
    
    # Load weights and configuration files to a network using OpenCV function
    net = cv2.dnn.readNet('yolov3.weights', 'yolov3.cfg')
    # Use Nvidia GPU
    net.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
    net.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)

    client = mqtt.Client()
    client.on_connect = on_connect

    client.connect("192.168.98.10", 1883, 60)
    
    classes = []

    # Load network objects names trained 
    with open('coco.names', 'r') as f:
        classes = f.read().splitlines()

    # Capture Video File 
    cap = cv2.VideoCapture('./video3.mp4')
    # Video Stream
    # cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error opening video stream or file!")
        exit()

    while cap.isOpened():
        _, img = cap.read()
        
        try:
            height, width, _ = img.shape
        except:
            break

        # Creating a blob so we can input into the neural network
        blob = cv2.dnn.blobFromImage(img, 1/255, (416, 416), (0, 0, 0), swapRB=True, crop=False)

        # feeding the neural network with blob input
        net.setInput(blob)

        # Getting the output layers names
        output_layers_names = net.getUnconnectedOutLayersNames()
        # Passing the output layers names into the foward function to get the outputs of outer layer
        layerOutputs = net.forward(output_layers_names)

        # Bounding boxes
        boxes = []
        # Confidences
        confidences = []
        # Predicted classes
        class_ids = []
        # Predicted centers
        centers = []

        # Looping over layers outputs
        for output in layerOutputs:
            for detection in output:
                # Store 80 class predictions
                scores = detection[5:]
                # The locations that contain the highest scores
                class_id = np.argmax(scores)
                # cofidence of each eighty class object
                confidence = scores[class_id]

                if confidence > 0.8:
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)

                    # Position uper left corner
                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)

                    boxes.append([x, y, w, h])
                    confidences.append((float(confidence)))
                    class_ids.append(class_id)
                    centers.append(center_x)

        indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)

        # Font of letters in image
        font = cv2.FONT_HERSHEY_PLAIN
        # Color of each object detected (random)
        colors = np.random.uniform(0, 255, size=(len(boxes), 3))

        if len(indexes) > 0:

            print("new detection-------------------------------------------------------------------------")

            id = 0

            f1 = open("new_cpm.json")
            lista = []
            Cmessage = json.load(f1)
 

            detected = 0

            car_detected = 0

            person_detected = 0

            for i in indexes.flatten():
                # Extract cordinate information back from boxes
                x, y, w, h = boxes[i]
                c = centers[i]
                # Label is the name of class detected in the coco file names
                label = str(classes[class_ids[i]])
                if (label == 'car' and c < width/2) or label == 'person':
                    # Confidence of the object detected
                    confidence = str(round(confidences[i], 2))
                    # Pick a color for each object
                    color = colors[i]
                    # Create a rectangle and put the label at upper left corner
                    cv2.rectangle(img, (x,y), (x+w, y+h), color, 2)
                    cv2.putText(img, label + " " + confidence, (x, y+20), font, 2, (255, 255, 255), 2)
                    # Print object detected in terminal
                    print('%s (%d, %d)' % (label, x, y))

                    if (label == 'car'):

                        f2 = open("object.json")
                        Pobject = json.load(f2)

                        detected = 1
                        car_detected = 1
                        
                        Pobject["objectID"] = int(id)
                        Pobject["objectConfidence"] = float(confidence)
                        Pobject["classification"][0]["confidence"] = float(confidence)
                        Pobject["classification"][0]["class"]["vehicle"]["confidence"] = float(confidence)
                        lista.append(Pobject)
                        Cmessage["cpmParameters"]["numberOfPerceivedObjects"] += 1
                        
                        id = id + 1

                    if (label == 'person'):

                        f2 = open("object_person.json")
                        Pobject = json.load(f2)

                        detected = 1
                        person_detected = 1
                        
                        Pobject["objectID"] = int(id)
                        Pobject["objectConfidence"] = float(confidence)
                        Pobject["classification"][0]["confidence"] = float(confidence)
                        Pobject["classification"][0]["class"]["person"]["confidence"] = float(confidence)
                        lista.append(Pobject)
                        Cmessage["cpmParameters"]["numberOfPerceivedObjects"] += 1
                        
                        id = id + 1
            
            if (detected == 1):
                Cmessage["cpmParameters"]["perceivedObjectContainer"] = lista
                print(Cmessage)
                client.publish("vanetza/in/cpm", json.dumps(Cmessage))

                if (person_detected==1):
                    
                    f3 = open("examples/in_denm.json")
                    
                    Dmessage = json.load(f3)

                    Dmessage["management"]["stationType"] = 6

                    Dmessage["management"]["validityDuration"] = 1

                    Dmessage["management"]["actionID"]["originatingStationID"] = 1
                    
                    Dmessage["situation"]["eventType"]["causeCode"] = 12

                    Dmessage["situation"]["eventType"]["subCauseCode"] = 12

                    print(Dmessage)

                    client.publish("vanetza/in/denm", json.dumps(Dmessage))

                if (car_detected==1):
                    
                    f3 = open("examples/in_denm.json")
                    
                    Dmessage = json.load(f3)

                    Dmessage["management"]["stationType"] = 6

                    Dmessage["management"]["validityDuration"] = 1

                    Dmessage["management"]["actionID"]["originatingStationID"] = 1
                    
                    Dmessage["situation"]["eventType"]["causeCode"] = 40

                    Dmessage["situation"]["eventType"]["subCauseCode"] = 40

                    print(Dmessage)

                    client.publish("vanetza/in/denm", json.dumps(Dmessage))



        # cv2.imshow('Frame', img)
        key = cv2.waitKey(1)
        # Verify if the escape key is up
        if key == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

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

        f1 = open("examples/in_denm.json")

        #Building the message
        message = json.load(f)

        Dmessage = json.load(f1)

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

            Dmessage["management"]["stationType"] = 6

            Dmessage["management"]["validityDuration"] = 1

            Dmessage["management"]["actionID"]["originatingStationID"] = 1

            Dmessage["management"]["eventPosition"]["latitude"] = float(row[1])

            Dmessage["management"]["eventPosition"]["longitude"] = float(row[2])

            Dmessage["management"]["eventPosition"]["altitude"]["altitudeValue"] = float(row[9])
            
            Dmessage["situation"]["eventType"]["causeCode"] = 94

            Dmessage["situation"]["eventType"]["subCauseCode"] = 94

            print(Dmessage)

            client.publish("vanetza/in/denm", json.dumps(Dmessage))

        else: 

            stoped = 0    

        print(message)

        print(stoped)

        #Sending the message
        client.publish("vanetza/in/cam", json.dumps(message))

        time.sleep(1)

client.loop_forever()