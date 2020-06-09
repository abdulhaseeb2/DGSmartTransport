import React, { Component } from "react";
import "../Main.css";
import { Error404Page } from "tabler-react";
class Fallback extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        {/* <div className="fallback">{"(Fallback) "}Loading...</div> */}
        <Error404Page />
      </React.Fragment>
    );
  }
}

export default Fallback;
