import React from "react";
import styled from 'styled-components';


// import NavBar from './NavBar';
import Footer from './Footer';

const PageStyles = styled('div')`
   background: #000;
`

const ContentStyled = styled('div')`
background: #000;
font-style: normal;
font-weight: 200;
`

export default function NavWrapper({ children }) {
    
    return (
        <PageStyles>
            {/* <NavBar/> */}
            <ContentStyled>{children}</ContentStyled>
            <Footer/>
        </PageStyles>
    )
}
