import Link from "next/link"
import React, { useEffect, useRef, useState } from "react"
import { Button, Card, Container } from "react-bootstrap"
import styled from "styled-components"
import useAuth from "../hooks/auth"
import configData from '../../config.json';

import config from '../../config.json';

import { 
    InputNumber, 
    Span,
    Small, 
} from "../components/Html";
import { useRouter } from 'next/router';
import Support from '../components/Support';
import AuthUser from '../hooks/AuthUser';
import { withProtected } from "../hooks/RouteProtection"
import MobileNavComponent from "../components/MobileNavComponent"
import Image from "next/image"
import UserBalance from "../components/UserBalance"
import MpesaComponent from "../components/Payments/Mpesa/MpesaComponent"
import AirtelComponent from "../components/Payments/Airtel/AirtelComponent"
import PaypalComponent from "../components/Payments/Paypal/PaypalComponent"
import BitcoinComponent from "../components/Payments/Bitcoin/BitcoinComponent"

const StyleProfile = styled.div`
    // background-color: #fff;
    
    .light-mode {
        background-color: #fff;
        color: #000;
    }
    .dark-mode {
        background-color: #000;
        color: #fff;
    }
    .refresh {
        width: auto;
        padding-right: 8px;
        padding-left: 0px;
        overflow: hidden;
    }
    .amount {
        width: 80px;
        overflow: hidden;
    }
    nav {
        overflow-x: scroll;
        padding-bottom: .4rem;
    }
    button {
        border-radius: 12px;
        padding: .5rem;
    }
    .custom-btn {
        border-radius: 12px;
        border: none;     
        margin: .45rem;     
    }
    .custom-active-btn {       
        box-shadow: 
        2px 2px 3px 0 rgba(255, 255, 255, 0.25),
        -2px -2px 3px 0 rgba(0, 0, 0, 0.3);
    }
    .custom-notactive-btn {
        box-shadow: 
        2px 2px 3px 0 rgba(0, 0, 0, 0.25),
        -2px -2px 3px 0 rgba(255, 255, 255, 0.3);
    }
    .custom-active-container {
        box-shadow: 
        2px 2px 3px 0 rgba(255, 255, 255, 0.25),
        -2px -2px 3px 0 rgba(0, 0, 0, 0.3);
    }
    .user-phone-number h6 {
        max-width: 124px;
        letter-spacing: 2px;
    }
    .user-balance {
        max-width: 124px;
        padding: .5rem;
        border-radius: 12px;
    }
    .deposit-dark-mode button{
        color: #fff;
    }
    .deposit-light-mode button{
        color: #000;
    }
`
const Profile = () => {

    const [displayMode, setDisplayMode] = useState('');
    const router = useRouter()
    const { pathname } = router

    const { logout } = useAuth({ middleware: 'guest' })
    
    const logoutUser = (e) => {
        e.preventDefault()
        logout()
    }

    const checkDisplay = () => {

        const displaySetting = localStorage.getItem('display-mode')

        if(Boolean(displayMode) === false) {
            setDisplayMode(displaySetting)
        }        
    }

    if(Boolean(displayMode) === true) {
        localStorage.setItem('display-mode', displayMode)
    }

    useEffect(() => {
        checkDisplay()
    },[pathname, displayMode])

    return (
        <StyleProfile>
            <div className={displayMode}>
                <Container>
                    <AuthUserProfile />
                    <BalanceComponent 
                     displayMode={displayMode}
                    />
                    <DepositComponent 
                     displayMode={displayMode} 
                    />
                    <WithdrawComponent
                    displayMode={displayMode}
                    />

                    <div className="p-4">
                        <h6>Preferences</h6>
                        <Span>Customise your experience</Span>
                    </div>
                    
                    <PreferenceComponent 
                        setDisplayMode={setDisplayMode}
                        displayMode={displayMode}
                    />
                    <SupportComponent
                        displayMode={displayMode}
                    />

                    <div className="pb-4">
                        <Link href="/logout">
                            <a 
                            itemProp="url" 
                            className="d-block text-decoration-none btn btn-warning btn-sm log-out text-dark fw-bold p-3"
                            onClick={logoutUser}
                            >
                                Logout
                            </a>
                        </Link>
                    </div>
                   
                </Container>      
                <Support/>  
            </div>
            
            <MobileNavComponent  displayMode={displayMode}/>
        </StyleProfile>
    )
}

const AuthUserProfile = () => {

    const positionRef = useRef(null)

    const AuthProfileElement = () => {
            const { uu_id } = AuthUser()
 
            return (
                <div className="user-phone-number d-flex justify-content-center">
                    <h6 className="d-block fw-bold mt-3 custom-btn p-2">
                        {uu_id.phone_number}    
                    </h6>
                </div>                
            )
    }   

    useEffect(() => {
        positionRef.current.focus()
    }, [])

    return (
        <div className="pt-3 pb-2 text-center">
            <button className="custom-btn custom-notactive-btn p-3 text-dark" ref={positionRef}>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="32" 
                    height="32" 
                    fill="currentColor" 
                    className="bi bi-person d-block " 
                    viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
            </button>      
            <AuthProfileElement/>
        </div>
    )
}

const BalanceComponent = ({ displayMode }) => {

    const { uu_id } = AuthUser()

    return (
        <div className
        ={`d-sm-flex justify-content-between 
        shadow-sm p-4 mb-4 ${displayMode === 'dark-mode' ? 'bg-dark' : 'bg-light'} rounded`
        }>
            <div >
                <div className="row align-items-center ">
                    <div className="col" style={{ maxWidth: '30%' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-wallet2" viewBox="0 0 16 16">
                            <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
                        </svg>                      
                    </div>
                    <div className="col d-flex flex-column">
                        <Span className="d-block">Balance</Span>
                        <div className="custom-active-btn user-balance">
                            <UserBalance 
                                displayMode={displayMode} 
                                user_id={uu_id?.id} 
                                type="regular" 
                            />
                        </div>                       
                    </div>
                </div>
            </div>
            <div>
                <div className="row align-items-center">
                    <div className="col" style={{maxWidth: '30%' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-gift" viewBox="0 0 16 16">
                            <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3zM1 4v2h6V4H1zm8 0v2h6V4H9zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5V7zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5H7z"/>
                        </svg>
                    </div>
                    <div className="col d-flex flex-column">
                        <Span className="d-block">Bonus</Span>
                        <Span className="fw-bold d-flex align-items-center justify-content-start" style={{ width: 124 }}>
                            <div className="custom-active-btn user-balance text-white">
                                <UserBalance 
                                    user_id={uu_id?.id} 
                                    type="bonus"
                                    displayMode={displayMode}
                                />
                            </div>  
                        </Span>                    
                    </div>
                </div>      
            </div>         
                
        </div>
    )
}

const DepositComponent = ({ displayMode }) => {

    return (
        <div className={`shadow-sm p-4 mb-4 ${displayMode === 'dark-mode' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
            <h5>Deposit</h5>        
            <DepositOptionsComponent displayMode={displayMode}/>
        </div>
    )
}


const DepositOptionsComponent = ({ displayMode }) => {

    const [depositContainer, setDepositContainer] = useState(config.MPESA_DEPOSIT_OPTION)

    const handleClick = (e) => {
        setDepositContainer(e.target.textContent)
    }

    return (
        <>
            <nav className={`d-flex justify-content-between ${displayMode === 'dark-mode' ? 'deposit-dark-mode' : 'deposit-light-mode'} `}>
                <button 
                className=
                {`btn  
                ${depositContainer === config.MPESA_DEPOSIT_OPTION ? 
                    'custom-btn custom-active-btn' : 
                    'custom-btn custom-notactive-btn'}`} 
                onClick={handleClick}
                >                   
                    {config.MPESA_DEPOSIT_OPTION}
                </button>
                <button 
                className=
                {`btn  
                ${depositContainer === config.AIRTEL_DEPOSIT_OPTION ? 
                    'custom-btn custom-active-btn' : 
                    'custom-btn custom-notactive-btn'}`} 
                onClick={handleClick}
                >
                    {config.AIRTEL_DEPOSIT_OPTION}
                </button>
                <div 
                    className="d-flex align-items-center"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        fill="currentColor" 
                        className="bi bi-paypal" 
                        viewBox="0 0 16 16"
                        style={{ marginRight: 4 }}
                    >
                        <path d="M14.06 3.713c.12-1.071-.093-1.832-.702-2.526C12.628.356 11.312 0 9.626 0H4.734a.7.7 0 0 0-.691.59L2.005 13.509a.42.42 0 0 0 .415.486h2.756l-.202 1.28a.628.628 0 0 0 .62.726H8.14c.429 0 .793-.31.862-.731l.025-.13.48-3.043.03-.164.001-.007a.351.351 0 0 1 .348-.297h.38c1.266 0 2.425-.256 3.345-.91.379-.27.712-.603.993-1.005a4.942 4.942 0 0 0 .88-2.195c.242-1.246.13-2.356-.57-3.154a2.687 2.687 0 0 0-.76-.59l-.094-.061ZM6.543 8.82a.695.695 0 0 1 .321-.079H8.3c2.82 0 5.027-1.144 5.672-4.456l.003-.016c.217.124.4.27.548.438.546.623.679 1.535.45 2.71-.272 1.397-.866 2.307-1.663 2.874-.802.57-1.842.815-3.043.815h-.38a.873.873 0 0 0-.863.734l-.03.164-.48 3.043-.024.13-.001.004a.352.352 0 0 1-.348.296H5.595a.106.106 0 0 1-.105-.123l.208-1.32.845-5.214Z"/>
                    </svg>
                    <button 
                    className=
                    {`btn  
                    ${depositContainer === config.PAYPALL_DEPOSIT_OPTION ? 
                        'custom-btn custom-active-btn' : 
                        'custom-btn custom-notactive-btn'} d-flex align-items-center`} 
                    onClick={handleClick}
                    >
                        {config.PAYPALL_DEPOSIT_OPTION}
                    </button>
                </div>
            
                <div
                    className="d-flex align-items-center"
                >                       
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        fill="currentColor" 
                        className="bi bi-currency-bitcoin" 
                        viewBox="0 0 16 16"
                        style={{ marginRight: 4 }}
                    >
                        <path d="M5.5 13v1.25c0 .138.112.25.25.25h1a.25.25 0 0 0 .25-.25V13h.5v1.25c0 .138.112.25.25.25h1a.25.25 0 0 0 .25-.25V13h.084c1.992 0 3.416-1.033 3.416-2.82 0-1.502-1.007-2.323-2.186-2.44v-.088c.97-.242 1.683-.974 1.683-2.19C11.997 3.93 10.847 3 9.092 3H9V1.75a.25.25 0 0 0-.25-.25h-1a.25.25 0 0 0-.25.25V3h-.573V1.75a.25.25 0 0 0-.25-.25H5.75a.25.25 0 0 0-.25.25V3l-1.998.011a.25.25 0 0 0-.25.25v.989c0 .137.11.25.248.25l.755-.005a.75.75 0 0 1 .745.75v5.505a.75.75 0 0 1-.75.75l-.748.011a.25.25 0 0 0-.25.25v1c0 .138.112.25.25.25L5.5 13zm1.427-8.513h1.719c.906 0 1.438.498 1.438 1.312 0 .871-.575 1.362-1.877 1.362h-1.28V4.487zm0 4.051h1.84c1.137 0 1.756.58 1.756 1.524 0 .953-.626 1.45-2.158 1.45H6.927V8.539z"/>
                    </svg> 
                    <button 
                    className=
                    {`btn  
                    ${depositContainer === config.BITCOIN_DEPOSIT_OPTION ? 
                        'custom-btn custom-active-btn' : 
                        'custom-btn custom-notactive-btn'} d-flex align-items-center`} 
                    onClick={handleClick}
                    >             
                        {config.BITCOIN_DEPOSIT_OPTION}
                    </button>
                </div>
              
                <div className="d-flex align-items-center">
                    <span className="fw-bold rounded-circle" style={{ marginRight: 8 }}>B</span>
                    <button 
                        className=
                        {`btn  
                        ${depositContainer === config.BEYONIC_DEPOSIT_OPTION ? 
                            'custom-btn custom-active-btn' : 
                            'custom-btn custom-notactive-btn'} d-flex align-items-center`} 
                        onClick={handleClick}
                    >
                        {config.BEYONIC_DEPOSIT_OPTION}
                    </button>
                </div>               
            </nav>

            {depositContainer === config.MPESA_DEPOSIT_OPTION &&  <MpesaComponent displayMode={displayMode}/> }
            {depositContainer === config.AIRTEL_DEPOSIT_OPTION &&  <AirtelComponent displayMode={displayMode}/> }
            {depositContainer === config.PAYPALL_DEPOSIT_OPTION &&  <PaypalComponent displayMode={displayMode}/> }
            {depositContainer === config.BITCOIN_DEPOSIT_OPTION &&  <BitcoinComponent displayMode={displayMode}/> }        
            {depositContainer === config.BEYONIC_DEPOSIT_OPTION &&  <ComingSoonPaymentsComponent displayMode={displayMode} option={config.BEYONIC_DEPOSIT_OPTION}/> }        
        </>
    )
}

const ComingSoonPaymentsComponent = ({ option }) => {
    return (
        <Card className="border-0 shadow mt-3 rounded ">
            <Card.Header 
            className=
            { `${option === config.AIRTEL_DEPOSIT_OPTION && 'bg-danger text-white'}
            ${option === config.PAYPALL_DEPOSIT_OPTION && 'bg-success text-white'}
            ${option === config.BITCOIN_DEPOSIT_OPTION && 'bg-warning text-dark'}
            ${option === config.BEYONIC_DEPOSIT_OPTION && 'bg-light text-dark'}
                text-center`}
            >
                <h1 style={{ margin: 0, padding: 0 }} >{option}</h1>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center flex-column align-items-center">
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="64" 
            height="64" 
            fill="currentColor" 
            className="bi bi-hourglass-bottom text-success m-4" 
            viewBox="0 0 16 16"
            >
                <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5zm2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702s.18.149.5.149.5-.15.5-.15v-.7c0-.701.478-1.236 1.011-1.492A3.5 3.5 0 0 0 11.5 3V2h-7z"/>
            </svg>
            <h2>COMING SOON...</h2>
            </Card.Body>           
        </Card>
    )
}


const WithdrawComponent = ({ displayMode }) => {
    
    const { 
        APP_NAME, 
        MINIMUM_WITHDRAW_AMOUNT, 
        MAXIMUM_WITHDRAW_AMOUNT 
    } = configData;

    return (
        <div className={`shadow-sm p-4 mb-4 ${displayMode === 'dark-mode' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
            <h5>Withdraw</h5>
            <Span>Withdraw from your {APP_NAME} wallet:</Span>
            <InputNumber className="d-block form-control p-3" placeholder="Enter amount"/>
            <Small className="d-block text-danger">
                Minimum KES {MINIMUM_WITHDRAW_AMOUNT.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})},
                Maximum KES {MAXIMUM_WITHDRAW_AMOUNT.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})},
            </Small>
            <Button variant="warning w-100">
                Withdraw
            </Button>
        </div>
    )
}

const StyleToggleElement = styled.div`
 .toggle {
    width: 64px;
 }
`
const PreferenceComponent = ({ setDisplayMode, displayMode }) => {

    const changeDisplay = () => {
        if(displayMode === 'light-mode') {
            setDisplayMode('dark-mode')
        }
        if(displayMode === 'dark-mode') {
            setDisplayMode('light-mode')
        }
    }

    const ToggleElement = () => {
        return (
            <StyleToggleElement display="toggle">
                    <div className="d-flex align-items-center toggle" onClick={changeDisplay} display="toggle">
                        {displayMode === 'light-mode' ?
                            <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            fill="currentColor" 
                            className="bi bi-moon-stars-fill float-start" 
                            viewBox="0 0 16 16"
                            onClick={changeDisplay}
                            style={{ zIndex: 2 }}
                            display="toggle-off"
                            >
                                <path display="toggle-off" d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
                                <path display="toggle-off" d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/>
                            </svg> 
                        :
                            <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            fill="currentColor" 
                            className="bi bi-brightness-high-fill float-end text-warning" 
                            viewBox="0 0 16 16"
                            style={{ marginLeft: 30, zIndex:2 }}
                            onClick={changeDisplay}
                            display='toggle-on'
                            >
                                <path display='toggle-on' d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
                            </svg>
                        }
                    </div>  
            </StyleToggleElement>
        )
    }
    return (
        <div className={`shadow-sm p-4 mb-4 ${displayMode === 'dark-mode' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
            <h5>Display</h5>
            <div className="d-flex justify-content-between align-items-center">
                <Span>Switch between light theme and dark theme</Span>
                <ToggleElement/>
            </div>
        </div>
    )
}

const SupportComponent = ({ displayMode }) => {
    return (
        <div className={`shadow-sm p-4 mb-4 ${displayMode === 'dark-mode' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
            <h5>Support</h5>
            <Span className="d-block">Info</Span>
            <Link href="/help">
                <a
                    itemProp="url"
                    className="text-decoration-none fw-bold"
                >   
                    Help and Support
                </a>
            </Link>
        </div>
    )
}

export default withProtected(Profile)
