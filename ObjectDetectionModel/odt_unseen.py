import numpy as np
import os
import pathlib
import six.moves.urllib as urllib
import sys
import tarfile
import tensorflow as tf
import zipfile
import cv2

from collections import defaultdict
from io import StringIO
from matplotlib import pyplot as plt
from PIL import Image
from IPython.display import display

from object_detection.utils import ops as utils_ops
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as vis_util


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
                #cv2.imwrite(str(aiai) + ".jpg", image_np, [cv2.IMWRITE_JPEG_QUALITY, 100])
                return True
    return False




cap = cv2.VideoCapture("C:\\Users\\DRAGON\\Videos\\DemoVideos\\pothole test 9_1.mp4")


w=1920
h=1080
CROP_X = (250,300) #take CROP_X[0] from the left and CROP_X[1] from the right
CROP_Y = (800,25) #take CROP_Y[0] from the top and CROP_Y[1] from the bottom

i = 0

fps = 6

frame_count = 0

while(cap.isOpened()): 
      
    # Capture frame-by-frame 
    ret, frame = cap.read()
    if ret == True: 
        #frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
        #frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
        #resize_frame2 = cv2.resize(frame, (600, 600))
        #cv2.imshow('Original',  resize_frame2) 
        frame_count += 1
        
        if (frame_count % (fps) == 0):
            
            
            frame1 = frame[CROP_Y[0]:h - CROP_Y[1], CROP_X[0]:w - CROP_X[1]]
            show_inference(detection_model, frame1, aiai)
            #resize_frame2 = cv2.resize(frame, (600, 600))
            cv2.imshow('Detected',  frame1)
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