import React from "react";
import styled from 'styled-components';

import NavBar from './NavBar';
import Footer from './Footer';

const PageStyles = styled('div')`
background: #444;
height: 100vh;
`

const ContentStyled = styled('div')`
background: #444;
height: auto;
font-style: normal;
font-weight: 200;
border-bottom: 1px solid gray;
`

export default function NavWrapper({ children, logout, login }) {
    return (
        <PageStyles>
            <NavBar logout={logout} login={login} />   
            <ContentStyled>{children}</ContentStyled>
            <Footer/>
        </PageStyles>
    )
}
