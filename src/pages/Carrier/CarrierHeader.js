import React from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

const CarrierHeader=()=>{
    return(
        <React.Fragment>
        <Nav.Link href="/trucks">Trucks</Nav.Link>
        <Nav.Link href="/choosedemand">Choose a Demand</Nav.Link>
        <Nav.Link href="/offer/new">New Offer</Nav.Link>
        <Nav.Link href="/contracts">Contracts</Nav.Link>
        </React.Fragment>
    )
}

export default CarrierHeader;