import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Card from 'react-bootstrap/Card';

const Demand=(props)=>{
    return(
        <React.Fragment>
            <>
                <Card style={{ width: '20rem', margin: '1rem'}}>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem>Price: {props.price}</ListGroupItem>
                        <ListGroupItem>Special Instructions: {props.special_instructions}</ListGroupItem>
                        <ListGroupItem>Payment Deadline: {props.payment_ddl}</ListGroupItem>
                        <ListGroupItem>Demand ID: {props.demand_id}</ListGroupItem>
                        <ListGroupItem>Supply ID: {props.supply_id}</ListGroupItem>
                        <ListGroupItem>Demand UID: {props.demand_uid}</ListGroupItem>
                        <ListGroupItem>Supply UID: {props.supply_uid}</ListGroupItem>
                    </ListGroup>
                </Card>
            </>
        </React.Fragment>
    )
}

export default Demand;