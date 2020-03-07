from keras.models import model_from_json
from PIL import Image
from PIL import ImageEnhance
import cv2
import threading
import os
import random
import numpy as np

# load json and create model
json_file = open('Models/model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
loaded_model = model_from_json(loaded_model_json)
# load weights into new model
loaded_model.load_weights("Models/model.h5")
print("Loaded model from disk")



#Image Optimization functions
def prep_imgs_for_plt(imgs):
    return [np.flip(img, 2) for img in imgs]
    
def avg_img(img_list):
    return np.array(img_list).mean(axis=0, dtype=np.uint32)

def show_img(img, text="", prep=True):
    if(prep):
        img = prep_imgs_for_plt([img])[0]
    fig, ax = plt.subplots(1, figsize=(25,25))
    ax.set_title(text)
    ax.imshow(img)

def apply_threshold(threshold, data):
    return [0 if item < threshold else 1 for item in data]

def display_prediction(X, y, index):
    image = X[index]
    print (image.shape)
    label = y[index]
    pred = loaded_model.predict(np.expand_dims(image, axis=0))
    print (np.expand_dims(image, axis=0).shape)
    show_img(image, "label: {}, prediction: {}".format(label, pred))
    
    
def my_display_prediction(image):
    pred = loaded_model.predict(np.expand_dims(image, axis=0))
    #show_img(image, "label: {}, prediction: {}".format(1, pred))
    return pred

def enchance_image(image):
    enh_bri = ImageEnhance.Brightness(image)
    brightness = 1.2
    image = enh_bri.enhance(brightness)
    

    enh_col = ImageEnhance.Color(image)
    color = 1.5
    image = enh_col.enhance(color)
    

    enh_con = ImageEnhance.Contrast(image)
    contrast = 0.8
    image = enh_con.enhance(contrast)
    

    enh_sha = ImageEnhance.Sharpness(image)
    sharpness = 2.0
    image = enh_sha.enhance(sharpness)
    
    
    return image
    
#Main Function
def main():
    cap = cv2.VideoCapture('C:\\Users\\Dragon\\Videos\\DemoVideos\\pothole.mp4')

    baseProb = 0.50
    width = 3680
    height = 960
    i = 0

    fps = 26

    frame_count = 5

    while(cap.isOpened()): 
        
        # Capture frame-by-frame 
        ret, frame = cap.read()
        if ret == True: 
            #resize_frame2 = cv2.resize(frame, (600, 600))
            #cv2.imshow('Original',  resize_frame2) 
            frame_count += 1
            
            if (frame_count % (fps) == 0):
                

                pil_im = Image.fromarray(frame)
                pil_im = pil_im.crop((0,0,1920,550))
                pil_im = enchance_image(pil_im)
                cv2_img = np.array(pil_im) 
                resize_frame = cv2.resize(cv2_img, (width, height))
                prob = my_display_prediction(resize_frame)
                if (prob >= baseProb):
                    
                    name="img" + str(i) + ".jpg"
                    
                    cv2.imwrite(name, frame, [cv2.IMWRITE_JPEG_QUALITY, 100])
                    i += 1
                    #resize_frame1 = cv2.resize(resize_frame, (600, 600))
                    #cv2.imshow('Detected',  resize_frame1)
                    
                    # Random Coordinates are being genereted and the detection is being reported on 
                    # to the ethereum network
                    
            cv2.waitKey(26)
            
            
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