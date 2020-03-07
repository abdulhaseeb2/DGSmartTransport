import React from "react";
import ReactDOM from "react-dom";
import { style1, AC4Style, modest, wy, UB } from "./MapStyles.js";

/*********************************************
 Style sheet for the map component
 *********************************************/
const mapStyles = {
  map: {
    position: "absolute",
    width: "79%",
    height: "93%",
    left: "20%",
    top: "3.5rem"
  }
};

/*********************************************
Loads the map and sets its default location to the user location
*********************************************/
export class CurrentLocation extends React.Component {
  constructor(props) {
    super(props);
    const { lat, lng } = this.props.initialCenter;
    /*********************************************
    Current Location: the initial location of the map
    *********************************************/
    this.state = {
      currentLocation: { lat: lat, lng: lng }
    };
  }

  /*********************************************
  Centers map according to user location
  *********************************************/
  recenterMap() {
    const map = this.map;
    const current = this.state.currentLocation;
    const google = this.props.google;
    const maps = google.maps;
    if (map) {
      let center = new maps.LatLng(current.lat, current.lng);
      map.panTo(center);
    }
  }

  /*********************************************
  Method to load the map on the screen
  *********************************************/
  loadMap() {
    if (this.props && this.props.google) {
      const { google } = this.props;
      const maps = google.maps;
      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);
      let { zoom } = this.props;
      const { lat, lng } = this.state.currentLocation;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign(
        {},
        { center: center, zoom: zoom, styles: UB }
      );
      this.map = new maps.Map(node, mapConfig);
    }
  }

  /*********************************************
  Render the map component
  *********************************************/
  renderChildren() {
    const { children } = this.props;
    if (!children) return;
    return React.Children.map(children, c => {
      if (!c) return;
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation
      });
    });
  }

  /*********************************************
  Callback as soon as the component loads
  *********************************************/
  componentDidMount() {
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const coords = pos.coords;
          this.setState({
            currentLocation: { lat: coords.latitude, lng: coords.longitude }
          });
        });
      }
      this.loadMap();
    }
  }

  /*********************************************
  Callback whenever state is changed
  *********************************************/
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap();
    }
  }

  /*********************************************
  Render method, renders objects on screen
  *********************************************/
  render() {
    const style = Object.assign({}, mapStyles.map);
    return (
      <React.Fragment>
        <div style={style} ref="map">
          Loading map...
        </div>
        {this.renderChildren()}
      </React.Fragment>
    );
  }
}

export default CurrentLocation;
/*********************************************
Default values of the map component
*********************************************/
CurrentLocation.defaultProps = {
  zoom: 11,
  initialCenter: {
    lat: 33.622,
    lng: 73.117
  },
  centerAroundCurrentLocation: false,
  visible: true
};
