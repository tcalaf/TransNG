import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import Dashboard from "./pages/Dashboard";
import NewTrip from "./pages/Carrier/NewTrip";
import Contact from "./pages/Contact";
import esriConfig from "@arcgis/core/config";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    esriConfig.apiKey = "AAPK445b17b023f9440aa2213838c5521ee36GsXRZpxGdn8Kp4ccanvzmycWR08vmAxcQxqqwempljZ_jX4o95h-sxhKi96aAv3";
  }, [])

  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/reset" component={Reset} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/trip/new" component={NewTrip} />
          <Route exact path="/contact" component={Contact} />
        </Switch>
      </Router>
    </div>
  );
}
export default App;