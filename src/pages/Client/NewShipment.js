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
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "react-datepicker/dist/react-datepicker.css";

function NewShipment() {
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
			<div className="column menu">
                <Form>
                    <h3>New Shipment</h3>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
						<Form.Label>Start Date:</Form.Label>
                        <br></br>
                        <Form.Text className="text-muted">
                        (format: DD MMM YYYY HH:MM:SS)
                        </Form.Text>
						<Form.Control placeholder="e.g.: 22 Jan 2022 04:00:00" onChange={(e) => setStartDate(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
						<Form.Label>Start Max Date:</Form.Label>
                        <br></br>
                        <Form.Text className="text-muted">
                        (format: DD MMM YYYY HH:MM:SS)
                        </Form.Text>
                        <br></br>
                        <Form.Text className="text-muted">
                            in case trucks are unavailable for chosen Start Date
                        </Form.Text>
						<Form.Control placeholder="e.g.: 23 Jan 2022 04:00:00" onChange={(e) => setStartMaxDate(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Start Place:</Form.Label>
                        <Form.Control placeholder="Bucharest" onChange={(e) => setStartPlace(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
						<Form.Label>Finish Date:</Form.Label>
                        <br></br>
                        <Form.Text className="text-muted">
                        (format: DD MMM YYYY HH:MM:SS)
                        </Form.Text>
						<Form.Control placeholder="ex: 24 Jan 2022 04:00:00" onChange={(e) => setFinishDate(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
						<Form.Label>Finish Max Date:</Form.Label>
                        <br></br>
                        <Form.Text className="text-muted">
                        (format: DD MMM YYYY HH:MM:SS)
                        </Form.Text>
                        <br></br>
                        <Form.Text className="text-muted">
                            in case trucks are unavailable for chosen Finish Date
                        </Form.Text>
						<Form.Control placeholder="e.g.: 25 Jan 2022 04:00:00" onChange={(e) => setFinishMaxDate(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Finish Place:</Form.Label>
                        <Form.Control placeholder="Constanta" onChange={(e) => setFinishPlace(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Goods Type:</Form.Label>
						<Form.Select onChange={(e) => setGoods(e.target.value)}>
							{
								dbGoods.map((elem) => 
									<option value={elem}> {elem} </option>
								)
							}
						</Form.Select>
                    </Form.Group>

                    <Form.Label>Dimensions</Form.Label>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridText">
                        <Form.Text className="text-muted">
                        weight (in kg):
                        </Form.Text>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 100" onKeyPress={(e) => onlyDigits(e)} onChange={(e) => setGoodsWeight(e.target.valueAsNumber)} />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridText">
                        <Form.Text className="text-muted">
                        volume (in m³):
                        </Form.Text>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 5" onKeyPress={(e) => onlyDigits(e)} onChange={(e) => setGoodsVolume(e.target.valueAsNumber)} />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Text>length (in m):</Form.Text>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 5" onKeyPress={(e) => onlyDigits(e)} onChange={(e) => setGoodsLength(e.target.valueAsNumber)} />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Text>width (in m):</Form.Text>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 1" onKeyPress={(e) => onlyDigits(e)} onChange={(e) => setGoodsWidth(e.target.valueAsNumber)} />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Text>height (in m):</Form.Text>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 1" onKeyPress={(e) => onlyDigits(e)} onChange={(e) => setGoodsHeight(e.target.valueAsNumber)} />
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Budget (in €):</Form.Label>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 125" onKeyPress={(e) => onlyDigits(e)} onChange={(e) => setMaxBudget(e.target.valueAsNumber)} />
                    </Form.Group>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridText">
                        <Form.Label>Contact Mail:</Form.Label>
						<br></br>
						<Form.Text className="text-muted">
                        or leave it default:
                        </Form.Text>
                        <Form.Control type="text" placeholder={defaultMail} onChange={(e) => setContactMail(e.target.value)}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridText">
                        <Form.Label>Contact Phone:</Form.Label>
						<br></br>
						<Form.Text className="text-muted">
                        or leave it default:
                        </Form.Text>
                        <Form.Control type="text" placeholder={defaultPhone} onChange={(e) => setContactPhone(e.target.value)} />
                        </Form.Group>
                    </Row>

                    <Button variant="primary" type="submit" onClick={(e) => {e.preventDefault(); addDemand();}}>
                        Add Shipment
                    </Button>
                </Form>
			</div>
            <div className="divmap map">
                <h3>Available Trucks</h3>
                <div style={{backgroundColor:"#D8EBF3", display: 'flex', flexWrap: 'wrap', flexDirection: 'row', flexFlow: 'row wrap'}}>
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
                                >
                                </Supply>
                            </React.Fragment>
                        ))
                    }
                </div>
            </div>
		</div>
	);
}
export default NewShipment;