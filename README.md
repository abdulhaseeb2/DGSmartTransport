## Road Damage Detection Model

The road damage detection model used in this project is based on the architecture mobilenet single shot detector. It has been implemented using the [tensorflow object detection api](https://github.com/tensorflow/models)

The model's weights are present in the finetuned folder. Pre-trained coco model was used as a base for training. The model was trained on [this dataset](https://www.kaggle.com/felipemuller5/nienaber-potholes-2-complex), combined with some examples we created and labelled ourselves. In total the datset was divided into 1697 training examples and 716 test examples.

## Run the model

In order to run the model, run the detection notebook using the command:

### python3 odt.py

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs the node dependencies for the app.
Run this command before anything else.

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.
