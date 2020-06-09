/**Child of Administrate component
 *
 */

import React, { Component } from "react";
import "../Main.css";

/*********************************************
List class returns a single component showing details of a single pothole or other item
*********************************************/
class List extends Component {
  /*********************************************
  ID: unique identifier for each component in the list 
  Image: the filename for the image associated with the component
  Type: classifies the type of component (pothole, crash etc)
  Priority: the priority of the component
  Lat: Latitude
  Lng: Longitude
  Open: check showing whether request has been completed or not 
  *********************************************/
  state = {
    id: this.props.id,
    image: this.props.image,
    type: this.props.type,
    priority: this.props.priority,
    img1: this.props.img1,
    img2: this.props.img2,
    lat: this.props.lat,
    lng: this.props.lng,
    loc: this.props.loc,
    open: false,
  };
  /*********************************************
  Update showingList according to clicks on list
  *********************************************/
  updateData = () => {
    this.props.updateData(this.state);
  };
  /*********************************************
  Toggle inner panel to be shown on click
  *********************************************/
  togglePanel = () => {
    this.setState({ open: !this.state.open });
  };
  /*********************************************
  check priority of the list component
  *********************************************/
  checkPriority = () => {
    if (this.state.priority === 5) return "severeSeverity";
    else if (this.state.priority === 4) return "highSeverity";
    else if (this.state.priority === 3) return "mediumSeverity";
    else if (this.state.priority === 2) return "lowSeverity";
    else if (this.state.priority === 1) return "insignificantSeverity";
    else if (this.state.priority === 0) return "processing";
    else return "closedHead";
  };
  /*********************************************
  check priority of the list component
  *********************************************/
  checkPriorityChild = () => {
    if (this.state.priority === 5) return "severeSeverityChild";
    else if (this.state.priority === 4) return "highSeverityChild";
    else if (this.state.priority === 3) return "mediumSeverityChild";
    else if (this.state.priority === 2) return "lowSeverityChild";
    else if (this.state.priority === 1) return "insignificantSeverityChild";
    else if (this.state.priority === 0) return "processing";
    else return "openContent";
  };
  /*********************************************
  return priority in readable form 
  *********************************************/
  getPriority = () => {
    if (this.state.priority === 5) return "Severe";
    else if (this.state.priority === 4) return "High";
    else if (this.state.priority === 3) return "Medium";
    else if (this.state.priority === 2) return "Low";
    else if (this.state.priority === 1) return "Insignificant";
    else if (this.state.priority === 0) return "processing";
  };
  /*********************************************
  Method to handle the fixed button click event
  *********************************************/
  onFixedClick = () => {
    if (
      window.confirm(
        "Are you sure you wish to mark this item as fixed? It will be removed from this page."
      )
    )
      this.props.onFixedClick(Number(this.state.id));
  };
  /*********************************************
  Render method, renders objects on screen
  *********************************************/
  render() {
    return (
      <div>
        <div
          onClick={() => {
            this.updateData();
            this.togglePanel();
          }}
          className={this.checkPriority()}
        >
          <span>
            <p style={{ justifyContent: "center" }}>
              {"Pothole" + " at " + this.state.loc}
            </p>
          </span>
        </div>
        {this.state.open ? (
          <div
            className={this.checkPriorityChild()}
            onClick={(e) => {
              //this.updateData();
              //this.togglePanel(e);
            }}
          >
            {this.state.img1 === 1 ? 
            (
            <img
              alt="camera"
              style={{ paddingLeft: "10vh" }}
              src={
                window.location.origin +
                "/images/video-camera.png"
              }
            />):(<div></div>)
  }
  {this.state.img2 === 1 ? 
            (
            <img
              alt="smartphone"
              style={{ paddingLeft: "0vh" }}
              src={
                window.location.origin +
                "/images/smartphone.png"
              }
            />):(<div></div>)
  }
            <p>{"Priority: " + this.getPriority()}</p>
            <p>{"Latitude: " + this.state.lat}</p>
            <p>{"Longitude: " + this.state.lng}</p>
            <button
              className={"fixedButton" + this.getPriority()}
              onClick={() => this.onFixedClick()}
            >
              Fixed
            </button>
          </div>
        ) : null}
      </div>
    );
  }
  /*********************************************/
}

export default List;
