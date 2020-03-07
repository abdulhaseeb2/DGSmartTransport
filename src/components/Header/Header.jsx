import React, { Component } from "react";
import "../../Main.css";
import HeaderContents from "./HeaderContents";

/*********************************************
Returns the Header component to be displayed and used
Header filters the list component to show only the relevant ones
*********************************************/
class Header extends Component {
  /*********************************************
  Header Contents: the buttons in the header and their labels
  Logo Mid: Flag that sets the position of logo in the middle
  Logo Right: Flag that sets the position of logo on the right
  Clicked: which button in the header has been clicked
  *********************************************/
  state = {
    headerContents: [],
    logoMid: true,
    logoRight: false,
    clicked: 0
  };
  /*********************************************
  Callback whenever state is changed
  *********************************************/
  componentDidUpdate(prevProps) {
    if (this.props.clicked !== prevProps.clicked) {
      this.props.onHeaderClick(this.props.clicked);
      return;
    }
  }
  componentDidMount() {
    this.setState({ headerContents: this.props.headerContents }, () =>
      console.log(this.state.headerContents)
    );
  }
  /*********************************************
  Method to render each item in the header
  *********************************************/
  renderHeaderContents = () => {
    let inputs = [];
    for (let i = 0; i < this.state.headerContents.length; ++i) {
      inputs.push(
        <HeaderContents
          key={i}
          name={this.state.headerContents[i]}
          onClick={() =>
            this.setState({ clicked: i }, () => console.log(this.state))
          }
        />
      );
    }
    return inputs;
  };

  /*********************************************
  Go back to main screen
  *********************************************/
  goBack = () => {
    if (this.props.goBack !== null) {
      this.props.goBack();
      console.log("called go back prop");
    }
  };

  /*********************************************
  Render the options menu
  *********************************************/
  onOptionsClick = () => {
    if (this.props.optionsClicked !== null) {
      this.props.optionsClicked();
    }
  };

  /*********************************************
  Render the help screen
  *********************************************/
  onHelpClick = () => {
    if (this.props.helpClicked !== null) this.props.helpClicked();
  };

  onAllClicked = () => {
    if (this.props.showAll !== null) this.props.showAll();
  };

  /*********************************************
  Render method, renders objects on screen
  *********************************************/
  render() {
    return (
      <React.Fragment>
        {this.state.headerContents.showAll ? (
          <button className="showAllButton" onClick={() => this.onAllClicked()}>
            Show All
          </button>
        ) : (
          <React.Fragment />
        )}
        {this.state.headerContents.mid ? (
          <React.Fragment>
            {this.state.headerContents.logo ? (
              <React.Fragment>
                <div className="logoMain">
                  <img
                    alt="logoInTheMiddle"
                    src={window.location.origin + "/images/logo.png"}
                  />
                </div>
                <div className="logoMainText">
                  <h1>POTLY</h1>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment />
            )}
            {/*      <div
              className="optionsButton"
              onClick={() => this.onOptionsClick()}
            >
              <img
                alt="optionsIcon"
                src={window.location.origin + "/images/user.png"}
              />
            </div>
            <div className="helpButton" onClick={() => this.onHelpClick()}>
              <img
                alt="helpIcon"
                src={window.location.origin + "/images/info.png"}
              />
            </div> */}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div
              className="backButton"
              onClick={() => {
                console.log("hello there");
                this.goBack();
              }}
            >
              <img
                alt="backButton"
                src={window.location.origin + "/images/back-thin.png"}
              />
            </div>

            <div className="titleOfPage">{this.props.headerContents.text}</div>
            {this.state.headerContents.logo ? (
              <React.Fragment>
                <div className="logoSide">
                  <img
                    alt="logoAtTheSide"
                    src={window.location.origin + "/images/logo.png"}
                  />
                </div>
                <div className="logoSideText">
                  <h1>POTLY</h1>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment />
            )}
          </React.Fragment>
        )}
        <div className="mainHeader">{this.renderHeaderContents()}</div>
      </React.Fragment>
    );
  }
}

export default Header;
