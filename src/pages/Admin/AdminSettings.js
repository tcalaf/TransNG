import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {db} from "../../firebase";
import firebase from "firebase/compat/app"

const AdminSettings=({name, phone, email, uid})=>{
    const [newName, setNewName] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [goods, setGoods] = useState("");

    const updateName = async (newName) => {
        const userRef = db.collection("users").doc(uid);
        userRef.update({
            name: newName
        })
        .then(() => {
            console.log("Name successfully updated!" + " " + newName);
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    const updatePhone = async (newPhone) => {
        const userRef = db.collection("users").doc(uid);
        userRef.update({
            phone: newPhone
        })
        .then(() => {
            console.log("Phone successfully updated!" + " " + newPhone);
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    const changeUserData = async () => {
        console.log("name: " + name);
        console.log("phone: "+ phone);
        console.log("NEWname: " + newName);
        console.log("NEWphone: "+ newPhone);
        (newName !== name && newName !== "") ? updateName(newName) : console.log("Name didn't change");
        (newPhone !== phone && newPhone !== "") ? updatePhone(newPhone) : console.log("Phone didn't change");
    }    

	const addGoods = () => {
        if (goods === "") {
            alert("Enter goods");
            return;
        }

        const goodsRef = db.collection("utilities").doc("goods");
        goodsRef.update({
            goods: firebase.firestore.FieldValue.arrayUnion(goods)
        })
	}

    return(
        <Form>
        <h2>Settings</h2>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                <Form.Text className="text-muted">
                You currently have an Admin Account.
                </Form.Text>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                Email
                </Form.Label>
                <Col sm="10">
                <Form.Control plaintext readOnly defaultValue={email} />
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
                <Form.Control onChange={(e) => setNewName(e.target.value)} type="text" defaultValue={name} />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                Phone
                </Form.Label>
                <Col sm="10">
                {
                    phone === "" ? (
                        <Form.Control onChange={(e) => setNewPhone(e.target.value)} type="text" placeholder="ex: +40712345678 (optional)" />
                    ) : (
                        <Form.Control onChange={(e) => setNewPhone(e.target.value)} type="text" defaultValue={phone} />
                    )
                }
                </Col>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={(e) => {e.preventDefault(); changeUserData();}}>
                Save
            </Button>

            <Form.Group className="mb-3" controlId="formGridAddress1">
                <Form.Label>Goods type:</Form.Label>
                <Form.Control placeholder="e.g.: electronics" onChange={(e) => setGoods(e.target.value)}/>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={(e) => {e.preventDefault(); addGoods();}}>
                Add Goods
            </Button>
        </Form>
    )
}

export default AdminSettings;