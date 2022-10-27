import React, { useEffect, useState } from "react";
import styled from 'styled-components';

import NavBar from './NavBar';
import Footer from './Footer';

const PageStyles = styled('div')`
.dark-mode {
    background: #000;
}
.light-mode {
    background: #ebeded;
}
.light-nav-mode {
    background: #191970;
}
height: 100vh;
`

const ContentStyled = styled('div')`
height: auto;
font-style: normal;
font-weight: 200;
border-bottom: 1px solid gray;
`

export default function NavWrapper({ children, logout, login }) {
    const [displayMode, setDisplayMode] = useState('')

    useEffect(() => {
        setDisplayMode(localStorage.getItem('display-mode'))
        window.addEventListener('click', (e) => {
            if(e.target.getAttribute('display') === 'toggle-off' || 
                e.target.getAttribute('display') === 'toggle-on'
            ) {
                setDisplayMode(localStorage.getItem('display-mode'))
            };      
        })
    }, [displayMode])
  
    return (
        <PageStyles>
            <div className={`${displayMode === 'dark-mode' ? 'dark-mode' : 'light-mode'}`}>
                <NavBar logout={logout} login={login} />   
                <ContentStyled>{children}</ContentStyled>
                <Footer displayMode={displayMode}/>
            </div>        
        </PageStyles>
    )
}
