import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap';

const Supply=(props)=>{

    return(
        <React.Fragment>
            <>
                <Card bg={ props.selected ? "warning" : "light" } style={{ width: '20rem', margin: '1rem'}}>
                    <Card.Body>
                        <Card.Title>Truck ID: {props.id_truck}</Card.Title>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem>ID: {props.id}</ListGroupItem>
                        <ListGroupItem>Start Date: {props.start_date}</ListGroupItem>
                        <ListGroupItem>Start Place: {props.start_place}</ListGroupItem>
                        <ListGroupItem>Finish Date: {props.finish_date}</ListGroupItem>
                        <ListGroupItem>Finish Place: {props.finish_place}</ListGroupItem>
                        <ListGroupItem>Empty Price per Km: {props.empty_price_per_km}</ListGroupItem>
                        <ListGroupItem>Full Price per Km: {props.full_price_per_km}</ListGroupItem>
                        <ListGroupItem>Contact Mail: {props.contact_mail}</ListGroupItem>
                        <ListGroupItem>Contact Phone: {props.contact_phone}</ListGroupItem>
                        {props.cost !== null && <ListGroupItem>Cost: {props.cost}</ListGroupItem>}
                    </ListGroup>
                    <Button variant="primary" onClick={props.onSelect}>Select</Button>
                </Card>
            </>
        </React.Fragment>
    )
}

export default Supply;