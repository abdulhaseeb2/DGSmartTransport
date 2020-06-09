import React, { Component } from "react";
import { GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import CurrentLocation from "./Map.jsx";
import Fallback from "../Fallback";

/*********************************************
Container for the map component
*********************************************/
export class MapContainer extends Component {
  /*********************************************
  Showing Info Window: flag to show the info window
  Active Marker: array of all currently showing markers
  Selected Place: 
  Markers:
  Show All: flag to show all markers
  Data: data related to the marker 
  *********************************************/
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: [],
      selectedPlace: [],
      markers: this.props.markers,
      showAll: false,
      loaded: false
    };
  }

  /*********************************************
  Set state whenever a marker is clicked
  *********************************************/
  onMarkerClick = (props, marker, e) =>
    this.setState(
      {
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      },
      () => console.log("onMarkerClick called")
    );

  /*********************************************
  Close info window popup on marker
  *********************************************/
  onClose = () => {
    if (this.state.showingInfoWindow) {
      this.setState({ showingInfoWindow: false, activeMarker: null }, () =>
        console.log("onClose called")
      );
    }
  };

  /*********************************************
  Set a marker on the map
  *********************************************/
  setMarkers = () => {
    let inputs = [];
    let infoWindows = [];
    let tempMarker = [];
    for (let i = 0; i < this.state.markers.length; ++i) {
      tempMarker = this.state.markers[i];
      let icon = "";
      if (tempMarker.priority === 1)
        icon = window.location.origin + "/images/Marker/512x/marker-grey.png";
      if (tempMarker.priority === 2)
        icon = window.location.origin + "/images/Marker/512x/marker-green.png";
      if (tempMarker.priority === 3)
        icon = window.location.origin + "/images/Marker/512x/marker-blue.png";
      if (tempMarker.priority === 4)
        icon = window.location.origin + "/images/Marker/512x/marker-orange.png";
      if (tempMarker.priority === 5)
        icon = window.location.origin + "/images/Marker/512x/marker-red.png";
      console.log(icon);
      let iconDetails = {
        url: icon,
        scaledSize: new window.google.maps.Size(45, 45)
      };
      inputs.push(
        <Marker
          key={i}
          onClick={this.onMarkerClick}
          title={tempMarker.loc}
          position={{
            lat: parseFloat(tempMarker.lat),
            lng: parseFloat(tempMarker.lng)
          }}
          icon={iconDetails}
        />
      );
    }
    infoWindows.push(
      <InfoWindow
        marker={this.state.activeMarker}
        visible={this.state.showingInfoWindow}
        onClose={this.onClose}
      >
        <div>
          <p>{"Priority: " + tempMarker.priority}</p>
          <p>{"Latitude: " + tempMarker.lat}</p>
          <p>{"Longitude: " + tempMarker.lng}</p>
          <img
            className="image"
            src={
              "https://drive.google.com/uc?export=view&id=" + tempMarker.image
            }
            style={{ maxWidth: "55vh" }}
            alt={tempMarker.image}
          />
        </div>
      </InfoWindow>
    );
    return [inputs, infoWindows];
  };

  /*********************************************
  Method to show all markers  at once
  *********************************************/

  componentDidUpdate(prevProps) {
    if (this.props.loaded !== prevProps.loaded) {
      if (this.props.loaded) {
        this.setState({ loaded: !this.state.loaded }, () =>
          console.log(this.state.loaded)
        );
      }
    }
    if (this.props.showAll !== prevProps.showAll) {
      this.setState({ showAll: !this.state.showAll }, () =>
        console.log("show all flipped: " + this.state.showAll)
      );
    }
  }
  /*********************************************
  Render method, renders objects on screen
  *********************************************/
  render() {
    if (!this.props.loaded) {
      return <Fallback />;
    } else {
      return (
        <React.Fragment>
          <CurrentLocation
            centerAroundCurrentLocation
            google={this.props.google}
          >
            {console.log(this.state.markers)}
            {console.log("Map loaded")}
            {console.log("not show all wala return: " + this.state.showAll)}
            {this.setMarkers()}
          </CurrentLocation>
        </React.Fragment>
      );
    }
  }
}

/*********************************************
Export with Google maps API key
*********************************************/
export default GoogleApiWrapper({
  apiKey: ""
})(MapContainer);
