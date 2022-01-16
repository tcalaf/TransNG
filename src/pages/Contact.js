import React, { useEffect, useState, useCallback } from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./Dashboard.css";
import "./Contact.css";
import { auth, db, logout } from "../firebase";
import logo from './../assets/delivery_light.png';
import CarrierHeader from "./Carrier/CarrierHeader";
import ClientHeader from "./Client/ClientHeader";
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminHeader from "./Admin/AdminHeader";

const Contact=()=>{
    const [user, loading, error] = useAuthState(auth);
	const history = useHistory();
	const [name, setName] = useState("");
	const [role, setRole] = useState("");

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
		async function fetchData() {
			try {
				const userRef = await db.collection("users").doc(user?.uid);
				const userSnap = await userRef.get();
				const data = userSnap.data();
				setName(data.name);
				setRole(data.role);
				console.log(data.name);
			} catch (err) {
				console.error(err);
				alert("An error occured while fetching user data");
			}			
		}
		fetchData();
	}, [user, loading, error]);

    return(
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{height:"4vh"}}>
				<Container>
				<Navbar.Brand href="/dashboard">
					<img src={logo} alt="TransNG Logo" width="30" height="30"/>{' '}TransNG
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="me-auto">
					<Nav.Link eventKey="disabled" disabled>Logged in as {name} | {role}</Nav.Link>
					{
						role === "Client" ? (
							<ClientHeader></ClientHeader>
						) : role === "Carrier" ? (
							<CarrierHeader></CarrierHeader>
						) :  (						
							<AdminHeader></AdminHeader>
						)
					}
					</Nav>
					<Nav>
					<Nav.Link href="/dashboard">Settings</Nav.Link>
					<Nav.Link eventKey={2} href="/contact">Contact</Nav.Link>
					<Nav.Link onClick={logout}>Logout</Nav.Link>
					</Nav>
				</Navbar.Collapse>
				</Container>
			</Navbar>
            <h2>Settings</h2>
            <div class="center-screen">
                <ul>
                    Please contact us at:
                    <li>+40722222222</li>
                    <li>admin@admin.com</li>
                    <li>Splaiul Independenței 313, București</li>
                </ul>
            </div>
		</div>
    )
}

export default Contact;