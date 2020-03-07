#Imports

import numpy as np
import sys
import threading 
import tensorflow as tf
import cv2
import random
import os

from collections import defaultdict
from io import StringIO
from matplotlib import pyplot as plt
from PIL import Image
from PIL import ImageEnhance

from utils import label_map_util

from utils import visualization_utils as vis_util

# Path to frozen detection graph. This is the actual model that is used for the object detection.
PATH_TO_CKPT =  'Models/ssd_inception_RoadDamageDetector.pb' 

# List of the strings that is used to add correct label for each box.
PATH_TO_LABELS = 'Models/crack_label_map.pbtxt'

NUM_CLASSES = 8


#Load a (frozen) Tensorflow model into memory.
detection_graph = tf.Graph()
with detection_graph.as_default():
    od_graph_def = tf.GraphDef()
    with tf.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
        serialized_graph = fid.read()
        od_graph_def.ParseFromString(serialized_graph)
        tf.import_graph_def(od_graph_def, name='')


#Loading Label Maps
label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES, use_display_name=True)
category_index = label_map_util.create_category_index(categories)

#Helper Code
def load_image_into_numpy_array(image):
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape(
        (im_height, im_width, 3)).astype(np.uint8)





def main():
    cap = cv2.VideoCapture('crack1.mp4')

    i = 0
    fps = 27
    frame_count = 0

    with detection_graph.as_default():
        
        with tf.Session(graph=detection_graph) as sess:
            # Definite input and output Tensors for detection_graph
            image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')
            # Each box represents a part of the image where a particular object was detected.
            detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
            # Each score represent how level of confidence for each of the objects.
            # Score is shown on the result image, together with the class label.
            detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
            detection_classes = detection_graph.get_tensor_by_name('detection_classes:0')
            num_detections = detection_graph.get_tensor_by_name('num_detections:0')
            while(cap.isOpened()): 
                
                # Capture frame-by-frame 
                ret, frame = cap.read()
                frame_count = frame_count + 1
                if ret == True: 
            
                    #resize_frame2 = cv2.resize(frame, (600, 600))
                    #cv2.imshow('Original',  resize_frame2)
            
                    # Display the resulting frame 
            
                    if (frame_count % (fps) == 0):
                        
                        # the array based representation of the image will be used later in order to prepare the
                        # result image with boxes and labels on it.
                        #image_np = load_image_into_numpy_array(image)
                        image_np = frame
                        # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
                        image_np_expanded = np.expand_dims(image_np, axis=0)
                        # Actual detection.
                        (boxes, scores, classes, num) = sess.run(
                            [detection_boxes, detection_scores, detection_classes, num_detections],
                            feed_dict={image_tensor: image_np_expanded})
                        # Visualization of the results of a detection.
                        check = vis_util.visualize_boxes_and_labels_on_image_array(
                            image_np,
                            np.squeeze(boxes),
                            np.squeeze(classes).astype(np.int32),
                            np.squeeze(scores),
                            category_index,
                            min_score_thresh=0.5,
                            use_normalized_coordinates=True,
                            line_thickness=8)
                        
                        if type(check) != type(None):
                            #resize_frame1 = cv2.resize(image_np, (600, 600))
                            #cv2.imshow('Detected',  resize_frame1)
                            
                            name="RoadDamage/img" + str(i) + ".jpg"

                            cv2.imwrite(name, resize_frame1, [cv2.IMWRITE_JPEG_QUALITY, 100])
                            i += 1
                            
                            # Random Coordinates are being genereted and the detection is being reported on 
                            # to the ethereum network
                            r1 = random.randint(0, 20) % 10
                            
                            #sync_Queue.append((r1,name))
                            

                    cv2.waitKey(25)
            
            
                    # Press Q on keyboard to  exit 
                    if 0xFF == ord('q'):
                        break
            
                # Break the loop 
                else:  
                    break
        
            
            
    cap.release()
    cv2.destroyAllWindows()

if __name__== "__main__":
    main()