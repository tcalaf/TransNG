import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./../Dashboard.css";
import { auth, db, logout } from "./../../firebase";
import logo from './../../assets/delivery_light.png';
import ClientHeader from "./ClientHeader";
import Supply from "./../Carrier/Supply"
import Demand from "./Demand"
import Button from 'react-bootstrap/Button';
import ViewDemands from "./../Carrier/ViewDemands"
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "react-datepicker/dist/react-datepicker.css";

function ChooseOffer() {
	const [user, loading, error] = useAuthState(auth);
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const history = useHistory();

    const [clientDemands, setClientDemands] = useState([]);
    const [carriersSupplies, setCarriersSupplies] = useState([]);

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

	const fetchUserData = async () => {
		console.log("Fetching user data");
		const userRef = db.collection("users").doc(user?.uid);
		const userSnap = await userRef.get();
		const data = userSnap.data();
		setName(data.name);
		setRole(data.role);           
	}

    const fetchDemands = async () => {
        console.log("Fetching Demands");

        const availableDemands = (demandDoc) => {
            const data = demandDoc.data();
            return Date.parse(data.start_date) >= Date.now() ? true : false;        
        }

        const demandsRef = db.collection("users").doc(user.uid).collection("demands").where("supply", "==", null);
        const demandsSnap = await demandsRef.get();
        const allDemands = demandsSnap.docs.filter(availableDemands).map(demandDoc => ({
            ...demandDoc.data(),
            id: demandDoc.id,
        }));
        setClientDemands(allDemands);
    }

    const fetchSupplies = async (demand) => {
		console.log("Fetching Supplies for chosen demand");

        const availableSupplies = (supplyDoc) => {
            const supply = supplyDoc.data();
            if (Date.parse(supply.start_date) < Date.parse(demand.start_date) &&
                Date.parse(supply.finish_date) > Date.parse(demand.finish_date) &&
                Date.parse(supply.start_date) >= Date.now()) {
                    return true;
                }
            return false;
        }

		const carriersRef = db.collection("users").where("role", "==", "Carrier");
		const carriersSnap = await carriersRef.get();
		const allCarriers = carriersSnap.docs.map(carrierDoc => carrierDoc.data());

		for (let i = 0; i < allCarriers.length; i++) {
			const suppliesRef = db.collection("users").doc(allCarriers[i].uid).collection("supplies");
			const suppliesSnap = await suppliesRef.get();
			const allSupplies = suppliesSnap.docs.filter(availableSupplies).map(supplyDoc => ({
				...supplyDoc.data(),
				id: supplyDoc.id,
			}));

			for (let i = 0; i < allSupplies.length; i++) {
				userMapData.push(await fetchMapDataForSupply(allSupplies[i], allCarriers[i].uid));
			}

			console.log("****map data", userMapData);
			setMapData(userMapData);			
		}

    }

    useEffect(() => {
		async function fetchData() {
			console.log("uid", user?.uid);
			if (!user) return;
			try {
				fetchUserData();
				fetchDemands();
                //fetchSupplies(demand);
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
					<ClientHeader></ClientHeader>
					</Nav>
					<Nav>
					<Nav.Link href="/dashboard">Settings</Nav.Link>
					<Nav.Link eventKey={2} href="/contact">Contact</Nav.Link>
					<Nav.Link onClick={logout}>Logout</Nav.Link>
					</Nav>
				</Navbar.Collapse>
				</Container>
			</Navbar>
            <h3 className="halfscreen-header">My Demands</h3>
            <h3 className="halfscreen-header">Offers</h3>
            <div className="halfscreen">
                <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', flexFlow: 'row wrap'}}>
                    {
                        demands.map((demand) => (
                            <React.Fragment key={demand.id}>
                                <Demand
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
            <div className="halfscreen">
                <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', flexFlow: 'row wrap'}}>
                    {
                        supplies.map((supply) => (
                            <React.Fragment key={supply.id}>
                                <Supply
                                    id_truck={supply.id_truck}
                                    start_date={supply.start_date}
                                    start_place={supply.start_place}
                                    finish_date={supply.finish_date}
                                    finish_place={supply.finish_place}
                                    empty_price_per_km={supply.empty_price_per_km}
                                    full_price_per_km={supply.full_price_per_km}
                                    contact_mail={supply.contact_mail}
                                    contact_phone={supply.contact_phone}
                                    id={supply.id}
                                    uid={supply.uid}
                                >
                                </Supply>
                            </React.Fragment>
                        ))
                    }
                </div>
            </div>
            <Button variant="primary" style={{margin: '0 auto', display: 'block'}}>
                Generate Contract
            </Button>
		</div>
	);
}
export default ChooseOffer;