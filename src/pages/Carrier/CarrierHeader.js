import React from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

const CarrierHeader=()=>{
    return(
        <React.Fragment>
        <Nav.Link href="/newoffers">New Offers</Nav.Link>
        <Nav.Link href="/trip/new">New Trip</Nav.Link>
        <Nav.Link href="/contracts">Contracts</Nav.Link>
        </React.Fragment>
    )
}

export default CarrierHeader;