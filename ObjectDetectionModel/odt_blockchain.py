import numpy as np
import os
import pathlib
import six.moves.urllib as urllib
import sys
import tarfile
import tensorflow as tf
import zipfile
import cv2
import random
import threading 

from collections import defaultdict
from io import StringIO
from matplotlib import pyplot as plt
from PIL import Image
from IPython.display import display

from object_detection.utils import ops as utils_ops
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as vis_util

from datetime import datetime
import json
from web3 import Web3
import math
import pandas as pd 
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive

#Reading Config File
with open('config.txt') as f:
    fileData = [line.rstrip() for line in f]

# web3.py instance
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))
w3.isConnected()
#Check the Use of api_key
api_key = 'AIzaSyAxF3aGEjiG3EJ2R1vBCwH7zEoRb2gNSIc'

path = "maps_coordinates.csv"
file = open(path)
lines = [line for line in file]
file.close()

sync_Queue = []
sync = False

g_login = GoogleAuth()
g_login.LocalWebserverAuth()
drive = GoogleDrive(g_login)

#POTHOLE FOLDER ID
phf_ID = "1J1dhcR1UEB4FM8Rtm5-8pO2hh2--eWJM"

#Setting up the Smart Contract Details
abi = json.loads(fileData[0])
addr = fileData[1]

#Getting the SmartContract Object
contract = w3.eth.contract(address=addr, abi=abi)

#Sender Details
wallet_addr = fileData[2]
wallet_private_key = fileData[3]

def addDamage(damage, img, lat, long):
    nonce = w3.eth.getTransactionCount(wallet_addr)

    print(nonce)

    now = datetime.now() # current date and time
    date_time = now.strftime("%m/%d/%Y, %H:%M:%S")
    
    img_id = driveUpload(phf_ID, img)
    
    txn_dict = contract.functions.newDamage(damage, img_id, lat, long, date_time).buildTransaction({
        'gas': 1400000,
        'gasPrice': w3.toWei('40', 'gwei'),
        'nonce': nonce,
    })

    signed_txn = w3.eth.account.signTransaction(txn_dict, private_key=wallet_private_key)

    result = w3.eth.sendRawTransaction(signed_txn.rawTransaction)


def appendDamage(index):
    nonce = w3.eth.getTransactionCount(wallet_addr)
    
    print(nonce)
    
    now = datetime.now() # current date and time
    date_time = now.strftime("%m/%d/%Y, %H:%M:%S")

    #Priority Code Goes Here
    priority = 5

    txn_dict = contract.functions.append(index, priority, date_time).buildTransaction({
        'gas': 1400000,
        'gasPrice': w3.toWei('40', 'gwei'),
        'nonce': nonce,
    })

    signed_txn = w3.eth.account.signTransaction(txn_dict, private_key=wallet_private_key)

    result = w3.eth.sendRawTransaction(signed_txn.rawTransaction)

# generally used geo measurement function
def measure(lat1, lon1, lat2, lon2):
    pi = math.pi
    R = 6378.137 # Radius of earth in KM
    dLat = lat2 * pi / 180 - lat1 * pi / 180
    dLon = lon2 * pi / 180 - lon1 * pi / 180
    a = math.sin(dLat/2) * math.sin(dLat/2) + math.cos(lat1 * pi / 180) * math.cos(lat2 * pi / 180) * math.sin(dLon/2) * math.sin(dLon/2)
    c = 2 * math.atan2(a**0.5, (1-a)**0.5)
    d = R * c
    return d * 1000 # meters

def driveUpload(folder_ID, img):
    while True:
        try:
            f= open(img,"r")
            f.close()
            break
        except:
            print(img) 
    file = drive.CreateFile({"parents": [{"kind": "drive#fileLink", "id": folder_ID}]})
    file.SetContentFile(img)
    file.Upload()
    print('Created file %s with mimeType %s' % (file['title'],
    file['mimeType']))
    return file['id']

def report():
    while(True):
        if (sync and len(sync_Queue) == 0):
            print("All Done")
            break
            
        if len(sync_Queue) != 0 :

            val = sync_Queue.pop(0)

            name = val[1]

            coordinates = str.split(lines[val[0]].strip(), ',')

            found = False
            for ii in range(1, contract.functions.getDamageCount().call() + 1):
                damage = contract.functions.getDamage(ii).call()

                #checks the distance between 2 coordinates is less than 10m or not
                if (measure(float(coordinates[0]), float(coordinates[1]), float(damage[1]), float(damage[2])) <= 10):
                    found = True
                    appendDamage(ii)
                    break

            #if the reported damage does not exist create a new entry
            if found == False:
                addDamage("Cracks", name, coordinates[0], coordinates[1])
            os.remove(name)


utils_ops.tf = tf.compat.v1


tf.gfile = tf.io.gfile

aiai = 0

def load_model(model_name):
    model_dir = "finetuned"

    model_dir = pathlib.Path(model_dir)/"saved_model"

    model = tf.compat.v2.saved_model.load(str(model_dir), None)
    model = model.signatures['serving_default']


    return model

PATH_TO_LABELS = 'label_map.pbtxt'
category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS, use_display_name=True)


model_name = 'ssd_mobilenet_v1_coco_2017_11_17'
detection_model = load_model(model_name)

print(detection_model.inputs)

detection_model.output_dtypes

print(detection_model.output_shapes)

def run_inference_for_single_image(model, image):
    image = np.asarray(image)
    # The input needs to be a tensor, convert it using `tf.convert_to_tensor`.
    input_tensor = tf.convert_to_tensor(image)
    # The model expects a batch of images, so add an axis with `tf.newaxis`.
    input_tensor = input_tensor[tf.newaxis,...]

    # Run inference
    output_dict = model(input_tensor)

    # All outputs are batches tensors.
    # Convert to numpy arrays, and take index [0] to remove the batch dimension.
    # We're only interested in the first num_detections.
    num_detections = int(output_dict.pop('num_detections'))
    output_dict = {key:value[0, :num_detections].numpy() 
                    for key,value in output_dict.items()}
    output_dict['num_detections'] = num_detections

    # detection_classes should be ints.
    output_dict['detection_classes'] = output_dict['detection_classes'].astype(np.int64)
    
    # Handle models with masks:
    if 'detection_masks' in output_dict:
        # Reframe the the bbox mask to the image size.
        detection_masks_reframed = utils_ops.reframe_box_masks_to_image_masks(
                output_dict['detection_masks'], output_dict['detection_boxes'],
                image.shape[0], image.shape[1])      
        detection_masks_reframed = tf.cast(detection_masks_reframed > 0.5,
                                        tf.uint8)
        output_dict['detection_masks_reframed'] = detection_masks_reframed.numpy()
        
    return output_dict



def show_inference(model, image_path, aiai):
    # the array based representation of the image will be used later in order to prepare the
    # result image with boxes and labels on it.
    #image_np = np.array(Image.open(image_path))
    image_np = image_path
    # Actual detection.
    output_dict = run_inference_for_single_image(model, image_np)
    # Visualization of the results of a detection.
    vis_util.visualize_boxes_and_labels_on_image_array(
        image_np,
        output_dict['detection_boxes'],
        output_dict['detection_classes'],
        output_dict['detection_scores'],
        category_index,
        min_score_thresh=0.45,
        instance_masks=output_dict.get('detection_masks_reframed', None),
        use_normalized_coordinates=True,
        line_thickness=5)
    if len(output_dict['detection_boxes']) != 0:
        for val in output_dict['detection_scores']:
            if (val >= 0.45):
                cv2.imwrite(str(aiai) + ".jpg", image_np, [cv2.IMWRITE_JPEG_QUALITY, 100])
                return True
    return False




cap = cv2.VideoCapture("C:\\Users\\ASMA\\Videos\\DemoVideos\\pothole test 10_2.mp4")

sync = False

# creating thread 
t1 = threading.Thread(target=report)
  
# starting thread 1 
t1.start() 

w=1920
h=1080
CROP_X = (350,200) #take CROP_X[0] from the left and CROP_X[1] from the right
CROP_Y = (400,400) #take CROP_Y[0] from the top and CROP_Y[1] from the bottom

i = 0

fps = 17

frame_count = 0

while(cap.isOpened()): 
      
    # Capture frame-by-frame 
    ret, frame = cap.read()
    if ret == True: 
        #frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
        #frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
        resize_frame2 = cv2.resize(frame, (600, 600))
        cv2.imshow('Original',  resize_frame2) 
        frame_count += 1
        
        if (frame_count % (fps) == 0):
            
            
            frame1 = frame[CROP_Y[0]:h - CROP_Y[1], CROP_X[0]:w - CROP_X[1]]
            if(show_inference(detection_model, frame1, aiai)):
                resize_frame2 = cv2.resize(frame, (600, 600))
                cv2.imshow('Detected',  resize_frame2)
                name="img" + str(aiai) + ".jpg"

                cv2.imwrite(name, frame, [cv2.IMWRITE_JPEG_QUALITY, 100])
                r1 = random.randint(0, 20) % 20
                        
                sync_Queue.append((r1,name))
                aiai = aiai + 1
            
            
                
        cv2.waitKey(25)
        
    # Break the loop 
    else:  
        break
    
    # Press Q on keyboard to  exit 
    if 0xFF == ord('q'):
          break
        
cap.release()
cv2.destroyAllWindows()
sync = True