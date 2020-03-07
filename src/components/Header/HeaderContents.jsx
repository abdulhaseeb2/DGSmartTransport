import React, { Component } from "react";

/*********************************************
Differentiates each button on a header
*********************************************/
class HeaderContents extends Component {
  state = {};
  onHeaderClick = () => {};
  /*********************************************
  Render method, renders objects on screen
  *********************************************/
  render() {
    return (
      <React.Fragment>
        <div className="headerContents" onClick={this.onHeaderClick}>
          {this.props.name}
        </div>
      </React.Fragment>
    );
  }
}

export default HeaderContents;
