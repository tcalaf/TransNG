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
	const [phone, setPhone] = useState("");
	const [mapData, setMapData] = useState([]);
	const history = useHistory();

	const deleteOldSupplies = (supplyDoc) => {
		const data = supplyDoc.data();
		return Date.parse(data.finish_date) >= Date.now() ? true : false;
	}

	const deleteUnavailableSupplies = (supplyDoc) => {
		if (deleteOldSupplies(supplyDoc) === false) return false;
		const data = supplyDoc.data();
		if (Date.parse(data.start_date) < Date.now()) return true;
		else {
			const demands = data.demands;
			for (let i = 0; i < demands.length; i++) {
				if (demands[i].demand_uid === user.uid) {
					return true;
				}
			}
			return false;
		}
	}

	const fetchMapDataForSupply = async (supply, supplyUID) => {
		const truckRef = db.collection("users").doc(supplyUID).collection("trucks").doc(supply.id_truck);
		const truckSnap = await truckRef.get();
		const truckData = truckSnap.data();
		console.log(truckData);

		let demands = [];
		const demandsData = supply.demands;
		for (let j = 0; j < demandsData.length; j++) {
			const demandRef = db.collection("users").doc(demandsData[j].demand_uid).collection("demands").doc(demandsData[j].demand_id);
			const demandSnap = await demandRef.get();
			const demandData = demandSnap.data();
			demands.push(demandData);
		}
		console.log(demands);
		
		const obj = {
			supply: supply,
			truck: truckData,
			demands: demands
		}

		return obj;
	}

	const fetchMapDataCarrier = async () => {
		console.log("Fetching Carrier map data");

		const suppliesRef = db.collection("users").doc(user?.uid).collection("supplies");
		const suppliesSnap = await suppliesRef.get();
		const allSupplies = suppliesSnap.docs.filter(deleteOldSupplies).map(supplyDoc => ({
			...supplyDoc.data(),
			id: supplyDoc.id,
		}));
		console.log(allSupplies);

		let userMapData = [];
		for (let i = 0; i < allSupplies.length; i++) {
			userMapData.push(await fetchMapDataForSupply(allSupplies[i], user?.uid));
		}

		console.log("****map data", userMapData);
		setMapData(userMapData);
	}

	const fetchMapDataClient = async () => {
		console.log("Fetching Client map data");

		const carriersRef = db.collection("users").where("role", "==", "Carrier");
		const carriersSnap = await carriersRef.get();
		const allCarriers = carriersSnap.docs.map(carrierDoc => carrierDoc.data());

		let userMapData = [];
		for (let i = 0; i < allCarriers.length; i++) {
			const suppliesCollectionRef = db.collection("users").doc(allCarriers[i].uid).collection("supplies");
			const suppliesCollectionSnap = await suppliesCollectionRef.get();
			const allSupplies = suppliesCollectionSnap.docs.filter(deleteUnavailableSupplies).map(supplyDoc => ({
				...supplyDoc.data(),
				id: supplyDoc.id,
			}));
			console.log(allSupplies);

			for (let i = 0; i < allSupplies.length; i++) {
				userMapData.push(await fetchMapDataForSupply(allSupplies[i], allCarriers[i].uid));
			}

			console.log("****map data", userMapData);
			setMapData(userMapData);			
		}
	}

	const fetchUserData = async () => {
		console.log("Fetching user data");
		const userRef = db.collection("users").doc(user?.uid);
		const userSnap = await userRef.get();
		const data = userSnap.data();
		setName(data.name);
		setRole(data.role);
		setPhone(data.phone);
		console.log(data);
	}


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
				fetchUserData();
				role === "Carrier" ? fetchMapDataCarrier() : fetchMapDataClient();
			} catch (err) {
				console.error(err);
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
					<Nav.Link href="/dashboard">Settings</Nav.Link>
					<Nav.Link eventKey={2} href="/contact">Contact</Nav.Link>
					<Nav.Link onClick={logout}>Logout</Nav.Link>
					</Nav>
				</Navbar.Collapse>
				</Container>
			</Navbar>
			<div className="column menu">
				{
					role === "Client" ? (
						<ClientSettings name={name}  phone={phone}  email={user?.email} uid={user?.uid} />
					) : role === "Carrier" ? (
						<CarrierSettings email={user?.email} name={name} uid={user?.uid} phone={phone}/>
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