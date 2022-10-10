import Link from "next/link"
import React, { useEffect, useRef, useState } from "react"
import { Button, Card, Container, Spinner } from "react-bootstrap"
import styled from "styled-components"
import useAuth from "../hooks/auth"
import { useGetBalanceByUserIdQuery } from "../hooks/balance"
import configData from '../../config.json';
import generateTimestamp from "../hooks/generateTimestamp";
import generateBase64Encoding from "../hooks/generateBase64Encoding"
import config from '../../config.json';

import { 
    InputNumber, 
    Span,
    Small, 
} from "../components/Html";
import axios from "../lib/axios"
import { useRouter } from 'next/router';
import Support from '../components/Support';
import AuthUser from '../hooks/AuthUser';
import { withProtected } from "../hooks/RouteProtection"
import MobileNavComponent from "../components/MobileNavComponent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRefresh } from "@fortawesome/free-solid-svg-icons"
import Image from "next/image"

const StyleProfile = styled.div`
    background-color: #fff;
    padding-bottom: 24px;

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
`

const Profile = () => {

    const router = useRouter()
    const { pathname } = router

    const { logout } = useAuth({ middleware: 'guest' })
   
    const logoutUser = (e) => {
        e.preventDefault()
        logout()
    }

    useEffect(() => {
        
    },[pathname])
    return (
        <StyleProfile>
            <Container >
                <AuthUserProfile />
                <BalanceComponent />
                <DepositComponent />
                <WithdrawComponent/>

                <div className="p-4">
                    <h6>Preferences</h6>
                    <Span>Customise your experience</Span>
                </div>
                
                <PreferenceComponent/>
                <SupportComponent/>

                <Link href="/logout">
                    <a 
                    itemProp="url" 
                    className="d-block text-decoration-none btn btn-warning btn-sm log-out text-dark fw-bold p-3"
                    onClick={logoutUser}
                    >
                        Logout
                    </a>
                </Link>

            </Container>      
            <Support/>  
            <MobileNavComponent/>
        </StyleProfile>
    )
}

const AuthUserProfile = () => {

    const positionRef = useRef(null)

    const AuthProfileElement = () => {
            const { uu_id } = AuthUser()
 
            return (
                 <h6 className="d-block fw-bold mt-3">
                  {uu_id.phone_number}    
                 </h6>
            )
    }   

    useEffect(() => {
        positionRef.current.focus()
    }, [])

    return (
        <div className="pt-3 pb-2 text-center">
            <button className="btn btn-light rounded-pill p-3 text-dark" ref={positionRef}>
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

const BalanceComponent = () => {

    const BalanceElement = () => {
            const { uu_id } = AuthUser()
            const { data, error, isLoading, refetch } = useGetBalanceByUserIdQuery(uu_id.id)

            const insertTransaction = () => {
                refetch()
            }

            if(error) {
                return <span className="d-block fw-bold text-danger mt-1">Error</span>
            }
        
            if(isLoading) {
                return <Spinner className="d-block mt-2 pb-3" animation="grow" size="sm"/>
            }
            return (
                <Span className="fw-bold d-flex align-items-center justify-content-start" style={{ width: 124 }}>
                    <div className="refresh btn btn-sm" onClick={insertTransaction}>
                        <FontAwesomeIcon  icon={faRefresh} />
                    </div>
                    <span className="text-dark amount">
                        Kes {data?.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}    
                    </span>        
                </Span>
            )
    
    
    }
    
    return (
        <div className="d-sm-flex justify-content-between shadow-sm p-4 mb-4 bg-light rounded ">
            <div >
                <div className="row align-items-center ">
                    <div className="col" style={{ width: 32 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-wallet2" viewBox="0 0 16 16">
                            <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
                        </svg>                      
                    </div>
                    <div className="col d-flex flex-column">
                        <Span className="d-block">Balance</Span>
                        <BalanceElement />
                    </div>
                </div>
            </div>
            <div>
                <div className="row align-items-center">
                    <div className="col" style={{ width: 32 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-gift" viewBox="0 0 16 16">
                            <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3zM1 4v2h6V4H1zm8 0v2h6V4H9zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5V7zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5H7z"/>
                        </svg>
                    </div>
                    <div className="col d-flex flex-column">
                        <Span className="d-block">Balance</Span>
                        <Span className="fw-bold d-flex align-items-center justify-content-start" style={{ width: 124 }}>
                            <div className="refresh btn btn-sm" >
                                <FontAwesomeIcon  icon={faRefresh} />
                            </div>
                            <span className="text-dark amount">
                                Kes 0.00
                            </span>  
                        </Span>                    
                    </div>
                </div>      
            </div>         
                
        </div>
    )
}

const DepositComponent = () => {

    return (
        <div className="shadow-sm p-4 mb-4 bg-light">
            <h5>Deposit</h5>        
            <DepositOptionsComponent/>
        </div>
    )
}

const DepositOptionsComponent = () => {

    const [depositContainer, setDepositContainer] = useState(config.MPESA_DEPOSIT_OPTION)

    const handleClick = (e) => {
        setDepositContainer(e.target.textContent)
    }

    return (
        <>
            <nav className="d-sm-flex">
                <button 
                className=
                {` btn  ${depositContainer === config.MPESA_DEPOSIT_OPTION ? 'rounded-pill btn-success shadow' : 'rounded btn-primary'} m-1`} 
                onClick={handleClick}
                >                   
                    {config.MPESA_DEPOSIT_OPTION}
                </button>
                <button 
                className=
                {`btn  ${depositContainer === config.AIRTEL_DEPOSIT_OPTION ? 'rounded-pill btn-secondary shadow' : 'rounded btn-primary'} m-1`} 
                onClick={handleClick}
                >
                    {config.AIRTEL_DEPOSIT_OPTION}
                </button>
                <button 
                className=
                {`btn  ${depositContainer === config.PAYPALL_DEPOSIT_OPTION ? 'rounded-pill btn-success shadow' : 'rounded btn-primary'} m-1`} 
                onClick={handleClick}
                >
                    {config.PAYPALL_DEPOSIT_OPTION}
                </button>
                <button 
                className=
                {`btn  ${depositContainer === config.BITCOIN_DEPOSIT_OPTION ? 'rounded-pill btn-warning shadow' : 'rounded btn-primary'} m-1`} 
                onClick={handleClick}
                >
                    {config.BITCOIN_DEPOSIT_OPTION}
                </button>
                <button 
                className=
                {`btn  ${depositContainer === config.BEYONIC_DEPOSIT_OPTION ? 'rounded-pill btn-dark shadow' : 'rounded btn-primary'} m-1`} 
                onClick={handleClick}
                >
                    {config.BEYONIC_DEPOSIT_OPTION}
                </button>
            </nav>
            {depositContainer === config.MPESA_DEPOSIT_OPTION ?  <MpesaDeposit/> : <ComingSoonPaymentsComponent option={depositContainer} />}
           
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
            ${option === config.BEYONIC_DEPOSIT_OPTION && 'bg-dark text-white'}
                text-center`}
            >
                <h1 style={{ margin: 0, padding: 0 }}>{option}</h1>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center flex-column align-items-center">
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="64" 
            height="64" 
            fill="currentColor" 
            className="bi bi-hourglass-bottom" 
            viewBox="0 0 16 16"
            >
                <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1-.5-.5zm2.5.5v1a3.5 3.5 0 0 0 1.989 3.158c.533.256 1.011.791 1.011 1.491v.702s.18.149.5.149.5-.15.5-.15v-.7c0-.701.478-1.236 1.011-1.492A3.5 3.5 0 0 0 11.5 3V2h-7z"/>
            </svg>
               
            </Card.Body>
            <Card.Footer 
            className=
            { `
            ${option === config.AIRTEL_DEPOSIT_OPTION && 'bg-danger text-white'} 
            ${option === config.PAYPALL_DEPOSIT_OPTION && 'bg-success text-white'}
            ${option === config.BITCOIN_DEPOSIT_OPTION && 'bg-warning text-dark'}
            ${option === config.BEYONIC_DEPOSIT_OPTION && 'bg-dark text-white'}
            text-center`}
            >
                <h2>COMING SOON</h2>
            </Card.Footer>
        </Card>
    )
}

const MpesaDeposit = () => {
    const [authToken, setAuthToken] = useState('')

    const { uu_id } = AuthUser()
 
    const { APP_NAME, MINIMUM_DEPOSIT_AMOUNT } = configData;

    const [depositAmount, setDepositAmount] = useState(configData.MINIMUM_DEPOSIT_AMOUNT);
    const [depositLoading, setDepositLoading] = useState(false)

    const updateDepositAmount = (e) => {
        e.preventDefault()
        const depositAmt = Number(e.target.value)
        setDepositAmount(depositAmt)
    }

    const incrementDepositAmount = (e) => {
        const incrementAmt = Number(e.target.getAttribute('inc'))
        
        if(incrementAmt === 100) {
          setDepositAmount(depositAmount + configData.INCREMENT_DEPOSIT_100)
        }
        if(incrementAmt === 250) {
          setDepositAmount(depositAmount + configData.INCREMENT_DEPOSIT_250)
        }
        if(incrementAmt === 500) {
          setDepositAmount(depositAmount + configData.INCREMENT_DEPOSIT_500)
        }
        if(incrementAmt === 1000) {
          setDepositAmount(depositAmount + configData.INCREMENT_DEPOSIT_1000)
        }
        if(incrementAmt === 5000) {
          setDepositAmount(depositAmount + configData.INCREMENT_DEPOSIT_5000)
        }
    }

    const deposit = async () => {
        setDepositLoading(true)
        const short_code = config.BUSINESS_SHORT_CODE;
        const passkey = config.BUSINESS_PASSKEY;
        const timestamp = generateTimestamp().toString();
        const phone_number = Number(uu_id.phone_number)
        const password = generateBase64Encoding(short_code, passkey, timestamp);

        if(authToken) {
           const res = await axios.post('api/mpesa/push', {
                token: authToken,
                phone_number,
                timestamp,
                amount: depositAmount         
            })

           if(res.status === 200) {
            setTimeout(() => {
                setDepositLoading(false)
            }, 3000)
           }
        }
    
    }

    const mpesaAuth = async () => {
        const res = await axios.get('api/mpesa/auth')
        if(res.status === 200) {
            setAuthToken(res.data.access_token)
        }
     
        return res
    }

    const enableDepositButton = () => setDepositLoading(false)

    useEffect(() => {
        mpesaAuth()         
    }, [])


    return (
        <Card className="border-0 shadow mt-3 rounded">
            <Card.Header className="d-flex justify-content-center bg-white border-0" style={{ margin: 0, paddingTop: '1rem', paddingBottom: '.5rem' }}>
                <Image src="https://www.pinaclebet.com/mpesa.jpeg" width={72} height={72} />
            </Card.Header>
            <Card.Body style={{ paddingTop: 0 }}>
                <Span className="d-block">Send money into your {APP_NAME} account</Span>
                <button 
                inc={configData.INCREMENT_DEPOSIT_100} 
                onClick={incrementDepositAmount} modalid="modal-ref" 
                className='btn btn-secondary btn-sm rounded-pill fw-bold m-1 mb-2'
                >
                + {configData.INCREMENT_DEPOSIT_100}
                </button>       
                <button 
                inc={configData.INCREMENT_DEPOSIT_250} 
                modalid="modal-ref" 
                onClick={incrementDepositAmount} 
                className='btn btn-secondary btn-sm rounded-pill fw-bold m-1 mb-2'
                >
                + {configData.INCREMENT_DEPOSIT_250}
                </button>       
                <button 
                inc={configData.INCREMENT_DEPOSIT_500} 
                modalid="modal-ref" 
                onClick={incrementDepositAmount} 
                className='btn btn-secondary btn-sm rounded-pill fw-bold m-1 mb-2'
                >
                + {configData.INCREMENT_DEPOSIT_500}
                </button>       
                <button 
                inc={configData.INCREMENT_DEPOSIT_1000} 
                modalid="modal-ref" 
                onClick={incrementDepositAmount} 
                className='btn btn-secondary btn-sm rounded-pill fw-bold m-1 mb-2'
                >
                + {configData.INCREMENT_DEPOSIT_1000}
                </button>      
                <button 
                inc={configData.INCREMENT_DEPOSIT_5000} 
                modalid="modal-ref" onClick={incrementDepositAmount} 
                className='btn btn-secondary btn-sm rounded-pill fw-bold m-1 mb-2'
                >
                + {configData.INCREMENT_DEPOSIT_5000}
                </button>   
                {depositLoading ? <Small className="d-block text-danger">
                    Check Mpesa prompt and proceed
                </Small> : ''}  
            
                <InputNumber 
                    className="d-block form-control p-3" 
                    placeholder={depositAmount}
                    onChange={updateDepositAmount}
                />
                <Small className="d-block text-danger">
                    Minimum KES {MINIMUM_DEPOSIT_AMOUNT.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </Small>
          
            </Card.Body>
            <Card.Footer>
                <div className="text-center">
                    <Button variant="warning" onClick={deposit} disabled={depositLoading || true}>
                        { depositLoading ? 'Loading...' : 'Deposit'}
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    )
}

const WithdrawComponent = () => {
    
    const { 
        APP_NAME, 
        MINIMUM_WITHDRAW_AMOUNT, 
        MAXIMUM_WITHDRAW_AMOUNT 
    } = configData;

    return (
        <div className="shadow-sm p-4 mb-4 bg-light">
            <h5>Withdraw</h5>
            <Span>Withdraw from your {APP_NAME} wallet</Span>
            <InputNumber className="d-block form-control p-3" placeholder="Enter amount"/>
            <Small className="d-block text-danger">
                Minimum KES {MINIMUM_WITHDRAW_AMOUNT.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})},
                Maximum KES {MAXIMUM_WITHDRAW_AMOUNT.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})},
            </Small>
            <Button variant="warning">
                Withdraw
            </Button>
        </div>
    )
}

const PreferenceComponent = () => {
    return (
        <div className="shadow-sm p-4 mb-4 bg-info">
            <h5>Display</h5>
            <Span>Switch between light theme and dark theme</Span>
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            fill="currentColor" 
            className="bi bi-moon-stars-fill float-end" 
            viewBox="0 0 16 16"
            >
                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
                <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/>
            </svg>
            {/* Dark Theme Icon */}
            {/* <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            fill="currentColor" 
            className="bi bi-brightness-high-fill float-end text-warning" 
            viewBox="0 0 16 16">
                <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
            </svg> */}
        </div>
    )
}

const SupportComponent = () => {
    return (
        <div className="shadow-sm p-4 mb-4">
            <h5>Support</h5>
            <Span className="text-secondary d-block">Info</Span>
            <Link href="/help">
                <a
                    itemProp="url"
                    className="text-decoration-none text-dark fw-bold"
                >   
                    Help and Support
                </a>
            </Link>
        </div>
    )
}

export default withProtected(Profile)
