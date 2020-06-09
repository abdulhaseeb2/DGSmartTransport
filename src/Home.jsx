import React, { Component } from "react";
import "tabler-react/dist/Tabler.css";
import * as Tabler from "tabler-react";
import { addr, abi } from "./config.js";
import Web3 from "web3";

class Home extends Component {
  contructor(props) {
    this.state = {
      showingList: [],
      tempShowingList: [],
      currentImage: "default",
      defaultImage: "default",
      account: "",
      contract: "",
      ethreport: [
        {
          id: "",
          type: "",
          URL: "",
          priority: 0,
          location: "",
          latitude: "",
          longitude: "",
        },
      ],
      fixed: [
        {
          id: "",
          type: "",
          URL: "",
          priority: 0,
          location: "",
          latitude: "",
          longitude: "",
        },
      ],
      unverified: [
        {
          id: "",
          type: "",
          URL: "",
          priority: 0,
          location: "",
          latitude: "",
          longitude: "",
        },
      ],
      no_reports: 0,
      no_fixed: 0,
      no_unverified: 0,
      loaded: false,
      showAll: false,
    };
    this.loadBlockchainData();
  }
  componentDidMount() {
    this.loadBlockchainData();
  }
  /*****************************************************
  Method to get all the data from the Ethereum Network
  ****************************************************/
  async loadBlockchainData() {
    const web3 = new Web3("http://localhost:7545");
    const accounts = await web3.eth.getAccounts();
    const contract1 = new web3.eth.Contract(abi, addr);
    this.setState({ contract: contract1, account: accounts[0] });
    //console.log(this.state.account)
    //console.log(this.state.contract)
    this.seeData();
  }

  async seeData() {
    let unverified = 0;
    this.setState({
      no_reports: await this.state.contract.methods.damageCount().call(),
    });
    for (let i = 1; i <= this.state.no_reports; i++) {
      const asd = await this.state.contract.methods.getAllData(i).call();
      console.log(asd);
      if (parseInt(asd[4]) === 0) unverified = unverified + 1;
    }
    this.setState({
      no_reports: await this.state.contract.methods.getDamageCount().call(),
      no_fixed: await this.state.contract.methods.getDeleteCount().call(),
      no_unverified: unverified,
    }, () =>
    console.log("Khotta loaded"));
    if (!this.state.loaded) {
      this.setState({ loaded: !this.state.loaded }, () =>
        console.log("Blockchain data loaded")
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <figure>
          <img
            className="centerImage"
            alt="logoInTheMiddle"
            src={window.location.origin + "/images/logo.png"}
            style={{ maxWidth: "59vh" }}
          />
          <figcaption className="centerTitle">POTLY</figcaption>
        </figure>
        <div>
          <Tabler.StatsCard
            layout={2}
            movement={this.state === null ? 0 : (((this.state.no_reports - this.state.no_fixed - this.state.no_unverified)/this.state.no_reports)*-100).toFixed(2)}
            total={this.state === null ? 0 : this.state.no_reports - this.state.no_unverified}
            label="Pending"
            className="reportsStats"
          />

          <Tabler.StatsCard
            layout={2}
            movement={this.state === null ? 0 : ((this.state.no_fixed/this.state.no_reports)*100).toFixed(2)}
            total={this.state === null ? 0 : this.state.no_fixed}
            label="Fixed"
            className="fixedStats"
          />
          <Tabler.StatsCard
            layout={2}
            movement={this.state === null ? 0 : ((this.state.no_unverified/this.state.no_reports)*100).toFixed(2)}
            total={this.state === null ? 0 : this.state.no_unverified}
            label="Unverified"
            className="unverifiedStats"
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
