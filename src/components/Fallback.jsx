import React, { Component } from "react";
import "../Main.css";
class Fallback extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <div className="fallback">{"(Fallback) "}Loading...</div>
      </React.Fragment>
    );
  }
}

export default Fallback;
