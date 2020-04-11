import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import { useAuth0 } from "./react-auth0-spa";
import history from "./utils/history";
import NavBar from "./components/NavBar";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import ExternalApi from "./views/ExternalApi";
import VideoPlayer from "./views/VideoPlayer";

import "./App.css";

function App() {
  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Router history={history}>
        <NavBar />
        <Switch>
          <Route path="/" exact />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/external-api" component={ExternalApi} />
          <PrivateRoute path="/video" component={VideoPlayer} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
