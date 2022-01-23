import React, { useEffect, useState } from 'react';
import { auth, db, logout } from "./../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import Demand from "./../Client/Demand"
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import CarrierHeader from "./../Carrier/CarrierHeader";
import logo from './../../assets/delivery_light.png';

function ViewDemands() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const history = useHistory();

    const [demands, setDemands] = useState([]);

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
				<CarrierHeader></CarrierHeader>
				</Nav>
				<Nav>
				<Nav.Link href="#settings">Settings</Nav.Link>
				<Nav.Link eventKey={2} href="/contact">Contact</Nav.Link>
				<Nav.Link onClick={logout}>Logout</Nav.Link>
				</Nav>
			</Navbar.Collapse>
			</Container>
		</Navbar>
		<div style={{backgroundColor:"#D8EBF3", display: 'flex', flexWrap: 'wrap', flexDirection: 'row', flexFlow: 'row wrap'}}>
			{
				demands.map((demand) => (
					<React.Fragment key={demand.id}>
						<Demand
							supply_id={demand.supply_id}
							start_date={demand.start_date}
							start_max_date={demand.start_max_date}
							start_place={demand.start_place}
							finish_date={demand.finish_date}
							finish_max_date={demand.finish_max_date}
							finish_place={demand.finish_place}
							goods={demand.goods}
							goods_weight={demand.goods_weight}
							goods_volume={demand.goods_volume}
							goods_length={demand.goods_length}
							goods_width={demand.goods_width}
							goods_height={demand.goods_height}
							max_budget={demand.max_budget}
							contact_mail={demand.contact_mail}
							contact_phone={demand.contact_phone}
						>
						</Demand>
					</React.Fragment>
				))
			}
		</div>
	</div>
  );
}

export default ViewDemands;
