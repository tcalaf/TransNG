import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import Dashboard from "./pages/Dashboard";
import Contracts from "./pages/Contracts";
import NewTrip from "./pages/Carrier/NewTrip";
import NewShipment from "./pages/Client/NewShipment";
import ChooseOffer from "./pages/Client/ChooseOffer";
import CarrierTrucks from "./pages/Carrier/CarrierTrucks";
import Contact from "./pages/Contact";
import esriConfig from "@arcgis/core/config";
import { useEffect } from "react";
import ViewDemands from "./pages/Carrier/ViewDemands";

function App() {

  useEffect(() => {
    esriConfig.apiKey = "AAPK0673926dc6f84480bd2d4ff14c5d9181HRAtsleTjkHDX3ogX6WYQQSvoMFvy9HK27BY6x9364PtO-jopfohGm27L6CxCYBW";
  }, [])


  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/reset" component={Reset} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/offer/new" component={NewTrip} />
          <Route exact path="/ship/new" component={NewShipment} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/choosedemand" component={ViewDemands} />
          <Route exact path="/contracts" component={Contracts} />
          <Route exact path="/chooseoffer" component={ChooseOffer} />
          <Route exact path="/trucks" component={CarrierTrucks} />
        </Switch>
      </Router>
    </div>
  );
}
export default App;