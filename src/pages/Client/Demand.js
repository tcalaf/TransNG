import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Card from 'react-bootstrap/Card';

const Demand=(props)=>{
    return(
        <React.Fragment>
            <>
                <Card style={{ width: '20rem', margin: '1rem'}}>
                    <Card.Body>
                        <Card.Title>{props.start_place} → {props.finish_place}</Card.Title>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem>Start Date: {props.start_date}</ListGroupItem>
                        <ListGroupItem>Start Max Date: {props.start_max_date}</ListGroupItem>
                        <ListGroupItem>Finish Date: {props.finish_date}</ListGroupItem>
                        <ListGroupItem>Finish Max Date: {props.finish_max_date}</ListGroupItem>
                        <ListGroupItem>Goods: {props.goods}</ListGroupItem>
                        <ListGroupItem>Goods Weight: {props.goods_weight}kg</ListGroupItem>
                        <ListGroupItem>Goods Volume: {props.goods_volume}m³</ListGroupItem>
                        <ListGroupItem>Goods Length: {props.goods_length}m</ListGroupItem>
                        <ListGroupItem>Goods Width: {props.goods_width}m</ListGroupItem>
                        <ListGroupItem>Goods Height: {props.goods_height}m</ListGroupItem>
                        <ListGroupItem>Budget: {props.max_budget}</ListGroupItem>
                        <ListGroupItem>Contact Mail: {props.contact_mail}</ListGroupItem>
                        <ListGroupItem>Contact Place: {props.contact_phone}</ListGroupItem>
                        <ListGroupItem>Supply ID: {props.supply_id}</ListGroupItem>
                    </ListGroup>
                    <Card.Body>
                        <Card.Link href="#">Select</Card.Link>
                    </Card.Body>
                </Card>
            </>
        </React.Fragment>
    )
}

export default Demand;