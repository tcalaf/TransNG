import React from 'react';
import Nav from 'react-bootstrap/Nav';

const AdminHeader=()=>{
    return (
        <React.Fragment>
        <Nav.Link href="#ship">Admin Ship</Nav.Link>
        <Nav.Link href="#shipments">Admin My Shipments</Nav.Link>
        </React.Fragment>
    )
}

export default AdminHeader;