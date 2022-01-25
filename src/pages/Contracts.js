import React, { useEffect, useState } from 'react';
import { auth, db, fetchContractsCarrier, fetchContractsClient, fetchUser, logout } from "./../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import Contract from "./Contract"
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import CarrierHeader from "./Carrier/CarrierHeader";
import ClientHeader from "./Client/ClientHeader";
import AdminHeader from "./Admin/AdminHeader";
import logo from './../assets/delivery_light.png';

function Contracts() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
	const [contracts, setContracts] = useState([]);
    const history = useHistory();

	const getContractsClient = async () => {
		console.log("Fetching Client contracts!")
		const contracts = await fetchContractsClient(user.uid);
		setContracts(contracts);
	}

	const getContractsCarrier = async () => {
		console.log("Fetching Carrier contracts!")
		const contracts = await fetchContractsCarrier(user.uid);
		setContracts(contracts);
	}

	const fetchUserData = async () => {
		console.log("Fetching user data");
		const data = await fetchUser(user?.uid);
		console.log(data);
		setName(data.name);
		setRole(data.role);       
	}

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
	}, [user, loading, error]);

	useEffect(() => {
		async function fetchData() {
			console.log("uid", user?.uid)
			if (!user) return;
			try {
				fetchUserData();
				role === "Carrier" ? getContractsCarrier() : getContractsClient();
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
		<div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', flexFlow: 'row wrap'}}>
			{
				contracts.map((contract) => (
					<React.Fragment key={contract.id}>
						<Contract
							price={contract.price}
							special_instructions={contract.special_instructions}
							payment_ddl={contract.payment_ddl}
							demand_id={contract.demand.demand_id}
							supply_id={contract.supply.supply_id}
							demand_uid={contract.demand.demand_uid}
							supply_uid={contract.supply.supply_uid}
						>
						</Contract>
					</React.Fragment>
				))
			}
		</div>
	</div>
  );
}

export default Contracts;
