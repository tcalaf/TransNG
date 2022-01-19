import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import Dashboard from "./pages/Dashboard";
import NewTrip from "./pages/Carrier/NewTrip";
import NewShipment from "./pages/Client/NewShipment";
import Contact from "./pages/Contact";
import esriConfig from "@arcgis/core/config";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    esriConfig.apiKey = "AAPKc290ac9a96c243e089dd61a1de2fb903Kfv2i7bQ6JfQidhtMPSZ3mr9DhmHUqpRooce7giUssBi2XGGrId_yB0WslpPcAD7";
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
          <Route exact path="/ship/new" component={NewShipment} />
          <Route exact path="/contact" component={Contact} />
        </Switch>
      </Router>
    </div>
  );
}
export default App;