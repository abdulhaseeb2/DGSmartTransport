import React, { Component } from "react";
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import { RoutedTabs, NavTab } from "react-router-tabs";

//import Home from "./Home.jsx";
import "./Main.css";

import Fallback from "./components/Fallback";
import Home from "./Home.jsx";
import Administrate from "./Administrate.jsx";
import Report from "./Report.jsx";
import Options from "./components/HCI shit/Options.jsx";
import History from "./components/History";
import Help from "./components/HCI shit/Help.jsx";

//const Header = React.lazy(() => import("./components/Header/Header.jsx"));
// const Options = React.lazy(() => import("./components/HCI shit/Options.jsx"));
// const Help = React.lazy(() => import("./components/HCI shit/Help.jsx"));
// const Report = React.lazy(() => import("./Report.jsx"));
// const Administrate = React.lazy(() => import("./Administrate.jsx"));
// const Home = React.lazy(() => import("./Home.jsx"));
class App extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <Router>
          <React.Suspense fallback={<Fallback />}>
            <NavTab to="/home">Home</NavTab>
            <NavTab to="/admin">Administrate</NavTab>
            <NavTab to="/report">Report</NavTab>
            <NavTab to="/history">History</NavTab>
            {/* <NavTab to="/options">Options</NavTab> */}
            {/* <NavTab to="/help">Help</NavTab> */}
            <Switch>
              <Route path={"/"} exact component={Fallback} />
              <Route path={"/home"} component={Home} />
              <Route path={"/admin"} component={Administrate} />
              <Route path={"/report"} component={Report} />
              <Route path={"/history"} component={History} />
              <Route path={"/options"} component={Options} />
              <Route path={"/help"} component={Help} />
              <Route component={Fallback} />
            </Switch>
          </React.Suspense>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
