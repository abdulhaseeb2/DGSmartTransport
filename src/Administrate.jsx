import React, { Component } from "react";
import MapContainer from "./components/Map/MapContainer.jsx";
//import {  ToastsContainer,  ToastsStore,  ToastsContainerPosition} from "react-toasts";
import List from "./components/List";
import "./Main.css";
import { addr, abi } from "./config.js";
import Web3 from "web3";

/*********************************************
Functions to import all images in a folder
*********************************************/

/* 
function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context("./Images", false, /\.(png|jpe?g|svg)$/)
); 
*/

/*********************************************
Administrate class sends all objects to index to be rendered on screen
*********************************************/
class Administrate extends Component {
  /*********************************************
  List Amount: number of total potholes and other items in list for 
  Showing List: array of items to be forwarded to Map component to show markers
  Current Image: the image currently to be shown in the browser window
  *********************************************/

  constructor(props) {
    super(props);
    this.state = {
      showingList: [],
      tempShowingList: [],
      currentImage: "default",
      defaultImage: "default",
      account: "",
      contract: "",
      ethreport: [
        {
          id: "",
          type: "",
          URL: "",
          priority: 0,
          location: "",
          latitude: "",
          longitude: ""
        }
      ],
      unverified: [
        {
          id: "",
          type: "",
          URL: "",
          priority: 0,
          location: "",
          latitude: "",
          longitude: ""
        }
      ],
      no_reports: 0,
      loaded: false,
      showAll: false
    };
    this.loadBlockchainData();
  }

  componentDidMount() {
    this.loadBlockchainData();
  }
  /*****************************************************
  Method to get all the data from the Ethereum Network
  ****************************************************/
  async loadBlockchainData() {
    const web3 = new Web3("http://localhost:7545");
    const accounts = await web3.eth.getAccounts();
    const contract1 = new web3.eth.Contract(abi, addr);
    this.setState({ contract: contract1, account: accounts[0] });
    //console.log(this.state.account)
    //console.log(this.state.contract)
    this.seeData();
  }

  async seeData() {
    this.setState({
      no_reports: await this.state.contract.methods.damageCount().call()
    });
    var newArray = [];
    let unverifiedData = [];
    for (var i = 1; i <= this.state.no_reports; i++) {
      const asd = await this.state.contract.methods.getAllData(i).call();
      //sasta(?) fix for unverified potholes
      if (parseInt(asd[4]) == 0)
        unverifiedData.push({
          id: i,
          type: asd[0],
          URL: asd[1],
          priority: asd[4],
          location: "Islamabad",
          latitude: asd[2],
          longitude: asd[3]
        });
      else
        newArray.push({
          id: i,
          type: asd[0],
          URL: asd[1],
          priority: asd[4],
          location: "Islamabad",
          latitude: asd[2],
          longitude: asd[3]
        });
      //console.log(asd)
    }
    if (this.state.no_reports !== 0) {
      this.setState({ ethreport: newArray });
    }
    console.log(this.state.ethreport);
    if (!this.state.loaded) {
      this.setState({ loaded: !this.state.loaded }, () =>
        console.log("Blockchain data loaded")
      );
      //this.props.blockChainHasLoadedAdmin(this.state.loaded);
    }
    //this. rkers();
  }

  /*********************************************
  Method to render list of potholes
  *********************************************/

  renderList() {
    if (this.state.ethreport.length > 0) {
      let times = this.state.no_reports;
      let inputs = [];
      let sorted = this.state.ethreport;
      sorted.sort((a, b) => b.priority - a.priority);
      sorted.sort((a, b) => b.type - a.type);
      console.log(sorted);
      if (this.state.ethreport[0].id !== "") {
        for (let i = 0; i < times; ++i) {
          let data = this.state.ethreport[i];
          console.log(data);
          try {
            inputs.push(
              <List
                key={i}
                id={data.id}
                priority={parseInt(data.priority)}
                type={data.type}
                image={data.URL}
                loc={data.location}
                lat={data.latitude}
                lng={data.longitude}
                updateData={this.updateData}
                onFixedClick={this.onFixedClick}
              />
            );
          } catch (x) {
            console.log(x);
          }
        }
      } else {
        //this.loadBlockchainData();
      }
      return inputs;
    } else console.log("Ethreport was empty");
  }

  componentDidUpdate(prevProps) {
    if (this.props.showAll !== prevProps.showAll) {
      if (this.props.showAll) {
        this.setState(
          {
            tempShowingList: this.state.showingList,
            showingList: this.state.ethreport,
            showAll: !this.state.showAll
          },
          () => {
            console.log("showing all admin: " + this.state.showAll);
            console.log(this.state.showingList);
          }
        );
      } else {
        this.setState(
          {
            showingList: this.state.tempShowingList,
            showAll: !this.state.showAll
          },
          () => {
            console.log("showing all admin undo: " + this.state.showAll);
            console.log(this.state.showingList);
          }
        );
      }
    }
  }

  /*********************************************
  Show all markers by throwing them in the
  showingList object
  *********************************************/
  /*  
  showMarkers = () => {
    console.log(this.state.showingList);
    let newArr = this.state.showingList;
    console.log(newArr);
    let damages = this.state.ethreport;
    for (let i = 0; i < damages.length; ++i) {
      //console.log(damages[i]);
      newArr.push(damages[i]);
    }
    console.log(this.state.showingList);
    this.setState({ showingList: damages });
    console.log(this.state.showingList);
    console.log("Updated the list");
  };
 */
  /*********************************************
  Update showingList according to clicks on list
  *********************************************/

  updateData = e => {
    if (!this.state.showAll) {
      let newArr = this.state.showingList;
      let exists = false;
      for (let i = 0; i < newArr.length; ++i) {
        if (newArr[i].id === e.id) {
          console.log(e);
          console.log("found and delete");
          exists = true;
          newArr.splice(i, 1);
          this.setState({ currentImage: this.state.defaultImage }, () =>
            console.log(this.state.currentImage)
          );
          break;
        }
      }

      if (!exists) {
        newArr.push(e);
        this.setState({ currentImage: e.image }, () =>
          console.log(this.state.currentImage)
        );
        console.log(e);
        console.log("push");
      }
      this.setState({ showingList: newArr }, () => console.log(this.state));
    }
  };

  /*********************************************
  Handle fixed potholes and damages
  *********************************************/
  onFixedClick = e => {
    console.log("deleting");
    this.state.contract.methods
      .deleteDamage(e)
      .send({ from: this.state.account, gas: 3000000 });
  };

  /*********************************************
  Render method, renders objects on screen
  *********************************************/
  render() {
    return (
      <React.Fragment>
        <div className="listOfShit">{this.renderList()}</div>
        {/* <div className="imageLoading"> */}
        <React.Fragment>
          {this.state.currentImage === this.state.defaultImage ? (
            <img
              className="image"
              src={window.location.origin + "/images/sample-images/default.jpg"}
              alt="default"
            />
          ) : (
            <img
              className="image"
              src={
                "https://drive.google.com/uc?export=view&id=" +
                this.state.currentImage
              }
              alt={this.state.currentImage}
            />
          )}
        </React.Fragment>
        {/* </div> */}
        <MapContainer
          //data={crashes.concat(potholes)}
          markers={this.state.showingList}
          showAll={this.state.showAll}
        />
      </React.Fragment>
    );
    /*********************************************/
  }
}

export default Administrate;
