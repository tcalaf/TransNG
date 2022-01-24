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

    const [startDate, setStartDate] = useState("");
    const [startMaxDate, setStartMaxDate] = useState("");
    const [finishDate, setFinishDate] = useState("");
    const [finishMaxDate, setFinishMaxDate] = useState("");
    const [startPlace, setStartPlace] = useState("");
    const [finishPlace, setFinishPlace] = useState("");
    const [goods, setGoods] = useState("");
    const [goodsWeight, setGoodsWeight] = useState(-1);
    const [goodsVolume, setGoodsVolume] = useState(-1);
    const [goodsLength, setGoodsLength] = useState(-1);
    const [goodsWidth, setGoodsWidth] = useState(-1);
    const [goodsHeight, setGoodsHeight] = useState(-1);
    const [maxBudget, setMaxBudget] = useState(-1);
    const [contactMail, setContactMail] = useState("");
    const [contactPhone, setContactPhone] = useState("");

	const [defaultMail, setDefaultMail] = useState("");
	const [defaultPhone, setDefaultPhone] = useState("");

    const [dbGoods, setDBGoods] = useState([]);

    const [supplies, setSupplies] = useState([]);
    const [demands, setDemands] = useState([]);

    const onlyDigits = (evt) => {
        if (evt.which != 8 && evt.which != 46 && evt.which != 0 && evt.which < 48 || evt.which > 57)
        {
            evt.preventDefault();
        }
    }

    const addDemand = () => {
		var hasEmptyField = false
        var emptyFields = "Please enter:\n"

        if (startDate === "") {
            emptyFields += "- Start Date\n"
            hasEmptyField = true
        }
        if (startMaxDate === "") {
            emptyFields += "- Start Max Date\n"
            hasEmptyField = true
        }
        if (startPlace === "") {
			emptyFields += "- Start Place\n"
            hasEmptyField = true
		}
        if (finishDate === "") {
			emptyFields += "- Finish Date\n"
            hasEmptyField = true
		}
        if (finishMaxDate === "") {
			emptyFields += "- Finish Max Date\n"
            hasEmptyField = true
		}
        if (finishPlace === "") {
			emptyFields += "- Finish Place\n"
            hasEmptyField = true
		}
        if (goodsWeight < 0) {
            emptyFields += "- Goods Weidght\n"
            hasEmptyField = true
        }
        if (goodsVolume < 0) {
            emptyFields += "- Goods Volume\n"
            hasEmptyField = true
        }
        if (goodsLength < 0) {
            emptyFields += "- Goods Length\n"
            hasEmptyField = true
        }
        if (goodsWidth < 0) {
            emptyFields += "- Goods Width\n"
            hasEmptyField = true
        }
        if (goodsHeight < 0) {
            emptyFields += "- Goods Height\n"
            hasEmptyField = true
        }
        if (maxBudget < 0) {
            emptyFields += "- Max Budget\n"
            hasEmptyField = true
        }
		if (hasEmptyField) {
            alert(emptyFields);
            return;
        }

        db.collection("users").doc(user.uid).collection("demands").add({
            start_date: startDate,
            start_max_date: startMaxDate,
            start_place: startPlace,
			finish_date: finishDate,
            finish_max_date: finishMaxDate,
			finish_place: finishPlace,
            goods: (goods === "" ? dbGoods[0] : goods),
            goods_weight: goodsWeight,
            goods_volume: goodsVolume,
            goods_length: goodsLength,
            goods_width: goodsWidth,
            goods_height: goodsHeight,
            max_budget: maxBudget,
			contact_mail: (contactMail === "" ? defaultMail : contactMail),
			contact_phone: (contactPhone === "" ? defaultPhone : contactPhone),
            supply: null,
        })
        .then((docRef) => {
            alert("Demand added with ID: " + docRef.id)
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
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
		async function fetchData() {
			try {
				const userRef = db.collection("users").doc(user?.uid);
				const userSnap = await userRef.get();
				const data = userSnap.data();
				setName(data.name);
				setRole(data.role);
				setDefaultPhone(data.phone);
				setDefaultMail(data.email);                

				console.log(data.name);

                const goodsRef = db.collection("utilities").doc("goods");
                const goodsSnap = await goodsRef.get();
                const goodsData = goodsSnap.data();
                setDBGoods(goodsData.goods);

                const carriersRef = db.collection("users").where("role", "==", "Carrier");
                const carriersSnap = await carriersRef.get();
				const allCarriers = carriersSnap.docs.map(carrierDoc => carrierDoc.data());
				//console.log(allCarriers);     

                let allSupplies = [];

                for (let i = 0; i < allCarriers.length; i++) {
                    const suppliesCollectionRef = db.collection("users").doc(allCarriers[i].uid).collection("supplies").where("demands", "==", []);
                    const suppliesCollectionSnap = await suppliesCollectionRef.get();
                    const allCollectionSupplies = suppliesCollectionSnap.docs.map(supplyDoc => ({
                        ...supplyDoc.data(),
                        id: supplyDoc.id,
                    }));

                    if (allCollectionSupplies.length > 0) {
                        for (let j = 0; j < allCollectionSupplies.length; j++) {
                            let newSupply = {
                                ...allCollectionSupplies[j],
                                uid: allCarriers[i].uid,
                            };
                            allSupplies.push(newSupply);
                        }
                    }
                }
                
                console.log(allSupplies);
                setSupplies(allSupplies);

                const clientsRef = db.collection("users").where("role", "==", "Client");
                const clientsSnap = await clientsRef.get();
				const allClients = clientsSnap.docs.map(clientDoc => clientDoc.data());    

                let allDemands = [];

                for (let i = 0; i < allClients.length; i++) {
                    const demandsCollectionRef = db.collection("users").doc(allClients[i].uid).collection("demands").where("supply", "==", null);
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