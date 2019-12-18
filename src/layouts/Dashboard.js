import React, { Component } from 'react'

import {
    Navbar, NavbarBrand, Nav, NavItem, NavLink
} from 'shards-react'

export default class Dashboard extends Component {
    render() {
        return (
            <>
                <Navbar type="dark" theme="primary" expand="md">
                    <NavbarBrand>ParquiDigital</NavbarBrand>

                    <Nav navbar>
                        <NavItem>
                            <NavLink href="/parking-fee">
                                Tarifas y lugares
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/active-parked-cars">
                                Autos estacionados
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
                { this.props.children }
            </>
        )
    }
}
