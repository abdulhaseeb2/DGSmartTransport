//import { Redirect } from "react-router-dom";
import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Fallback from "./components/Fallback";

const Options = React.lazy(() => import("./components/HCI shit/Options.jsx"));
const Help = React.lazy(() => import("./components/HCI shit/Help.jsx"));
const Header = React.lazy(() => import("./components/Header/Header.jsx"));

const Report = React.lazy(() => import("./Report.jsx"));
const Administrate = React.lazy(() => import("./Administrate.jsx"));
const ReportDetails = React.lazy(() =>
  import("./(old)ReportDetails.jsx/index.js")
);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      home: true,
      adminClicked: false,
      reportClicked: false,
      helpClicked: false,

      optionsClicked: false,
      reportDetailsClicked: false,
      showAll: false,
      blockChainHasLoadedAdmin: false,
      blockChainHasLoadedReport: false,
      adminLoading: null,
      reportData: null
    };
  }
  onAdminClick = () => {
    if (this.state.reportClicked)
      this.setState({ reportClicked: !this.state.reportClicked }, () =>
        console.log(this.state)
      );
    this.setState(
      {
        adminClicked: !this.state.adminClicked,
        home: !this.state.home
      },
      () => console.log(this.state)
    );
  };

  onReportClick = () => {
    if (this.state.adminClicked)
      this.setState({ adminClicked: !this.state.adminClicked }, () =>
        console.log(this.state)
      );
    this.setState(
      {
        reportClicked: !this.state.reportClicked,
        home: !this.state.home
      },
      () => console.log(this.state)
    );
  };

  /**/

  onHelpClicked = () => {
    if (this.state.helpClicked)
      return (
        <React.Fragment>
          <Header
            goBack={this.goBack}
            options={null}
            showAll={null}
            help={this.renderHelp}
            headerContents={{ logo: true, mid: false, text: "HELP" }}
          />
        </React.Fragment>
      );
  };
  onOptionsClicked = () => {
    if (this.state.helpClicked)
      return (
        <React.Fragment>
          <Header
            goBack={this.goBack}
            options={this.renderOptions}
            showAll={null}
            help={null}
            headerContents={{ logo: true, mid: false, text: "OPTIONS" }}
          />
        </React.Fragment>
      );
  };
  /**/

  renderAdmin = () => {
    if (this.state.adminClicked) {
      console.log("i am admin");
      if (this.state.adminLoading === null) {
        let toaster = toast("Loading list...", {
          position: "bottom-right",
          autoClose: false,
          hideProgressBar: true
        });
        this.setState({ adminLoading: toaster }, () =>
          console.log(this.state.adminLoading)
        );
      }
      return (
        <React.Suspense fallback={<Fallback />}>
          <Header
            goBack={this.goBack}
            optionsClicked={null}
            helpClicked={null}
            showAll={this.showAll}
            headerContents={{
              logo: true,
              showAll: true,
              mid: false,
              text: "ADMINISTRATION"
            }}
          />
          <Administrate
            showAll={this.state.showAll}
            blockChainHasLoadedAdmin={this.blockChainHasLoadedAdmin}
          />
        </React.Suspense>
      );
    }
  };

  blockChainHasLoadedAdmin = loaded => {
    if (loaded) {
      this.setState({ blockChainHasLoadedAdmin: true }, () =>
        console.log("Blockchain data loaded in admin")
      );
      if (this.state.blockChainHasLoadedAdmin)
        toast.dismiss(this.state.adminLoading);
    }
  };

  blockChainHasLoadedReport = loaded => {
    if (loaded === true)
      this.setState({ blockChainHasLoadedReport: true }, () =>
        console.log(this.state.blockChainHasLoadedReport)
      );
  };

  renderReport = () => {
    if (this.state.reportClicked) {
      console.log("i am report");
      return (
        <React.Suspense fallback={<Fallback />}>
          <Header
            goBack={this.goBack}
            optionsClicked={null}
            helpClicked={null}
            showAll={null}
            headerContents={{ logo: true, mid: false, text: "REPORTS" }}
          />
          <Report reportDetailsClicked={this.reportDetailsClicked} />
        </React.Suspense>
      );
    }
  };
  reportDetailsClicked = e => {
    this.setState(
      {
        reportData: e,
        home: false,
        adminClicked: false,
        reportClicked: false,
        helpClicked: false,
        optionsClicked: false,
        reportDetailsClicked: true
      },
      () => console.log("report details clicked")
    );
  };
  renderReportDetails = e => {
    if (this.state.reportDetailsClicked) {
      console.log("i am report details");
      return (
        <React.Suspense fallback={<Fallback />}>
          <Header
            goBack={this.goBack}
            optionsClicked={null}
            helpClicked={null}
            showAll={null}
            headerContents={{ logo: true, mid: false, text: "DETAILS" }}
          />
          <ReportDetails reportData={e} />
        </React.Suspense>
      );
    }
  };
  helpClicked = () => {
    this.setState({
      home: false,
      adminClicked: false,
      reportClicked: false,
      helpClicked: true,
      optionsClicked: false
    });
  };

  renderHelp = () => {
    if (this.state.helpClicked) {
      console.log("i am help");
      toast("Welcome to help", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true
      });
      return (
        <React.Suspense fallback={<Fallback />}>
          <Header
            goBack={this.goBack}
            optionsClicked={null}
            showAll={null}
            helpClicked={null}
            headerContents={{ logo: true, mid: false, text: "HELP" }}
          />
          <Help />
        </React.Suspense>
      );
    }
  };

  optionsClicked = () => {
    this.setState({
      home: false,
      adminClicked: false,
      reportClicked: false,
      helpClicked: false,
      optionsClicked: true
    });
  };

  renderOptions = () => {
    if (this.state.optionsClicked) {
      console.log("i am options");
      return (
        <React.Suspense fallback={<Fallback />}>
          <Header
            goBack={this.goBack}
            optionsClicked={null}
            showAll={null}
            helpClicked={null}
            headerContents={{ logo: true, mid: false, text: "ACCOUNT" }}
          />
          <Options />
        </React.Suspense>
      );
    }
  };

  goBack = () => {
    if (this.state.reportDetailsClicked)
      this.setState({
        home: false,
        adminClicked: false,
        reportClicked: true,
        helpClicked: false,
        optionsClicked: false,
        reportDetailsClicked: false,
        adminLoading: null
      });
    else
      this.setState({
        home: true,
        adminClicked: false,
        reportClicked: false,
        helpClicked: false,
        optionsClicked: false,
        reportDetailsClicked: false,
        adminLoading: null
      });
    toast.dismiss();
    console.log(this.state);
  };

  showAll = () => {
    this.setState({ showAll: !this.state.showAll }, () =>
      console.log("Show all clicked tonight: " + this.state.showAll)
    );
    if (!this.state.showAll) {
      toast("Showing all...", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false
      });
    } else {
      toast("Resetting all..", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false
      });
    }
  };
  renderHome = () => {
    if (this.state.home) {
      console.log("i am home");
      return (
        <React.Suspense fallback={<Fallback />}>
          <Header
            goBack={null}
            optionsClicked={this.optionsClicked}
            showAll={null}
            helpClicked={this.helpClicked}
            headerContents={{ logo: true, mid: true, text: "" }}
          />
          <div className="welcome">
            <p>Welcome to Potly</p>
            <p>Start by choosing one of the options below</p>
          </div>
          <div className="adminButton" onClick={this.onAdminClick}>
            <img
              className="menuImage"
              alt="admin"
              src={window.location.origin + "/images/admin.jpg"}
            />
            <div className="middle">
              {/* <div className="menuText">Administrate</div> */}
            </div>
            <div className="menuText">Administrate</div>
          </div>
          <div className="reportButton" onClick={this.onReportClick}>
            <img
              className="menuImage"
              alt="report"
              src={window.location.origin + "/images/report.jpg"}
            />
            <div className="middle">
              {/* <div className="menuText">Reports</div> */}
            </div>
            <div className="menuText">Reports</div>
          </div>
        </React.Suspense>
      );
    }
  };
  render() {
    return (
      <React.Fragment>
        <ToastContainer className="toastContainer" />
        {this.renderHome()}
        {this.renderHelp()}
        {this.renderAdmin()}
        {this.renderReport()}
        {this.renderOptions()}
        {this.renderReportDetails(this.state.reportData)}
      </React.Fragment>
    );
  }
}

export default Home;
