import React from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

const CarrierHeader=()=>{
    return(
        <React.Fragment>
        <Nav.Link href="/newoffers">New Offers</Nav.Link>
        <Nav.Link href="/trip/new">New Trip</Nav.Link>
        <NavDropdown title="My Transports" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#transport/1">B100TNG Arad-Bucuresti</NavDropdown.Item>
            <NavDropdown.Item href="#transport/2">B200TNG Bucuresti-Constanta</NavDropdown.Item>
            <NavDropdown.Item href="#transport/3">B300TNG Sibiu-Brasov</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Finished Transports</NavDropdown.Item>
        </NavDropdown>
        </React.Fragment>
    )
}

export default CarrierHeader;