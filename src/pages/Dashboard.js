import React, { useEffect, useState, useCallback } from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./Dashboard.css";
import { auth, db, logout } from "../firebase";
import logo from './../assets/delivery_light.png';
import CarrierHeader from "./Carrier/CarrierHeader";
import ClientHeader from "./Client/ClientHeader";
import 'bootstrap/dist/css/bootstrap.min.css';
import ClientSettings from "./Client/ClientSettings";
import CarrierSettings from "./Carrier/CarrierSettings";
import UserMap from "../components/UserMap";

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
			<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{height:"4vh"}}>
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
							<ClientHeader></ClientHeader>
						) : (
							<CarrierHeader></CarrierHeader>
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
			<div class="column menu">
				{
					role === "Client" ? (
						<ClientSettings value={name}/>
					) : (
						<CarrierSettings email={user?.email} name={name}/>
					)
				}
			</div>
			<div class="divmap" style={{backgroundColor:"#ADD8E6"}}>
				<UserMap />
			</div>
		</div>
	);
}
export default Dashboard;