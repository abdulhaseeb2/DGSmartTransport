## Road Damage Detection Model

The road damage detection model used in this project is based on the architecture mobilenet single shot detector. It has been implemented using the [tensorflow object detection api](https://github.com/tensorflow/models)

The model's weights are present in the finetuned folder. Pre-trained coco model was used as a base for training. The model was trained on [this dataset](https://www.kaggle.com/felipemuller5/nienaber-potholes-2-complex), combined with some examples we created and labelled ourselves. In total the datset was divided into 1697 training examples and 716 test examples.

## Run the model

In order to run the model, run the detection notebook using the command:

### python3 odt.py

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
