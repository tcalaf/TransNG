import React from 'react';
import Nav from 'react-bootstrap/Nav';

const ClientHeader=()=>{
    return(
        <React.Fragment>
        <Nav.Link href="/chooseoffer">Choose an Offer</Nav.Link>
        <Nav.Link href="/ship/new">New Demand</Nav.Link>
        <Nav.Link href="/contracts">Contracts</Nav.Link>
        </React.Fragment>
    )
}

export default ClientHeader;