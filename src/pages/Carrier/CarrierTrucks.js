import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import CarrierHeader from './CarrierHeader';
import logo from './../../assets/delivery_light.png';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Truck from './Truck'
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import { auth, db, logout } from "./../../firebase";

const CarrierTrucks=()=>{
    const [user, loading, error] = useAuthState(auth);
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
    const history = useHistory();

    const [phone, setPhone] = useState("");
    const [licencePlate, setLicencePlate] = useState("");
    const [model, setModel] = useState("");
    const [maxVolume, setMaxVolume] = useState(-1);
    const [maxWeight, setMaxWeight] = useState(-1);
    const [length, setLength] = useState(-1);
    const [width, setWidth] = useState(-1);
    const [height, setHeight] = useState(-1);
    const [hasSleepingCabin, setHasSleepingCabin] = useState(false);
    const [trucks, setTrucks] = useState([]);

    const onlyDigits = (evt) => {
        if (evt.which != 8 && evt.which != 46 && evt.which != 0 && evt.which < 48 || evt.which > 57)
        {
            evt.preventDefault();
        }
    }

    const addTruck = () => {
        var hasEmptyField = false
        var emptyFields = "Please enter:\n"
        if (licencePlate === "") {
            emptyFields += "- Licence Plate\n"
            hasEmptyField = true
        }
        if (model === "") {
            emptyFields += "- Truck Model\n"
            hasEmptyField = true
        }
        if (length <= 0) {
            emptyFields += "- Length\n"
            hasEmptyField = true
        }
        if (width <= 0) {
            emptyFields += "- Width\n"
            hasEmptyField = true
        }
        if (height <= 0) {
            emptyFields += "- Height\n"
            hasEmptyField = true
        }
        if (maxVolume <= 0) {
            emptyFields += "- Max Load Volume\n"
            hasEmptyField = true
        }
        if (maxWeight <= 0) {
            emptyFields += "- Max Load Weight\n"
            hasEmptyField = true
        }
        if (hasEmptyField) {
            alert(emptyFields);
            return;
        }
        db.collection("users").doc(user.uid).collection("trucks").add({
            licence_plate: licencePlate,
            model: model,
            max_volume: maxVolume,
            max_weight: maxWeight,
            length: length,
            width: width,
            height: height,
            has_sleeping_cabin: hasSleepingCabin
        })
        .then((docRef) => {
            alert("Truck added with ID: " + docRef.id)
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    useEffect(() => {
		console.log("carrier trucks mount")
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
				const userRef = await db.collection("users").doc(user?.uid);
				const userSnap = await userRef.get();
				const data = userSnap.data();
				setName(data.name);
				setRole(data.role);
                setPhone(userSnap.data().phone);
				console.log(data.name);

                const trucksCollectionRef = db.collection("users").doc(user?.uid).collection("trucks");
                const trucksSnap = await trucksCollectionRef.get();
                const allTrucks = trucksSnap.docs.map(truckDoc => ({
                    ...truckDoc.data(),
                    id: truckDoc.id,
                }));
                setTrucks(allTrucks);
			} catch (err) {
				console.error(err);
			}			
		}
		fetchData();
	}, [user?.uid]);

    return(
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
                <Form>
                    <h3>New Truck</h3>
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Licence Plate:</Form.Label>
                        <Form.Control placeholder="B 123 TNG" onChange={(e) => setLicencePlate(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Truck Model:</Form.Label>
                        <Form.Control placeholder="2021 Volvo FH16, D16 Engine, 650 HP" onChange={(e) => setModel(e.target.value)}/>
                    </Form.Group>
                    <Row className="mb-3">
                        <Form.Text className="text-muted">
                        Enter trailer dimensions in meters:
                        </Form.Text>
                        <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Length</Form.Label>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 17.34" onKeyPress={(e) => onlyDigits(e)} onChange={(e) => setLength(e.target.valueAsNumber)}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Width</Form.Label>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 2.45" onKeyPress={(e) => onlyDigits(e)} onChange={(e) => setWidth(e.target.valueAsNumber)}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Height</Form.Label>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 3.23" onKeyPress={(e) => onlyDigits(e)} onChange={(e) => setHeight(e.target.valueAsNumber)}/>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Text className="text-muted">
                        Enter trailer volume in cubic meters and max weight in kilograms:
                        </Form.Text>
                        <Form.Group as={Col} controlId="formGridText">
                        <Form.Label>Max Load Volume:</Form.Label>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 120" onKeyPress={(e) => onlyDigits(e)} onChange={(e) => {setMaxVolume(e.target.valueAsNumber);}}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridText">
                        <Form.Label>Max Load Weight:</Form.Label>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 25000" onKeyPress={(e) => onlyDigits(e)} onChange={(e) => setMaxWeight(e.target.valueAsNumber)}/>
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3" id="formGridCheckbox">
                        <Form.Check type="checkbox" label="Has sleeping cabin"  onChange={(e) => setHasSleepingCabin(prevValue => !prevValue)}/>
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={(e) => {e.preventDefault(); addTruck();}}>
                        Add Truck
                    </Button>
                </Form>
            </div>
            <div className="divmap">
                <h3>My Trucks</h3>
                <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', flexFlow: 'row wrap'}}>
                    {
                        trucks.map((truck) => (
                            <React.Fragment key={truck.id}>
                                <Truck
                                    licence_plate={truck.licence_plate}
                                    model={truck.model}
                                    length={truck.length}
                                    width={truck.width}
                                    height={truck.height}
                                    max_volume={truck.max_volume}
                                    max_weight={truck.max_weight}
                                    has_sleeping_cabin={truck.has_sleeping_cabin}
                                >
                                </Truck>
                            </React.Fragment>
                        ))
                    }
                </div>
            </div>
        </div>
        
        
    )
}

export default CarrierTrucks;