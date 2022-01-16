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
            
            <p></p>
            <h3>My Trucks</h3>
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
    )
}

export default CarrierSettings;