import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./../Dashboard.css";
import { auth, db, fetchCarriers, fetchDemandsforSupply, fetchDemandsSupplyNull, fetchSupplies, fetchTruck, fetchUser, logout } from "./../../firebase";
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
import { canGenerateContract } from "../../components/utils";

function ChooseOffer() {
	const [user, loading, error] = useAuthState(auth);
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const history = useHistory();

    const [clientDemands, setClientDemands] = useState([]);
    const [carriersSupplies, setCarriersSupplies] = useState([]);
    const [demandSelected, setDemandSelected] = useState(null);
	const [supplySelected, setSupplySelected] = useState(null);
    const [sortedSupplies, setSortedSupplies] = useState(null);
    const [unsortedSupplies, setUnsortedSupplies] = useState(null);

    const [sorted, setSorted] = useState(false);

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
		const data = await fetchUser(user?.uid);
		console.log(data);
		setName(data.name);
		setRole(data.role);        
	}

    const availableStartDate = (doc) => {
        return Date.parse(doc.start_date) >= Date.now() ? true : false;  
    }

    const getDemands = async () => {
        console.log("Fetching Demands");

        let demands = await fetchDemandsSupplyNull(user.uid);
        console.log(demands);

        demands = demands.filter(availableStartDate);
        console.log(demands);

        setClientDemands(demands);
    }

    const getSupplies = async () => {
		console.log("Fetching Supplies");

        const carriers = await fetchCarriers();

        let allSupplies = [];
		for (let i = 0; i < carriers.length; i++) {
            const carrier = carriers[i];

            let supplies = await fetchSupplies(carrier.uid);
            console.log(supplies);

            supplies = supplies.filter(availableStartDate);
            console.log(supplies);

            allSupplies = allSupplies.concat(supplies);
		}
        setCarriersSupplies(allSupplies);
    }

    const availableTime = (supply) => {
        if (Date.parse(supply.start_date) > Date.parse(demandSelected.start_date) || Date.parse(supply.finish_date) < Date.parse(demandSelected.finish_date)) {
            return false;
        }
        
        return true;
    }

    const availableArcgis = async (supply) => {
        const truck = await fetchTruck(supply.uid, supply.id_truck);
        const demands = await fetchDemandsforSupply(supply.demands)
        const cost = await canGenerateContract(supply, truck, demands, demandSelected);
        //const cost = Math.floor(Math.random() * 10);

        const costObj = {
            cost: cost
        }
        const ret = {
            ...supply,
            ...costObj
        }
        return ret;
    }

    useEffect(() => {
		async function fetchData() {
			console.log("uid", user?.uid);
			if (!user) return;
			try {
				fetchUserData();
				getDemands();
                getSupplies();
			} catch (err) {
				console.error(err);
			}			
		}
		fetchData();
	}, [user]);

    if (demandSelected !== null && unsortedSupplies === null) {
        const carriersSuppliesFiltered = carriersSupplies.filter(availableTime);
        Promise.all(carriersSuppliesFiltered.map(availableArcgis)).then((carriersSuppliesMapped) => {
            const carriersSuppliesMappedFiltered = carriersSuppliesMapped.filter((supply) => supply.cost === null ? false : true);
            console.log(carriersSuppliesMappedFiltered);
            setUnsortedSupplies([...carriersSuppliesMappedFiltered]);
            setSortedSupplies([...carriersSuppliesMappedFiltered].sort(sortAsc));
        });
    }

    const generateContract = () => {
        if (demandSelected === null) {
            alert("Please choose a demand!")
            return;
        }
        if (supplySelected === null) {
            alert("Please choose a supply!")
            return;
        }
        db.collection("contracts").add({
            demand: {
                demand_id: demandSelected.id,
                demand_uid: demandSelected.uid
            },
            supply: {
                supply_id: supplySelected.id,
                supply_uid: supplySelected.uid
            },
            price: supplySelected.cost,
            payment_ddl: "To be specified",
            special_instructions: "To be specified"
        })
        .then((docRef) => {
            alert("Contract: " + docRef.id + " generated between demand: " + demandSelected.id + " and supply: " + supplySelected.id);
            console.log("Contract: " + docRef.id + " generated between demand: " + demandSelected.id + " and supply: " + supplySelected.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    const sortAsc = (a, b) => {
        if (a.cost < b.cost ) {
            return -1;
        }
        if ( a.cost > b.cost ){
            return 1;
        }
        return 0;
    }

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
                        clientDemands.map((demand) => (
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
                                    id={demand.id}
                                    selected={demandSelected === demand ? true : false}
                                    onSelect={() => {setDemandSelected(demand); console.log(demandSelected); console.log(carriersSupplies)}}
                                    cost={null}
                                >
                                </Demand>
                            </React.Fragment>
                        ))
                    }
                </div>
            </div>
            <div className="halfscreen">
                <Form.Group className="mb-3" id="formGridCheckbox">
                    <Form.Check type="checkbox" label="Sort cost ascending"  onChange={(e) => setSorted(prevValue => !prevValue)}/>
                </Form.Group>
                <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', flexFlow: 'row wrap'}}>
                    {
                        demandSelected !== null &&
                        unsortedSupplies !== null &&
                        (sorted ? sortedSupplies : unsortedSupplies)
                        .map((supply) => (
                            <React.Fragment key={supply.id}>
                                <Supply
                                    id_truck={supply.id_truck}
                                    id={supply.id}
                                    start_date={supply.start_date}
                                    start_place={supply.start_place}
                                    finish_date={supply.finish_date}
                                    finish_place={supply.finish_place}
                                    empty_price_per_km={supply.empty_price_per_km}
                                    full_price_per_km={supply.full_price_per_km}
                                    contact_mail={supply.contact_mail}
                                    contact_phone={supply.contact_phone}
                                    selected={supplySelected === supply ? true : false}
                                    onSelect={() => setSupplySelected(supply)}
                                    cost = {supply.cost}
                                >
                                </Supply>
                            </React.Fragment>
                        ))
                    }
                </div>
            </div>
            <Button variant="primary" onClick={(e) => {e.preventDefault(); generateContract();}} style={{margin: '0 auto', display: 'block'}}>
                Generate Contract
            </Button>
		</div>
	);
}
export default ChooseOffer;