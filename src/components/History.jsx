import React, { Component } from "react";
import "../Main.css";
//import potholes from "./Data/potholes.json";
import { addr, abi } from "../config.js";
import Web3 from "web3";
import Fallback from "./Fallback";
import HistoryDetails from "../HistoryDetails";
class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      expanded: false,
      account: "",
      contract: "",
      ethreport: [
        {
          id: "",
          type: "",
          priority: "",
          location: "",
          latitude: "",
          longitude: "",
          date: "",
        },
      ],
      ethreportCopy: [
        {
          id: "",
          type: "",
          priority: "",
          location: "",
          latitude: "",
          longitude: "",
          date: "",
        },
      ],
      no_reports: 0,
      sorting: [
        {
          currentSort: 1,
          id: true,
          type: false,
          priority: false,
          location: false,
          latitude: false,
          longitude: false,
          date: false,
        },
      ],
    };
  }
  renderTableHeader() {
    let header = Object.keys(this.state.ethreport[0]);
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  }

  componentDidMount() {
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = new Web3("http://localhost:7545");
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const contract1 = new web3.eth.Contract(abi, addr);
    this.setState({ contract: contract1 });
    this.seeData();
  }

  async seeData() {
    this.setState({
      no_reports: await this.state.contract.methods.getDeleteCount().call(),
    });
    try {
      //console.log(this.state.contract.methods);
      this.state.no_reports = await this.state.contract.methods
        .getDeleteCount()
        .call();
    } catch (e) {
      console.error(e.message);
      return;
    }
    var newArray = [];
    for (var i = 1; i <= this.state.no_reports; i++) {
      const delData = await this.state.contract.methods.getDeleteData(i).call();
      newArray.push({
        id: i,
        type: delData[0],
        location: "Islamabad",
        latitude: delData[2],
        longitude: delData[3],
        priority: delData[4],
        date: delData[5],
      });
    }
    console.log(newArray);
    if (this.state.no_reports !== 0) {
      this.setState({ ethreport: newArray, ethreportCopy: newArray });
    }
  }
  onReportClick = (id) => {
    console.log("Clicked: " + id);
    this.setState({ expanded: !this.state.expanded });
  };
  sortData = (method) => {
    let sorted = this.state.ethreport;
    if (method === 1) sorted.sort((a, b) => a.priority - b.priority);
    if (method === 2) sorted.sort((a, b) => b.priority - a.priority);
    if (method === 3) sorted.sort((a, b) => a.type - b.type);
    if (method === 4) sorted.sort((a, b) => b.type - a.type);
    if (method === 5) sorted.sort((a, b) => a.id - b.id);
    if (method === 6) sorted.sort((a, b) => b.id - a.id);
    if (method === 7) sorted.sort((a, b) => a.location - b.location);
    if (method === 8) sorted.sort((a, b) => b.location - a.location);
    if (method === 9) sorted.sort((a, b) => a.latitude - b.latitude);
    if (method === 10) sorted.sort((a, b) => b.latitude - a.latitude);
    if (method === 11) sorted.sort((a, b) => a.longitude - b.longitude);
    if (method === 12) sorted.sort((a, b) => b.longitude - a.longitude);
    if (method === 13) sorted.sort((a, b) => a.date - b.date);
    if (method === 14) sorted.sort((a, b) => b.date - a.date);
  };
  sortFunction = (sort) => {
    let sorted = this.state.ethreport;
    if (sort === 1) {
      if (this.state.sorting.priority)
        sorted.sort((a, b) => a.priority - b.priority);
      else sorted.sort((a, b) => b.priority - a.priority);
    } else if (sort === 2) {
      if (this.state.sorting.type) sorted.sort((a, b) => a.type - b.type);
      else sorted.sort((a, b) => b.type - a.type);
    } else if (sort === 3) {
      if (this.state.sorting.id) sorted.sort((a, b) => a.id - b.id);
      else sorted.sort((a, b) => b.id - a.id);
    } else if (sort === 4) {
      if (this.state.sorting.location)
        sorted.sort((a, b) => a.location - b.location);
      else sorted.sort((a, b) => b.location - a.location);
    } else if (sort === 5) {
      if (this.state.sorting.latitude)
        sorted.sort((a, b) => a.latitude - b.latitude);
      else sorted.sort((a, b) => b.latitude - a.latitude);
    } else if (sort === 6) {
      if (this.state.sorting.longitude)
        sorted.sort((a, b) => a.longitude - b.longitude);
      else sorted.sort((a, b) => b.longitude - a.longitude);
    } else if (sort === 7) {
      if (this.state.sorting.date) sorted.sort((a, b) => a.date - b.date);
      else sorted.sort((a, b) => b.date - a.date);
    }
    console.log(sorted);
    //this.setState({ ethreport: sorted });
    return sorted;
  };
  sortPriority = () => {
    let sorts = this.state.sorting;
    sorts.priority = !sorts.priority;
    sorts.currentSort = 1;
    this.setState({ sorting: sorts }, () => console.log(this.state.sorting));
    this.sortFunction(1);
  };
  sortType = () => {
    let sorts = this.state.sorting;
    sorts.type = !sorts.type;
    sorts.currentSort = 2;
    this.setState({ sorting: sorts }, () => console.log(this.state.sorting));
    //this.sortFunction(2);
  };
  sortID = () => {
    let sorts = this.state.sorting;
    sorts.id = !sorts.id;
    sorts.currentSort = 3;
    this.setState({ sorting: sorts }, () => console.log(this.state.sorting));
    //this.sortFunction(3);
  };
  sortLocation = () => {
    let sorts = this.state.sorting;
    sorts.location = !sorts.location;
    sorts.currentSort = 4;
    this.setState({ sorting: sorts }, () => console.log(this.state.sorting));
    //this.sortFunction(4);
  };
  sortLatitude = () => {
    let sorts = this.state.sorting;
    sorts.latitude = !sorts.latitude;
    sorts.currentSort = 5;
    this.setState({ sorting: sorts }, () => console.log(this.state.sorting));
    //this.sortFunction(5);
  };
  sortLongitude = () => {
    let sorts = this.state.sorting;
    sorts.longitude = !sorts.longitude;
    sorts.currentSort = 6;
    this.setState({ sorting: sorts }, () => console.log(this.state.sorting));
    //this.sortFunction(6);
  };
  sortDate = () => {
    let sorts = this.state.sorting;
    sorts.date = !sorts.date;
    sorts.currentSort = 7;
    this.setState({ sorting: sorts }, () => console.log(this.state.sorting));
    //this.sortFunction(7);
  };

  getImage = (id) => {
    //yehan kaam kr k string return kri
    //choices are: video-camera,twitter,smartphone

    return "video-camera";
  };

  renderList = () => {
    if (this.state.ethreportCopy.length > 0) {
      //console.log(this.state.ethreport[0]);
      let times = this.state.no_reports;
      let inputs = [];
      let sorted = this.sortFunction(this.state.sorting.currentSort);
      //sorted.sort((a, b) => b.priority - a.priority);
      //sorted.sort((a, b) => b.type - a.type);
      if (this.state.ethreportCopy[0].id !== "") {
        //console.log(this.state.ethreport);
        //console.log(times);
        for (let i = 0; i < times; ++i) {
          let data = sorted[i];
          let imageLoc = this.getImage(data.id);
          inputs.push(
            <HistoryDetails
              key={i}
              id={data.id}
              priority={parseInt(data.priority)}
              type={data.type}
              imageLoc={imageLoc}
              loc={data.location}
              lat={data.latitude}
              lng={data.longitude}
              date={data.date}
            />
          );
        }
        console.log(inputs);
      } else {
        console.log("some error");
        //this.loadBlockchainData();
      }
      return inputs;
    } else console.log("Ethreport was empty");
  };
  /* 
  renderTable = () => {
    return this.state.ethreport.map((ethreport, index) => {
      const {
        id,
        type,
        priority,
        location,
        latitude,
        longitude,
        date
      } = ethreport; //destructuring
      return (
        <tr key={id} onClick={() => this.onReportClick(ethreport)}>
          <td>{id}</td>
          <td>{type}</td>
          <td>{location}</td>
          <td>{latitude}</td>
          <td>{longitude}</td>
          <td>{priority}</td>
          <td>{date}</td>
        </tr>
      );
    });
  };
   */
  getPriority = () => {
    if (this.state.ethreport.priority === 5) return "Severe";
    else if (this.state.ethreport.priority === 4) return "High";
    else if (this.state.ethreport.priority === 3) return "Medium";
    else if (this.state.ethreport.priority === 2) return "Low";
    else if (this.state.ethreport.priority === 1) return "Insignificant";
    else return "Not Verified";
  };
  reportDetails = () => {
    return (
      <React.Fragment>
        <div className="DeleteDetails">
          {"ID:\t\t\t\t\t\t\t\t\t\t\t\t\t" + this.state.ethreport.id}
          {"\n\nDamage Type:\t\t\t\t\t\t\t\t\t\t\t" + this.state.ethreport.type}
          {"\n\nPriority:\t\t\t\t\t\t\t\t\t\t\t\t" + this.getPriority()}
          {"\n\nLocation:\t\t\t\t\t\t\t\t\t\t\t\t" +
            this.state.ethreport.location}
          {"\n\nLatitude:\t\t\t\t\t\t\t\t\t\t\t\t" +
            this.state.ethreport.latitude}
          {"\n\nLongitude:\t\t\t\t\t\t\t\t\t\t\t" +
            this.state.ethreport.longitude}
        </div>
      </React.Fragment>
    );
  };
  clearTable = () => {
    console.log("clear called");
    let khaali = [
      {
        id: "",
        type: "",
        priority: "",
        location: "",
        latitude: "",
        longitude: "",
        date: "",
      },
    ];
    this.setState({ ethreportCopy: khaali }, () =>
      console.log(this.state.ethreportCopy)
    );
    console.log(this.state.ethreport);
  };
  populateTable = () => {
    this.setState({ ethreportCopy: this.state.ethreport }, () =>
      console.log(this.state.ethreportCopy)
    );
  };
  render() {
    if (this.state.hasError) return <Fallback />;
    return (
      <React.Fragment>
        {/* <button onClick={() => this.clearTable()}>clear</button> */}
        <thead>
          <tr>
            <th
              className="col1History"
              onClick={() => {
                console.log("ID called");
                this.clearTable();
                this.sortID();
                this.populateTable();
              }}
            >
              ID
            </th>
            <th
              className="col2History"
              onClick={() => {
                console.log("Type called");
                this.sortType();
              }}
            >
              Type
            </th>
            <th
              className="col3History"
              onClick={() => {
                console.log("Location called");
                this.sortLocation();
              }}
            >
              Location
            </th>
            <th
              className="col4History"
              onClick={() => {
                console.log("Latitude called");
                this.sortLatitude();
              }}
            >
              Latitude
            </th>
            <th
              className="col5History"
              onClick={() => {
                console.log("LatiLongitudetude called");
                this.sortLongitude();
              }}
            >
              Longitude
            </th>
            <th
              className="col6History"
              onClick={() => {
                console.log("Priority called");
                this.sortPriority();
              }}
            >
              Priority
            </th>
            <th
              className="col7History"
              onClick={() => {
                console.log("Date called");
                this.sortDate();
              }}
            >
              Date
            </th>
          </tr>
        </thead>
        <div className="customTableContainer">{this.renderList()}</div>
        {/*   
        <div className="reportMain">
          <table className="reports">
            <tbody>
              <tr>{this.renderTableHeader()}</tr>
              {this.renderTable()}
            </tbody>
          </table>
        </div>
       */}
      </React.Fragment>
    );
  }
}

export default History;
