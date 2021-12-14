import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const CarrierSettings=(props)=>{
    return(
        <Form>
        <h2>Settings</h2>
            <Button variant="primary" type="submit">
                Switch to Client Account
            </Button>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                <Form.Text className="text-muted">
                You currently have a Carrier Account.
                </Form.Text>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                Email
                </Form.Label>
                <Col sm="10">
                <Form.Control plaintext readOnly defaultValue={props.email} />
                </Col>
                <Form.Text className="text-muted">
                You cannot change account email.
                </Form.Text>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                Name
                </Form.Label>
                <Col sm="10">
                <Form.Control type="email" defaultValue={props.name} />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                Phone
                </Form.Label>
                <Col sm="10">
                <Form.Control type="phone" placeholder="+40712345678 (optional)" />
                </Col>
            </Form.Group>

            <Button variant="primary" type="submit">
                Save
            </Button>
            
            <h3>My Trucks</h3>
            <p>TODO: Show added trucks here</p>

            <h3>New Truck</h3>
            <Form.Group className="mb-3" controlId="formGridAddress1">
                <Form.Label>Truck Model:</Form.Label>
                <Form.Control placeholder="2021 Volvo FH16, D16 Engine, 650 HP" />
            </Form.Group>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridText">
                <Form.Label>Driver Name:</Form.Label>
                <Form.Control type="text" defaultValue={props.name} />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridText">
                <Form.Label>Driver Phone:</Form.Label>
                <Form.Control type="text" placeholder="+40712345678" />
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Text className="text-muted">
                Enter trailer dimensions in meters:
                </Form.Text>
                <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Length</Form.Label>
                <Form.Control type="text" placeholder="e.g.: 17,25" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Width</Form.Label>
                <Form.Control type="text" placeholder="e.g.: 2,45" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Height</Form.Label>
                <Form.Control type="text" placeholder="e.g.: 3,85" />
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Text className="text-muted">
                Enter trailer volume in cubic meters and max weight in kilograms:
                </Form.Text>
                <Form.Group as={Col} controlId="formGridText">
                <Form.Label>Max Load Volume:</Form.Label>
                <Form.Control type="text" placeholder="e.g.: 120" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridText">
                <Form.Label>Max Load Weight:</Form.Label>
                <Form.Control type="text" placeholder="e.g.: 25000" />
                </Form.Group>
            </Row>
            <Form.Group className="mb-3" id="formGridCheckbox">
                <Form.Check type="checkbox" label="Has sleeping cabin" />
            </Form.Group>

            <Button variant="primary" type="submit">
                Add Truck
            </Button>
        </Form>
    )
}

export default CarrierSettings;