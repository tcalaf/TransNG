import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./Dashboard.css";
import { auth, logout, fetchUser, fetchCarriers, fetchSupplies, fetchTruck, fetchDemandsforSupply } from "../firebase";
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

	const deleteOldSupplies = (supply) => {
		return Date.parse(supply.finish_date) >= Date.now() ? true : false;
	}

	const deleteUnavailableSupplies = (supply) => {
		if (deleteOldSupplies(supply) === false) return false;
		if (Date.parse(supply.start_date) < Date.now()) return true;
		else {
			const demands = supply.demands;
			for (let i = 0; i < demands.length; i++) {
				if (demands[i].demand_uid === user.uid) {
					return true;
				}
			}
			return false;
		}
	}

	const createMapDataObjectForSupply = async (supply, supplyUID) => {
		const truck = await fetchTruck(supplyUID, supply.id_truck);
		console.log(truck);

		const demands = await fetchDemandsforSupply(supply.demands);
		console.log(demands);
		
		const mapDataObj = {
			supply: supply,
			truck: truck,
			demands: demands
		}

		return mapDataObj;
	}

	const getMapDataCarrier = async () => {
		console.log("Fetching Carrier map data");
		let userMapData = [];

		let supplies = await fetchSupplies(user?.uid);
		console.log(supplies);

		supplies = supplies.filter(deleteOldSupplies);
		console.log(supplies);		

		for (let i = 0; i < supplies.length; i++) {
			const supply = supplies[i];
			userMapData.push(await createMapDataObjectForSupply(supply, user?.uid));
		}

		console.log("****map data", userMapData);
		setMapData(userMapData);
	}

	const getMapDataClient = async () => {
		console.log("Fetching Client map data");

		const carriers = await fetchCarriers();
		console.log(carriers);

		let userMapData = [];
		for (let i = 0; i < carriers.length; i++) {
			const carrier = carriers[i];

			let supplies = await fetchSupplies(carrier.uid);
			console.log(supplies);

			supplies = supplies.filter(deleteUnavailableSupplies);
			console.log(supplies);

			for (let j = 0; j < supplies.length; j++) {
				const supply = supplies[j];
				userMapData.push(await createMapDataObjectForSupply(supply, carrier.uid));
			}			
		}
		console.log("****map data", userMapData);
		setMapData(userMapData);
	}

	const getUserData = async () => {
		console.log("Fetching user data");
		const data = await fetchUser(user?.uid);
		console.log(data);
		setName(data.name);
		setRole(data.role);
		setPhone(data.phone);
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
				getUserData();
				role === "Carrier" ? getMapDataCarrier() : getMapDataClient();
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