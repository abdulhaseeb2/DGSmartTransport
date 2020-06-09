import { addr, abi } from "./config.js";
import Web3 from "web3";
import React, { Component } from "react";

class returnBlockChainData extends Component {
  constructor(props) {
    this.state = {
      ethreport: [
        {
          id: "",
          type: "",
          priority: "",
          location: "",
          latitude: "",
          longitude: "",
        },
      ],
      no_reports: 0,
    };
  }

  async loadBlockchainData() {
    const web3 = new Web3("http://localhost:7545");
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const contract1 = new web3.eth.Contract(abi, addr);
    this.setState({ contract: contract1 });
    this.seeData();
  }
  componentDidMount() {
    this.loadBlockchainData();
  }
  async seeData() {
    this.setState({
      no_reports: await this.state.contract.methods.getDamageCount().call(),
    });
    try {
      //console.log(this.state.contract.methods);
      this.state.no_reports = await this.state.contract.methods
        .getDamageCount()
        .call();
    } catch (e) {
      console.error(e.message);
      return;
    }
    var newArray = [];
    for (var i = 1; i <= this.state.no_reports; i++) {
      const asd = await this.state.contract.methods.getAllData(i).call();
      newArray.push({
        id: i,
        type: asd[0],
        location: "Islamabad",
        latitude: asd[2],
        longitude: asd[3],
        priority: asd[4],
      });
      //console.log(asd)
    }
    console.log(newArray);
    if (this.state.no_reports !== 0) {
      this.setState({ ethreport: newArray });
    }
  }
}

export default returnBlockChainData;
