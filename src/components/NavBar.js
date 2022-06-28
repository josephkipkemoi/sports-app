import React, { useState } from "react";
import Link from "next/link";
import styledComponents from "styled-components";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import useClickOutside from "../hooks/useClickOutside";
import { useGetBalanceByUserIdQuery } from "../hooks/balance";
import useAuth from "../hooks/auth";
 
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
        path: '/sports'
    },
    {
        name: 'In-Play',
        path: '/live'
    },
    {
        name: 'Live Casino',
        path: '/live-casino'
    },
    {
        name: 'Casino',
        path: '/casino'
    },
    {
        name: 'Livescore',
        path: '/livescore'
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
                path: '/help'
            }
        ]
    }
]

export default function NavBar({ user, logout, login }) {

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
                    <a className="navbar-brand text-light" href="/">SportsApp</a>
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
        <BottomNavBar user={user} logout={logout} login={login}/>
        </>
    )
}


const bottomNavLinks = [
    {
        name: 'Sports',
        path: '/sports',
        class: 'sports'
    },
    {
        name: 'Live Games',
        path: '/live',
        class: 'live-games'
    },
    {
        name: '',
        path: '#',
        class: 'hide',
        links: [
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
    },
    {
        name: '',
        path: '#',
        class: 'hide',
        authLinks: [
            {
                name: 'Log out',
                path: '/logout'
            }
        ]
    }
]

const StyleBottomNavBar = styledComponents.div`
   .join {
       background-color: #ffdf1b;
       padding: 6px;
       border-radius: 6px;
       margin-top: -4px;
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
   .align-right {
        position: absolute;
        display: flex;
        right: 15px;
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
 
const BottomNavBar = ({ user, login }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const { isAuthenticated } = useAuth({ middleware: 'guest' })
    const [userDetails, setUserDetails] = useState({
        email: '',
        password: '',
    })

    const { email, password } = userDetails;

    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(null);

    const handleUser = (e) => setUserDetails(prev => ({ ...prev, [e.target.name] : e.target.value }))

    const loginUser = (e) => {
        e.preventDefault()

        login({setErrors, setIsLoading, email, password})   
      
    }
 
    const closeMenu = () => setModalOpen(false) 
 
    const openModal = (e) => {
        e.preventDefault()
        setModalOpen(true)
    }

    const ErrorElement = () => errors.map(error => <div id="modal-ref" className="d-block text-danger text-center fw-bold" key={error}>{error}</div>)

    const AuthenticatedItems = () => (
        <>
            <StyleAuthenticated>
                <button className="btn btn-warning btn-sm">
                <i className="bi bi-bell"></i>
                </button>
                <Link href="/profile" prefetch={false}>
                    <a 
                        itemProp="url"
                        className="btn btn-secondary btn-sm" 
                        style={{ marginLeft: 5 }}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                    </svg>  
                        Profile      
                    </a>                
                               
                </Link>
                <Link href="/history?tab=all" prefetch={false}>
                    <a
                        itemProp="url"
                        className="btn btn-primary btn-sm"
                        style={{ marginLeft: 5 }}
                    >
                        <i className="bi bi-card-list" style={{ marginRight: 3 }}></i>
                        My Bets
                    </a>
                </Link>
                <button className="btn btn-warning btn-sm" style={{ marginLeft: 5 }}>Deposit</button>
            </StyleAuthenticated>            
        </>
    )

    const BottomNavLinkItem = (link, i) => (
        <div key={i} >
            <Link href={link.path} key={i} prefetch={false}>
                <a
                 itemProp="url"
                 className={"nav-link " + link.class}
                 onClick={link.name === 'Log In' ? openModal : ''}
                >
                    {link.name === "search" ? <i className="bi bi-search"></i> : link.name}
          
                </a>
            </Link>
             {(link.links) && (
                <div className="align-right">{!!isAuthenticated === false ? link.links.map(BottomNavLinkItem) :  <AuthenticatedItems/>}</div> 
            )}
  
        </div>
    )

    const linkBarRef = React.useRef()

    useClickOutside(linkBarRef, closeMenu)    
           
    return (
        <StyleBottomNavBar>  
        <nav className="p-4" ref={linkBarRef}>
            <div className="custom-mx-auto d-flex justify-content-center w-50 mx-auto">
                {bottomNavLinks.map(BottomNavLinkItem)}
            </div>           
        </nav>
    
             <Modal show={!!user ? false : isModalOpen} className="mt-5 pt-5" modalId="modal-ref">
                 <Modal.Body modalId="modal-ref" className="p-4" style={{ background: '#e4e4e4' }}>
                        <Form modalId="modal-ref">
                            <Form.Group modalId="modal-ref" className="mb-3">
                                <Form.Control 
                                modalId="modal-ref" 
                                name="email"
                                type="email" 
                                className="shadow-sm p-3" 
                                placeholder="Email"
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
        </StyleBottomNavBar>
    )
}