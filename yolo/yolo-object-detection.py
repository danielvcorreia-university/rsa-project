import cv2
import numpy as np

# Load weights and configuration files to a network using OpenCV function
net = cv2.dnn.readNet('yolov3.weights', 'yolov3.cfg')
# Use Nvidia GPU
net.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
net.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)

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

    cv2.imshow('Frame', img)
    key = cv2.waitKey(1)
    # Verify if the escape key is up
    if key == 27:
        break

cap.release()
cv2.destroyAllWindows()
