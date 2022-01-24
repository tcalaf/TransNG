import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {db} from "../../firebase";

const ClientSettings=(props)=>{
    const [phone, setPhone] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const userRef = await db.collection("users").doc(props.uid);
                const userSnap = await userRef.get();
                setPhone(userSnap.data().phone);
                console.log(phone);
            } catch (err) {
                console.error(err);
            }          
        };
        fetchData();
    }, [])


    return(
        <Form>
        <h2>Settings</h2>
            <Button variant="primary" type="submit">
                Switch to Carrier Account
            </Button>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                <Form.Text className="text-muted">
                You currently have a Client Account.
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
                <Form.Control type="text" defaultValue={props.name} />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                Phone
                </Form.Label>
                <Col sm="10">
                {
                    phone === "" ? (
                        <Form.Control type="phone" placeholder="ex: +40712345678 (optional)" />
                    ) : (
                        <Form.Control type="phone" defaultValue={phone} />
                    )
                }
                </Col>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={() => console.log("Hey")}>
                Save
            </Button>
        </Form>
    )
}

export default ClientSettings;