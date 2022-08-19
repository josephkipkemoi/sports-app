import React, { useEffect, useState } from "react";
import Link from "next/link";
import styledComponents from "styled-components";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import useClickOutside from "../hooks/useClickOutside";
import useAuth from "../hooks/auth";
import  Col  from "react-bootstrap/Col";
import  Row  from "react-bootstrap/Row";
import Image from "next/image";
import { useRouter } from "next/router";
import { SearchComponent } from "./CustomFilter";
import CurrentTime from "./CurrentTime";
import { PersonSvgIcon } from "./Svg";

const StyledTopRightNav = styledComponents.div`
.right-nav-link {
    display: inline-flex;
    position: absolute;
    margin-top: -15px;
    right: 10.5px; 
    font-weight: 350;
}

nav {
    background-color: #333;
    
}
nav a {
    color: #9c9c9c;
    transition: .3s;
}
nav a:hover, a:active {
    color: #fff;
}
@media screen and (max-width: 992px) {
    .right-nav-link a{
       margin-left: 6px;
    }
     
}
`
const topNavLinks = [
    {
        name: 'Sports',
        path: '/soccer'
    },
    {
        name: 'Jackpot',
        path: '/jackpot'
    },
    {
        name: 'Livescore',
        path: '/live'
    },
    {
        name: 'Results',
        path: '/results'
    },
    {
        name: '',
        path: '/',
        links: [
            {
                name: 'Responsible Gambling',
                path: '/responsible-gambling'
            },
            {
                name: 'Help',
                path: '/FAQ'
            }
        ]
    }
]

export default function NavBar({ logout, login, user }) {

    const TopNavLinkElements = (link, i) => (        
        <div itemProp="name" key={i} className="nav-item">        
            <Link key={i} href={link.path} prefetch={false} >
                <a 
                    itemProp="url"
                    className="fnt-sze nav-link"
                >
                    {link.name}
                </a>
            </Link>
            {link.links && (
                <div className="right-nav-link">{link.links.map(TopNavLinkElements)}</div>
            )}
        </div>
    )

    return (
        <>
        <StyledTopRightNav>
        <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <Link href="/">
                        <a className="navbar-brand text-light bg-success rounded p-2 d-flex" itemProp="url">
                            <Image src="/logo.png" width="48" height="24"/>
                        </a>
                    </Link>
                    <button className="navbar-toggler bg-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon "></span>
                    </button>
                   
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <div className="navbar-nav me-auto mb-2 mb-lg-0">                            
                            {topNavLinks.map(TopNavLinkElements)}
                        </div>
                    </div>
                    
                </div>
        </nav>
        </StyledTopRightNav>
        <BottomNavBar logout={logout} login={login} user={user}/>
        </>
    )
}

const midnavLinks = [
    {
        name: 'Sports',
        path: '/soccer',
        class: 'sports'
    },
    {
        name: 'Live Games',
        path: '/live',
        class: 'live-games'
    },
]

const unauthLinks = [
    {
        name: 'search',
        path: '/search',
    },
    {
        name: 'Join',
        path: '/register',
        class: 'join',
    },
    {
        name:'Log In',
        path: '/login',
    }
]

const StyleBottomNavBar = styledComponents.div`
   .join {
       background-color: #ffdf1b;
       padding: 6px;
       border-radius: 6px;
       margin-top: -4px;
       margin-right: 12px;
       margin-left: 12px;
       color: black;
   }
   .hide {
    display: none;
    }
    .live-games {
        width: 100px;
    }
   nav a {
       color: #fff;
   }

    nav {
        background-color: #126e51;
    }
    .nav-link  {
        margin-left: 24px;
    }
 
    @media screen and (max-width: 570px) {
        .custom-mx-auto {
             margin: 0 !important;
        }
        .nav-link {
            margin-left: 12px;
        }
    }
    @media screen and (max-width: 570px) {      
        .sports {
            display: none;
        }
        .live-games {
            display: none;
        }
        .align-right {
            top: 56px;
        }
        .mobile {
            display: none; 
        }
        .time {
           position: absolute;
           margin-top: 35px ;
        }
    }

  
`
const StyleAuthenticated = styledComponents.div`
 span {
     color: ${props => props.theme.colors.primaryLight};
     margin-right: 3px;
 }
 a {
    line-height: 18px; 
 }

.log-out {
    margin-right: -5px;
}
 
`
const StyleAuthenticatedMobile = styledComponents.div`
display: flex;
@media screen and (max-width: 990px) {
     display: none;
  }
`
 
export const BottomNavBar = ({ login, user }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isDepositModalOpen, setDepositModalOpen] = useState(false)

    const [userDetails, setUserDetails] = useState({
        phone_number: '',
        password: '',
    })

    const { phone_number, password } = userDetails;

    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(null);
    const [isAuth, setIsAuth] = useState(false)

    const handleUser = (e) => setUserDetails(prev => ({ ...prev, [e.target.name] : e.target.value }))

    const loginUser = async (e) => {
        e.preventDefault()

        login({setErrors, setIsLoading, setIsAuth, phone_number, password })   

    }
    
    const closeMenu = () => setModalOpen(false) 
 
    const openModal = (e) => {
        e.preventDefault()
        setModalOpen(true)
    }

    const openDepositModal = () => {
        setDepositModalOpen(true)
    }

    const ErrorElement = () => errors.map(error => <div id="modal-ref" className="d-block text-danger text-center fw-bold" key={error}>{error}</div>)

    const AuthenticatedItems = () => {
        const [screenSize, setScreenSize] = useState(0)
        const router = useRouter()
        const { pathname } = router
    
        useEffect(() => {
            setScreenSize(window.screen.width)
        }, [])
    
    const isAuthenticated =  () => {
        if(isAuth) {
            setModalOpen(false)
        }
    }

    useEffect(() => {
        isAuthenticated()
    }, [isAuth])

    return (
        <>
        {/* <div className="d-flex align-items-center">
            <span className="text-light" style={{ marginRight: 5 }}>Profile</span>
            <div className="p-2 bg-secondary rounded-circle">               
                <PersonSvgIcon width="24" height="24" className="text-light"/>          
            </div>
        </div> */}
     
            <StyleAuthenticated className="d-flex align-items-center">
                <Link href="/notifications">
                    <a className="btn btn-sm text-dark shadow-sm border-0">
                        <i className="bi bi-bell-fill text-white"></i>
                    </a>
                </Link>
                <SearchComponent customClass="custom-search"/>
                {pathname === '/' && screenSize >= 990 ?
                 <StyleAuthenticatedMobile >
                 <Link href="/profile" prefetch={false}>
                      <a 
                          itemProp="url"
                          className="d-flex align-items-center btn btn-success btn-sm shadow-sm" 
                          style={{ marginLeft: 5 }}
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                      </svg>  
                      <span className="text-light" style={{ marginLeft: 5, letterSpacing: '1px' }}>Profile</span>        
                      </a>                
                                  
                  </Link>
                  <Link href="/history?his_tab=sbets&tab=all" prefetch={false}>
                      <a
                          itemProp="url"
                          className="btn btn-success btn-sm shadow-sm"
                          style={{ marginLeft: 5 }}
                      >
                          <i className="bi bi-card-list w-100" style={{ marginRight: 3 }}></i>
                          <span className="text-light" style={{ marginLeft: 5, letterSpacing: '1px' }}>
                              My Bets
                          </span> 
                      </a>
                  </Link>
                  <button className="btn btn-success btn-sm shadow-sm" style={{ marginLeft: 5 }} onClick={openDepositModal}>
                      <span className="text-light" style={{ marginLeft: 5, letterSpacing: '1px' }}>
                          Deposit
                      </span>
                  </button>
               </StyleAuthenticatedMobile>
                : ''}
                 
            </StyleAuthenticated>            
        </>
        )
    }

    const MidNavLinkItems = (link, i) => {
        return (
            <React.Fragment key={i}>
                <Link href={link.path}>
                    <a
                        itemProp="url"
                        className="text-decoration-none mobile m-1"
                        style={{ letterSpacing: '1px' }}
                    >
                        {link.name}
                    </a>
                </Link>
            </React.Fragment>
        )
    }

    const UnAuthenticatedItems = (link, i) => {
        return (
            <React.Fragment key={i}>
                  <Link href={link.path} key={i} prefetch={false}>
                    <a
                    itemProp="url"
                    className={`${link.class} text-decoration-none`}
                    onClick={link.name === 'Log In' ? openModal : ''}
                    >
                        {link.name === "search" ? <i className="bi bi-search"></i> : link.name}
                    </a>
                </Link>
            </React.Fragment>
        )
    }

    const DepositModal = () => {
        return (
            <Modal show={isDepositModalOpen}>
                <button 
                className="fw-bold" 
                style={{ paddingTop: 15, paddingRight: 20, position: 'absolute', right: 0, border: 'none', background: 'none' }}
                onClick={() => setDepositModalOpen(false)}
                >
                    X
                </button>
                <Modal.Header>
                    <h2 className="mx-auto">Deposit</h2>
                </Modal.Header>
                <Modal.Body>
                    <div className='alert alert-secondary'>
                        <p>|--- GO TO LIPA NA MPESA</p>     
                        <p>|--- ENTER PAYBILL BUSINESS NO.: <b>4075207</b></p>
                        <p>|--- ENTER ACCOUNT NO.: <b>07XX-XXX-XXX</b></p>
                        <p>|--- ENTER AMOUNT & SEND</p>
                        <p>|--- ONCE YOU RECEIVE MPESA NOTIFICATION, GO AHEAD AND PLACE YOUR BET</p>
                    </div>  
                    <button className="btn btn-primary btn-lg w-100" onClick={() => setDepositModalOpen(false)}>
                        CONFIRMED
                    </button>
                        <Link href="/profile">
                            <a
                                itemProp="url"
                                className="text-decoration-none text-dark btn btn-warning btn-lg w-100 mt-2"
                                onClick={() => setDepositModalOpen(false)}
                            >
                                DIRECT DEPOSIT                            
                            </a>
                        </Link>

                </Modal.Body>
            </Modal>
        )
    }
    const linkBarRef = React.useRef()

    useClickOutside(linkBarRef, closeMenu)    


    return (
        <StyleBottomNavBar>  
        <nav className="p-1" ref={linkBarRef}>
            <Row>
                <Col lg={6} md={6} sm={6}  className="d-flex justify-content-between align-items-center">
                    <div className="time">
                        <CurrentTime/>
                    </div>
                    <div>
                        {midnavLinks.map(MidNavLinkItems)}
                    </div>
                </Col>
                <Col lg={6} md={6} sm={6} className="d-flex justify-content-end align-items-center">     
                    {!!user?.data ? <AuthenticatedItems/> : unauthLinks.map(UnAuthenticatedItems)}   
                </Col>
            </Row>
        </nav>
    
             <Modal show={isModalOpen} className="mt-5 pt-5" modalId="modal-ref">
                 <Modal.Body modalId="modal-ref" className="p-4" style={{ background: '#e4e4e4' }}>
                        <Form modalId="modal-ref">
                            <Form.Group modalId="modal-ref" className="mb-3">
                                <Form.Control 
                                modalId="modal-ref" 
                                name="phone_number"
                                type="number" 
                                className="shadow-sm p-3" 
                                placeholder="Phone number"
                                onChange={handleUser}
                                >
                                </Form.Control>
                            </Form.Group>
                            <Form.Group modalId="modal-ref" className="mb-3">
                                <Form.Control 
                                modalId="modal-ref" 
                                name="password"
                                type="password" 
                                className="shadow-sm p-3" 
                                placeholder="Password"
                                onChange={handleUser}
                                >
                                </Form.Control>
                            </Form.Group>                         
                            <Button 
                            modalId="modal-ref" 
                            style={{ backgroundColor: '#126e51', borderColor: '#126e51' }} 
                            className="w-100 p-3 mb-3 fw-bold shadow-sm" 
                            type="submit"                 
                            onClick={loginUser}
                            >
                                {isLoading ? 
                                <Spinner
                                animation="grow"
                                role="status"
                                aria-hidden="true"
                                size="sm"
                                >                                    
                                </Spinner> : 
                                ''}                              
                                
                                {isLoading ? 'Loading...' :'Log In'}
                            </Button>
                            <ErrorElement/>

                            <Link href="/forgot-password">
                                <a 
                                 itemProp="url"
                                 className="d-flex justify-content-center text-decoration-none mt-3"
                                 style={{ color: '#126e51' }}
                                >
                                    Forgot Password?
                                </a>
                            </Link>                          
                        </Form>                       
                    </Modal.Body>                            
                </Modal>

                <DepositModal/>
        </StyleBottomNavBar>
    )
}