import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Card from 'react-bootstrap/Card';

const Truck=(props)=>{
    return(
        <React.Fragment>
            <>
                <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>{props.model}</Card.Title>
                    <Card.Text>{props.licence_plate}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroupItem>Length: {props.length}m</ListGroupItem>
                    <ListGroupItem>Width: {props.width}m</ListGroupItem>
                    <ListGroupItem>Height: {props.height}m</ListGroupItem>
                    <ListGroupItem>Max Load Volume: {props.width}m³</ListGroupItem>
                    <ListGroupItem>Max Load Weight: {props.height}kg</ListGroupItem>
                    {
                        props.has_sleeping_cabin === true ? (
                            <ListGroupItem>Has Sleeping Cabin: Yes</ListGroupItem>
                        ) :  (						
                            <ListGroupItem>Has Sleeping Cabin: No</ListGroupItem>
                        )
                    }
                </ListGroup>
                <Card.Body>
                    <Card.Link href="#">Edit</Card.Link>
                    <Card.Link href="#" style={{ color: 'red' }}>Delete</Card.Link>
                </Card.Body>
                </Card>
                <p></p>
            </>
        </React.Fragment>
    )
}

export default Truck;