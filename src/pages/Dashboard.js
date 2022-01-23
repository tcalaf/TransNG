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
				console.log(userMapData);
				setMapData(userMapData);


			} catch (err) {
				console.error(err);
				//alert("An error occured while fetching user data");
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
							id: "123",
							id_truck: "smth",
							start_date: "26 Dec 2021 12:00:00",
							start_place: "Bucuresti",
							finish_date: "22 Jan 2022 04:00:00",
							finish_place: "Constanta",
							current_place: '{"x": 27.822100000000034, "y": 44.41611000000006}',
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
								id: "234",
								start_place: "Bucuresti",
								finish_place: "Fetesti",
								goods_weight: 20,
								goods_length: 10,
								goods_width: 5,
								goods_height: 2,
								goods_volume: 100,
								start_date: "26 Dec 2021 15:00:00",
								start_max_date: "27 Dec 2021 18:00:00",
								finish_date: "28 Dec 2021 21:00:00",
								finish_max_date: "29 Dec 2021 23:59:00",
							},
							{
								id: "345",
								start_place: "Fetesti",
								finish_place: "Constanta",
								goods_weight: 20,
								goods_length: 10,
								goods_width: 5,
								goods_height: 2,
								goods_volume: 100,
								start_date: "28 Dec 2021 15:00:00",
								start_max_date: "29 Dec 2021 18:00:00",
								finish_date: "30 Dec 2021 21:00:00",
								finish_max_date: "31 Dec 2021 23:59:00",
							}
						]
					},
				 ]} /> 
			</div>
		</div>
	);
}
export default Dashboard;