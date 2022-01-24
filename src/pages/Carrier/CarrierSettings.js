import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {db} from "../../firebase";
import Truck from './Truck'

const CarrierSettings=(props)=>{
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
        db.collection("users").doc(props.uid).collection("trucks").add({
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
        async function fetchData() {
            try {
                const userRef = await db.collection("users").doc(props.uid);
                const userSnap = await userRef.get();
                setPhone(userSnap.data().phone);

                const trucksCollectionRef = db.collection("users").doc(props.uid).collection("trucks");
                const trucksSnap = await trucksCollectionRef.get();
                const allTrucks = trucksSnap.docs.map(truckDoc => ({
                    ...truckDoc.data(),
                    id: truckDoc.id,
                }));
                setTrucks(allTrucks);

                console.log(phone);
                console.log(trucks);
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

export default CarrierSettings;