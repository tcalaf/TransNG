import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import "./../Dashboard.css";
import { auth, db, logout } from "./../../firebase";
import logo from './../../assets/delivery_light.png';
import ClientHeader from "./../Client/ClientHeader";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function NewShipment() {
	const [user, loading, error] = useAuthState(auth);
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const history = useHistory();
    const [startDate, setStartDate] = useState(new Date());
    const [finishDate, setFinishDate] = useState(new Date());

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
				const userRef = await db.collection("users").doc(user?.uid);
				const userSnap = await userRef.get();
				const data = userSnap.data();
				setName(data.name);
				setRole(data.role);
				console.log(data.name);
			} catch (err) {
				console.error(err);
				alert("An error occured while fetching user data");
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
					<Nav.Link href="#settings">Settings</Nav.Link>
					<Nav.Link eventKey={2} href="/contact">Contact</Nav.Link>
					<Nav.Link onClick={logout}>Logout</Nav.Link>
					</Nav>
				</Navbar.Collapse>
				</Container>
			</Navbar>
			<div className="column menu">
                <Form>
                    <h3>New Shipment</h3>
                    <Form.Label>Start Date:</Form.Label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    <Form.Label>Start Max Date:</Form.Label>
                    <br></br>
                    <Form.Text className="text-muted">
                        in case trucks are unavailable for chosen Start Date
                    </Form.Text>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Start Place:</Form.Label>
                        <Form.Control placeholder="e.g.: Bucharest"/>
                    </Form.Group>
                    <Form.Label>Finish Date:</Form.Label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    <Form.Label>Finish Max Date:</Form.Label>
                    <br></br>
                    <Form.Text className="text-muted">
                        in case trucks are unavailable for chosen Finish Date
                    </Form.Text>
                    <DatePicker selected={finishDate} onChange={(date) => setStartDate(date)} />
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Finish Place:</Form.Label>
                        <Form.Control placeholder="e.g.: Constanta"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Goods Type:</Form.Label>
                        <Form.Control placeholder="e.g.: Furniture"/>
                    </Form.Group>
                    <Form.Label>Dimensions</Form.Label>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridText">
                        <Form.Text className="text-muted">
                        weight (in kg):
                        </Form.Text>
                        <Form.Control type="text" placeholder="e.g.: 100" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridText">
                        <Form.Text className="text-muted">
                        volume (in m³):
                        </Form.Text>
                        <Form.Control type="text" placeholder="e.g.: 5" />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Text>length (in m):</Form.Text>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 5" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Text>width (in m):</Form.Text>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 1" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Text>height (in m):</Form.Text>
                        <Form.Control type="number" step="0.01" placeholder="e.g.: 1" />
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Budget (in €):</Form.Label>
                        <Form.Control placeholder="e.g.: 125"/>
                    </Form.Group>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridText">
                        <Form.Label>Contact Mail:</Form.Label>
                        <Form.Control type="text" placeholder="johnsimth@client.com" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridText">
                        <Form.Label>Contact Phone:</Form.Label>
                        <Form.Control type="text" placeholder="+40712345678" />
                        </Form.Group>
                    </Row>

                    <Button variant="primary" type="submit">
                        Add Shipment
                    </Button>
                </Form>
			</div>
		</div>
	);
}
export default NewShipment;