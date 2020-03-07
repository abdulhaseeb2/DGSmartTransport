import React, { Component } from "react";
import "../../Main.css";
class Options extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <img
          className="aliNasir"
          alt="aliNasir"
          src={window.location.origin + "/images/ali-nasir.jpg"}
        />
        <div className="optionsDetails">
          <div className="options">
            <p>CNIC: </p>
            <p>Name: </p>
            <p>Address: </p>
            <p>Email: </p>
            <p>Password: </p>
          </div>
          <div className="values">
            <p>01234-5678901-2 </p>
            <p>Ali Nasir</p>
            <p>lorem ipsum dolors</p>
            <p>ali.nasir@nu.edu.pk</p>
            <p>************</p>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Options;
