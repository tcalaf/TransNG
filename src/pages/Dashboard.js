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
	const [mapData, setMapData] = useState([]);
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
	}, [user, loading, error]);

	useEffect(() => {
		async function fetchData() {
			console.log("uid", user?.uid)
			if (!user)
				return;
			try {
				const userRef = await db.collection("users").doc(user?.uid);
				const userSnap = await userRef.get();
				const data = userSnap.data();
				setName(data.name);
				setRole(data.role);
				console.log(data.name);

				const suppliesRef = db.collection("users").doc(user?.uid).collection("supplies");
				const suppliesSnap = await suppliesRef.get();
				const allSupplies = suppliesSnap.docs.map(supplyDoc => ({
					...supplyDoc.data(),
					id: supplyDoc.id,
				}));

				console.log(allSupplies);

				let userMapData = [];

				for (let i = 0; i < allSupplies.length; i++) {
					const truckRef = db.collection("users").doc(user?.uid).collection("trucks").doc(allSupplies[i].id_truck);
					const truckSnap = await truckRef.get();
					const truckData = truckSnap.data();
					console.log(truckData);

					let demands = [];

					const demandsData = allSupplies[i].demands;
					console.log(demandsData);

					for (let j = 0; j < demandsData.length; j++) {
						const demandRef = db.collection("users").doc(demandsData[j].demand_uid).collection("demands").doc(demandsData[j].demand_id);
						const demandSnap = await demandRef.get();
						const demandData = demandSnap.data();
						demands.push(demandData);
					}

					console.log(demands);
					
					userMapData.push({
						supply: allSupplies[i],
						truck: truckData,
						demands: demands
					});

				}
				console.log("****map data", userMapData);
				setMapData(userMapData);


			} catch (err) {
				console.error(err);
				alert("An error occured while fetching user data");
			}			
		}
		fetchData();
	}, [user?.uid]);

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
				<UserMap visible={user && role !== "" && name !== ""} data={mapData} />
			</div>
		</div>
	);
}
export default Dashboard;