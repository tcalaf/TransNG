import React, { useEffect, useState } from "react";
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
import AdminSettings from "./Admin/AdminSettings";
import AdminHeader from "./Admin/AdminHeader";
import UserMap from "../components/UserMap";

function Dashboard() {
	const [user, loading, error] = useAuthState(auth);
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const history = useHistory();

	useEffect(() => {
		console.log("dashboard mount")
	}, []);

	useEffect(() => {
		if (loading) {
			console.log("loading page")
			return (
				<div>
				  <p>Initialising User...</p>
				</div>
			  );
		}
		if (error) {
			console.log("error page")
			return (
			  <div>
				<p>Error: {error}</p>
			  </div>
			);
		}
		if (!user) {
			console.log("redirect to login")
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
	
	console.log("dashboard")

	return (
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
					<Nav.Link href="#settings">Settings</Nav.Link>
					<Nav.Link eventKey={2} href="/contact">Contact</Nav.Link>
					<Nav.Link onClick={logout}>Logout</Nav.Link>
					</Nav>
				</Navbar.Collapse>
				</Container>
			</Navbar>
			<div className="column menu">
				{
					role === "Client" ? (
						<ClientSettings value={name}/>
					) : role === "Carrier" ? (
						<CarrierSettings email={user?.email} name={name} uid={user?.uid}/>
					) : (
						<AdminSettings></AdminSettings>
					)
				}
			</div>
			<div className="divmap" style={{backgroundColor:"#ADD8E6"}}>
				<UserMap visible={user && role !== "" && name !== ""} data={[
					{
						supply: {
							id_truck: "smth",
							start_date: "26 Dec 2021 12:00:00",
							start_place: "Malibu",
							finish_date: "22 Jan 2022 04:00:00",
							finish_place: "Los Angeles International Airport",
							current_place: '{"x": -118.475, "y": 34.026}',
							empty_price_per_km: 10,
							full_price_per_km: 20,
						},
						truck: {
							max_weight: 100,
							length: 100,
							width: 20,
							height: 50,
							max_volume: 100000
						},
						demands: [
							{
								start_place: "Beverly Hills",
								finish_place: "Inglewood",
								goods_weight: 20,
								goods_length: 10,
								goods_width: 5,
								goods_height: 2,
								goods_volume: 100,
								start_date: "26 Dec 2021 15:00:00",
								start_max_date: "26 Dec 2021 18:00:00",
								finish_date: "26 Dec 2021 21:00:00",
								finish_max_date: "26 Dec 2021 23:59:00",
							}
						]
					},
					{
						supply: {
							id_truck: "smth2",
							start_date: "20 Jan 2022 04:00:00",
							start_place: "Long Beach",
							finish_date: "22 Jan 2022 04:00:00",
							finish_place: "Santa Ana",
							current_place: '{"x": -118.475, "y": 34.526}'
						},
						truck: {
							max_weight: 100,
							length: 100,
							width: 20,
							height: 50,
							max_volume: 100000
						},
						demands: []
					}
				]} />
			</div>
		</div>
	);
}
export default Dashboard;