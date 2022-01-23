import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./../Dashboard.css";
import { auth, db, logout } from "./../../firebase";
import logo from './../../assets/delivery_light.png';
import CarrierHeader from "./../Carrier/CarrierHeader";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function NewTrip() {
	const [user, loading, error] = useAuthState(auth);
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const history = useHistory();

	const [truckId, setTruckId] = useState("");
    const [startDate, setStartDate] = useState("");
	const [startPlace, setStartPlace] = useState("");
    const [finishDate, setFinishDate] = useState("");
	const [finishPlace, setFinishPlace] = useState("");
	const [emptyPricePerKm, setEmptyPricePerKm] = useState(-1);
	const [fullPricePerKm, setFullPricePerKm] = useState(-1);
	const [contactMail, setContactMail] = useState("");
	const [contactPhone, setContactPhone] = useState("");

	const [defaultMail, setDefaultMail] = useState("");
	const [defaultPhone, setDefaultPhone] = useState("");

	const [trucks, setTrucks] = useState([]);

    const onlyDigits = (evt) => {
        if (evt.which != 8 && evt.which != 46 && evt.which != 0 && evt.which < 48 || evt.which > 57)
        {
            evt.preventDefault();
        }
    }


	const addSupply = () => {
		var hasEmptyField = false
        var emptyFields = "Please enter:\n"

		if (startDate === "") {
			emptyFields += "- Start Date\n"
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
		if (finishPlace === "") {
			emptyFields += "- Finish Place\n"
            hasEmptyField = true
		}
		if (emptyPricePerKm < 0) {
			emptyFields += "- Empty Price per km\n"
            hasEmptyField = true
		}
		if (fullPricePerKm < 0) {
			emptyFields += "- Full Price per km\n"
            hasEmptyField = true
		}
		if (hasEmptyField) {
            alert(emptyFields);
            return;
        }

        db.collection("users").doc(user.uid).collection("supplies").add({
			id_truck: (truckId === "" ? trucks[0].id : truckId),
            start_date: startDate,
            start_place: startPlace,
			finish_date: finishDate,
			finish_place: finishPlace,
			empty_price_per_km: emptyPricePerKm,
			full_price_per_km: fullPricePerKm,
			contact_mail: (contactMail === "" ? defaultMail : contactMail),
			contact_phone: (contactPhone === "" ? defaultPhone : contactPhone),
			demands: [],
            current_place: "",
        })
        .then((docRef) => {
            alert("Supply added with ID: " + docRef.id)
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

				const trucksCollectionRef = db.collection("users").doc(user.uid).collection("trucks");
                const trucksSnap = await trucksCollectionRef.get();
                const allTrucks = trucksSnap.docs.map(truckDoc => ({
                    ...truckDoc.data(),
                    id: truckDoc.id,
                }));
                setTrucks(allTrucks);

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
					<Nav.Link href="/dashboard">Settings</Nav.Link>
					<Nav.Link eventKey={2} href="/contact">Contact</Nav.Link>
					<Nav.Link onClick={logout}>Logout</Nav.Link>
					</Nav>
				</Navbar.Collapse>
				</Container>
			</Navbar>
			<div className="column menu">
				{/* <CarrierSettings email={user?.email} name={name} uid={user?.uid}/> */}
                <Form>
                    <h3>New Trip</h3>
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Truck:</Form.Label>
						<Form.Select onChange={(e) => setTruckId(e.target.value)}>
							{
								trucks.map((truck) => 
									<option value={truck.id}> {truck.licence_plate} </option>
								)
							}
						</Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
						<Form.Label>Start Date:</Form.Label>
						<br></br>
                        <Form.Text className="text-muted">
                        (format: DD MMM YYYY HH:MM:SS)
                        </Form.Text>
						<Form.Control placeholder="e.g.: 22 Jan 2022 04:00:00" onChange={(e) => setStartDate(e.target.value)}/>
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
						<Form.Control placeholder="ex: 23 Jan 2022 04:00:00" onChange={(e) => setFinishDate(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Finish Place:</Form.Label>
                        <Form.Control placeholder="Constanta" onChange={(e) => setFinishPlace(e.target.value)}/>
                    </Form.Group>

                    <Form.Label>Price per km in €</Form.Label>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridText">
                        <Form.Text className="text-muted">
                        when empty:
                        </Form.Text>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 0.1" onKeyPress={(e) => onlyDigits(e)} onChange={(e) => setEmptyPricePerKm(e.target.valueAsNumber)} />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridText">
                        <Form.Text className="text-muted">
                        when loaded:
                        </Form.Text>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 0.5" onKeyPress={(e) => onlyDigits(e)} onChange={(e) => setFullPricePerKm(e.target.valueAsNumber)} />
                        </Form.Group>
                    </Row>
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

                    <Button variant="primary" type="submit" onClick={(e) => {e.preventDefault(); addSupply();}}>
                        Add Trip
                    </Button>
                </Form>
			</div>
		</div>
	);
}
export default NewTrip;