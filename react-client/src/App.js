import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Login} from './pages/Login';
import {Authenticate} from './pages/Authenticate';

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route exact path="/login" component={Login}/>
					<Route exact path="/authenticate" component={Authenticate}/> 
				</Routes>
			</Router>
		</div>
	);
}

export default App;
