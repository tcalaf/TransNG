import React, { useEffect, useState } from 'react';
import { auth, db, logout } from "./../firebase";
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

function ViewDemands() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const history = useHistory();

    const [demands, setDemands] = useState([]);
    const contracts = [
        {
            demand_id: "12rrgdbf8jedTpZ5lPOA",
            payment_ddl: "1641996086",
            price: "300",
            special_instructions: "nimic",
            supply_id: "WLCFCSBal9e3Vvx4Gelv"
        },
        {
            demand_id: "oUWRMYmK4wu488bFSqvf",
            payment_ddl: "1641996124",
            price: "400",
            special_instructions: "nimic2",
            supply_id: "WLCFCSBal9e3Vvx4Gelv"
        }
    ]

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
				const userRef = db.collection("users").doc(user?.uid);
				const userSnap = await userRef.get();
				const data = userSnap.data();
				setName(data.name);
				setRole(data.role);               

				console.log(data.name);

                const clientsRef = db.collection("users").where("role", "==", "Client");
                const clientsSnap = await clientsRef.get();
				const allClients = clientsSnap.docs.map(clientDoc => clientDoc.data());    

                let allDemands = [];

                for (let i = 0; i < allClients.length; i++) {
                    const demandsCollectionRef = db.collection("users").doc(allClients[i].uid).collection("demands");
                    const demandsCollectionSnap = await demandsCollectionRef.get();
                    const allCollectionDemands = demandsCollectionSnap.docs.map(demandDoc => ({
                        ...demandDoc.data(),
                        id: demandDoc.id,
                    }));

                    if (allCollectionDemands.length > 0) {
                        for (let j = 0; j < allCollectionDemands.length; j++) {
                            let newDemand = {
                                ...allCollectionDemands[j],
                                uid: allClients[i].uid,
                            };
                            allDemands.push(newDemand);
                        }
                    }
                }
                
                console.log(allDemands);
                setDemands(allDemands);
                console.log(contracts)

			} catch (err) {
				console.error(err);
				//alert("An error occured while fetching user data");
			}			
		}
		fetchData();
	}, [user, loading, error]);

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
							demand_id={contract.demand_id}
							supply_id={contract.supply_id}
						>
						</Contract>
					</React.Fragment>
				))
			}
		</div>
	</div>
  );
}

export default ViewDemands;
