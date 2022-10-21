import React, { useEffect, useState } from "react";
import Link from "next/link";
import styledComponents from "styled-components";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import useClickOutside from "../hooks/useClickOutside";
import { useRouter } from "next/router";
import { SearchComponent } from "./CustomFilter";
import CurrentTime from "./CurrentTime";
import { PersonSvgIcon } from "./Svg";
import styled from "styled-components";
import AuthUser from "../hooks/AuthUser";
import Logo from "./Logo";
import useAuth from "../hooks/auth";
import NotificationComponent from "./NotificationComponent";
import { useGetUnreadNotificationsQuery } from "../hooks/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadset } from "@fortawesome/free-solid-svg-icons";
const StyledTopRightNav = styledComponents.div`
position: sticky;
top: 0;
z-index: 2;

 h5 {
    color: #001041;
    font-weight: 700;
    margin: 0;
    padding: 0;
 }
.right-nav-link {
    display: inline-flex;
    position: absolute;
    margin-top: -15px;
    right: 10.5px; 
    font-weight: 350;
}
nav {
    background-color: #fff;
}
nav a {
    color: #001041;
    transition: .3s;
}
nav a:hover, a:active {
    color: #191970;
}
.nav-links-mobile a {
    color: #001041;
    text-decoration: none;
    text-transform: uppercase;
    font-size: 14px;
    margin-top: .25rem;
    margin-bottom: .5rem;
}
.nav-links-mobile a:nth-child(1) {
    color: #001041;
    margin-right: 1rem;
}
.log-out {
   margin-top: .35rem;
   margin-bottom: .4rem;
}
button {
    background-color: #ebeded;
    box-shadow: 
      3px 3px 4px 0 rgba(0, 0, 0, 0.25),
      -2px -2px 3px 0 rgba(255, 255, 255, 0.3);
    border-radius: 50px;
    border: none;
    padding-top: .5rem;
    padding-bottom: .5rem;
    padding-left: 1.2rem;
    padding-right: 1.2rem;
    color: #000;
    font-weight: bold;
    letter-spacing: 1px;
}

.mobile-join {
    margin-left: 8px;
}
@media screen and (max-width: 992px) {
    .right-nav-link a{
       margin-left: 6px;
    }  
}
@media screen and (max-width: 992px) {
    .nav-links-mobile a {
        color: #001041;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 14px;
    }
    .nav-links-mobile a:nth-child(1) {
        color: #001041;
        // padding: 10px 15px;
    }
 
    nav {
        background-color: #fff;
        border-bottom: none;
        position: sticky;
        width: 100%;
        z-index: 2;
    }
    .navbar-toggler {
       display: none;
    }  
}
@media screen and (min-width: 992px) {
    .nav-links-mobile  {
        display: none;
    }
}
`

const StyleBottomNavBar = styledComponents.div`
padding-right: .25rem;
padding-left: .25rem;
background-color: #191970;
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
   .time {
    color: #fff;
   }
    nav {
        background-color: #126e51;
    }
    .nav-link  {
        margin-left: 24px;
    }
 
    @media screen and (max-width: 576px) {      
       .time {
          width: 30%;
       }
       .nav-end {
        width: 60%;
       }
    }
    @media screen and (max-width: 992px) {
        nav {
            background-color: #191970;
            border-top: none;
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
        path: '/live?fixture=live'
    },
    {
        name: 'Results',
        path: '/live?fixture=finished'
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

export default function NavBar({ login }) {
    const user = AuthUser()
    const { logout } = useAuth()
    const TopNavLinkElements = (link, i) => (        
        <div itemProp="name" key={i} className="nav-item">        
            <Link key={i} href={link.path} prefetch={false} >
                <a 
                    itemProp="url"
                    className="fnt-sze nav-link "
                >
                    {link.name}
                </a>
            </Link>
            {link.links && (
                <div className="right-nav-link">{link.links.map(TopNavLinkElements)}</div>
            )}
        </div>
    )

    const AuthenticatedLinks = () => {
        return (
                <div className=" d-flex align-items-center log-out">
                        <button
                            className="d-flex align-items-center"
                            onClick={logout}
                        >
                          <i className="bi bi-box-arrow-left"></i>
                            <span className="mobile-join">Logout</span>                                        
                        </button>
                </div>
        )
    }

    const UnAuthenticatedLinks = () => {
        return (
            <div className="nav-links-mobile d-flex align-items-center">                
                <Link href="/login">
                        <a
                            itemProp="url"
                            className="d-flex align-items-center"
                        >
                            <button className="bg-white">
                                <i className="bi bi-arrow-right-circle"></i>
                                <span className="mobile-join">Login</span> 
                            </button>                                                                  
                        </a>
                    </Link>
                    <Link href="/register">
                        <a
                            itemProp="url"
                            className="d-flex align-items-center"
                        >
                            <button className="bg-info text-dark">
                                <i className="bi bi-person-plus"></i>
                                <span className="mobile-join">Join</span>
                            </button>                            
                        </a>
                    </Link>
            </div>
        )
    }
    return (
        <>
        <StyledTopRightNav className="shadow-lg">
            <nav id="main-nav">
                    <div className="d-flex justify-content-between align-items-center p-2 ">
                        <div className="col-mobile">
                            <Link href="/">
                                <a className="navbar-brand" itemProp="url">
                                    <Logo/>
                                </a>
                            </Link>
                        </div>
            
                        {Boolean(user?.uu_id) ? <AuthenticatedLinks/> : <UnAuthenticatedLinks/>}

                    </div>
            </nav>
            <BottomNavBar logout={logout} login={login} user={user}/>

        </StyledTopRightNav>
        </>
    )
}


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
    const [profileOpen, setProfileOpen] = useState(0)
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
        if(user) {
            setModalOpen(false)
        }
    }

    useEffect(() => {
        isAuthenticated()
    }, [user])

    return (
        <>
            <StyleAuthenticated className="d-flex align-items-center">
            <SearchComponent customClass="custom-search"/>
                <Link href="/notifications">
                    <a className="btn btn-sm text-dark shadow-sm border-0">
                        <i className="bi bi-bell-fill text-white"></i>
                    </a>
                </Link>
              
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
                        className="text-decoration-none m-1"
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
        <nav 
        className="pt-2 pb-2 d-flex align-items-center justify-content-between" 
        ref={linkBarRef}
        style={{ paddingRight: 8, paddingLeft: 8 }}
        >
            <CurrentTime/>
         
            <NotificationComponent user={user}/>
        </nav>
    
             <Modal show={isModalOpen} className="mt-5 pt-5" modalid="modal-ref">
                 <Modal.Body modalid="modal-ref" className="p-4" style={{ background: '#e4e4e4' }}>
                        <Form modalid="modal-ref">
                            <Form.Group modalid="modal-ref" className="mb-3">
                                <Form.Control 
                                modalid="modal-ref" 
                                name="phone_number"
                                type="number" 
                                className="shadow-sm p-3" 
                                placeholder="Phone number"
                                onChange={handleUser}
                                >
                                </Form.Control>
                            </Form.Group>
                            <Form.Group modalid="modal-ref" className="mb-3">
                                <Form.Control 
                                modalid="modal-ref" 
                                name="password"
                                type="password" 
                                className="shadow-sm p-3" 
                                placeholder="Password"
                                onChange={handleUser}
                                >
                                </Form.Control>
                            </Form.Group>                         
                            <Button 
                            modalid="modal-ref" 
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


const StyleProfile = styled.div`
.profile {
    cursor: pointer;
}
`

const Profile = ({ setProfileOpen, profileOpen }) => {
    const openProfile = () => {
        if(profileOpen === 0) {
            setProfileOpen('auto')
        } else {
            setProfileOpen(0)
        }
    }
    return (
        <StyleProfile className="d-flex align-items-center p-2">
            <div className="p-1 bg-light rounded-circle profile" onClick={openProfile}>               
                <PersonSvgIcon width="18" height="18" className="text-dark"/>          
            </div>
        </StyleProfile>    
    )
}

const StyleProfileComponent = styled.div`
 position: absolute;
 height: 320px;
 width: 240px;
 top: 95px;
 right: 20px;
 background: #fff;
 z-index: 2;
 overflow: hidden;
`

const ProfileComponent = ({ profileOpen }) => {
    return (
        <StyleProfileComponent className="rounded shadow" style={{ height: profileOpen }}>
            <div className="p-2">
                <h1>Profile</h1>
            </div>
        </StyleProfileComponent>
    )
}