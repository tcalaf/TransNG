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
import UserMap from "../../components/UserMap";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Dashboard() {
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
			<div className="column menu">
				{/* <CarrierSettings email={user?.email} name={name} uid={user?.uid}/> */}
                <Form>
                    <h3>New Trip</h3>
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Truck:</Form.Label>
                        <Form.Control placeholder="B 123 TNG"/>
                    </Form.Group>
                    <Form.Label>Start Date:</Form.Label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Start Place:</Form.Label>
                        <Form.Control placeholder="Bucharest"/>
                    </Form.Group>
                    <Form.Label>Arrival Date:</Form.Label>
                    <DatePicker selected={finishDate} onChange={(date) => setStartDate(date)} />
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Destination:</Form.Label>
                        <Form.Control placeholder="Constanta"/>
                    </Form.Group>
                    <Form.Label>Price per km in €</Form.Label>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridText">
                        <Form.Text className="text-muted">
                        when empty:
                        </Form.Text>
                        <Form.Control type="text" placeholder="0.1" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridText">
                        <Form.Text className="text-muted">
                        when loaded:
                        </Form.Text>
                        <Form.Control type="text" placeholder="0.5" />
                        </Form.Group>
                    </Row>

                    <Button variant="primary" type="submit">
                        Add Trip
                    </Button>
                </Form>
			</div>
			<div className="divmap" style={{backgroundColor:"#ADD8E6"}}>
				<UserMap />
			</div>
		</div>
	);
}
export default Dashboard;