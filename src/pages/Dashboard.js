import React, { useEffect, useState, useCallback } from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./Dashboard.css";
import { auth, db, logout } from "../firebase";
import logo from './../assets/delivery_light.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
	const [user, loading, error] = useAuthState(auth);
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const history = useHistory();

	const fetchData = useCallback(async () => {
		try {
			const query = await db.collection("users").where("uid", "==", user?.uid).get();
			const data = query.docs[0].data();
			setName(data.name);
			setRole(data.role);
		} catch (err) {
			console.error(err);
			alert("An error occured while fetching user data");
		}
	},[user?.uid]);

	useEffect(() => {
		if (loading) {
			return (
				<div>
				  <p>Initialising User...</p>
				</div>
			  );
		}
		if (error) {
			return (
			  <div>
				<p>Error: {error}</p>
			  </div>
			);
		}
		if (!user) {
			return history.replace("/");
		}
		fetchData();
	}, [user, loading, error, history, fetchData]);

	return (
		<div>
			<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
				<Container>
				<Navbar.Brand href="#home">
					<img src={logo} alt="TransNG Logo" width="30" height="30"/>{' '}TransNG
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="me-auto">
					<Nav.Link eventKey="disabled" disabled>Logged in as {name} | {role}</Nav.Link>
					{
						role === "Client" ? (
							<React.Fragment>
							<Nav.Link href="#ship">Ship</Nav.Link>
							<Nav.Link href="#shipments">My Shipments</Nav.Link>
							</React.Fragment>
						) : (
							<React.Fragment>
							<Nav.Link href="#newoffers">New Offers</Nav.Link>
							<NavDropdown title="My Transports" id="collasible-nav-dropdown">
								<NavDropdown.Item href="#transport/1">B100TNG Arad-Bucuresti</NavDropdown.Item>
								<NavDropdown.Item href="#transport/2">B200TNG Bucuresti-Constanta</NavDropdown.Item>
								<NavDropdown.Item href="#transport/3">B300TNG Sibiu-Brasov</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item href="#action/3.4">Finished Transports</NavDropdown.Item>
							</NavDropdown>
							</React.Fragment>
						)
					}
					</Nav>
					<Nav>
					<Nav.Link href="#settings">Settings</Nav.Link>
					<Nav.Link eventKey={2} href="#contact">Contact</Nav.Link>
					<Nav.Link onClick={logout}>Logout</Nav.Link>
					</Nav>
				</Navbar.Collapse>
				</Container>
			</Navbar>
		</div>
		
	);
}
export default Dashboard;