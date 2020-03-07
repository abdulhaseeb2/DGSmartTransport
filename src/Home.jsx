import React, { Component } from "react";
class Home extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <figure>
          <img
            className="centerImage"
            alt="logoInTheMiddle"
            src={window.location.origin + "/images/logo.png"}
          />
          <figcaption className="centerTitle">POTLY</figcaption>
        </figure>
      </React.Fragment>
    );
  }
}

export default Home;
