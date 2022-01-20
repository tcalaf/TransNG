import React from 'react';
import Nav from 'react-bootstrap/Nav';

const ClientHeader=()=>{
    return(
        <React.Fragment>
        <Nav.Link href="/ship/new">Ship</Nav.Link>
        <Nav.Link href="#shipments">My Shipments</Nav.Link>
        </React.Fragment>
    )
}

export default ClientHeader;