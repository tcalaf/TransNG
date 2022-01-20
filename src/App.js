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
    esriConfig.apiKey = "AAPKa1126a14067c47a9b6a2bfb5fd1526dc11PbQkndHxs2Rwe1LeT6CS9R58T6ouCVxSAZ1hLrzbfsqf264SGC-NDvMt3XBVUZ";
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