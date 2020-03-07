import { addr, abi } from "./config.js";
import Web3 from "web3";
import React, { Component } from "react";

class ReportDetails extends Component {
  state = {
    id: this.props.id,
    type: this.props.type,
    priority: this.props.priority,
    lat: this.props.lat,
    lng: this.props.lng,
    loc: this.props.loc,
    open: false,
    account: "",
    contract: ""
  };
  /*********************************************
    Toggle inner panel to be shown on click
    *********************************************/
  togglePanel = () => {
    this.setState({ open: !this.state.open });
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
    else if (this.state.priority === 0) return "Processing";
  };
  checkPriority = () => {
    if (this.state.priority === 5) return "severeSeverity";
    else if (this.state.priority === 4) return "highSeverity";
    else if (this.state.priority === 3) return "mediumSeverity";
    else if (this.state.priority === 2) return "lowSeverity";
    else if (this.state.priority === 1) return "insignificantSeverity";
    else if (this.state.priority === 0) return "processing";
    else return "closedHead";
  };

  componentDidMount() {
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = new Web3("http://localhost:7545");
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const contract1 = new web3.eth.Contract(abi, addr);
    this.setState({ contract: contract1 });
  }

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
  onUndoClick = e => {
    console.log("deleting");
    this.state.contract.methods
      .undoDelete(this.state.id)
      .send({ from: this.state.account, gas: 3000000 });
  };
  render() {
    return (
      <React.Fragment>
        <tr
          onClick={() => {
            this.togglePanel();
          }}
          //   className={this.checkPriority()}
          className="customTable"
        >
          <td className="report">{this.state.id}</td>
          <td className="report">{"Pothole"}</td>
          <td className="report">{this.state.loc}</td>
          <td className="report">{this.state.lat}</td>
          <td className="report">{this.state.lng}</td>
          <td className="report">{this.getPriority(this.state.priority)}</td>
        </tr>
        {this.state.open ? (
          <div
            className="customTableOpen"
            //className={this.checkPriorityChild()}
            onClick={e => {
              //this.updateData();
              //this.togglePanel(e);
            }}
          >
            <p>{"Priority: " + this.getPriority()}</p>
            <p>{"Latitude: " + this.state.lat}</p>
            <p>{"Longitude: " + this.state.lng}</p>
            <button className={"undoButton"} onClick={() => this.onUndoClick()}>
              Undo
            </button>
            {/*
             <MapContainer
              //data={crashes.concat(potholes)}
              markers={this.state}
            />
             */}
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default ReportDetails;
