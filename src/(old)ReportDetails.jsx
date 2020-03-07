import React, { Component } from "react";
class ReportDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { reportData: this.props.reportData };
  }
  getPriority = () => {
    if (this.state.reportData.priority === 5) return "Severe";
    else if (this.state.reportData.priority === 4) return "High";
    else if (this.state.reportData.priority === 3) return "Medium";
    else if (this.state.reportData.priority === 2) return "Low";
    else if (this.state.reportData.priority === 1) return "Insignificant";
  };
  render() {
    return (
      <React.Fragment>
        <div className="reportDetails">
          {"ID:\t\t\t\t\t\t\t\t\t\t\t\t\t" + this.state.reportData.id}
          {"\n\nDamage Type:\t\t\t\t\t\t\t\t\t\t\t" +
            this.state.reportData.type}
          {"\n\nPriority:\t\t\t\t\t\t\t\t\t\t\t\t" + this.getPriority()}
          {"\n\nLocation:\t\t\t\t\t\t\t\t\t\t\t\t" +
            this.state.reportData.location}
          {"\n\nLatitude:\t\t\t\t\t\t\t\t\t\t\t\t" +
            this.state.reportData.latitude}
          {"\n\nLongitude:\t\t\t\t\t\t\t\t\t\t\t" +
            this.state.reportData.longitude}
        </div>
      </React.Fragment>
    );
  }
}

export default ReportDetails;
