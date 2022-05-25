import React from "react";
import Link from "next/link";
import styledComponents from "styled-components";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import useClickOutside from "../hooks/useClickOutside";

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
export default function NavBar() {

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
        <BottomNavBar/>
        </>
    )
}

const bottomNavLinks = [
    {
        name: 'Sports',
        path: '/sports'
    },
    {
        name: 'Live Games',
        path: '/live-games',
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
  
`

 
const BottomNavBar = () => {
    const [isModalOpen, setModalOpen] = React.useState(false);

    const closeMenu = () => setModalOpen(false)

    const openModal = (e) => {
        e.preventDefault()
        setModalOpen(true)
    }

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
            {link.links && (
                <div className="align-right">{link.links.map(BottomNavLinkItem)}</div>
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
             <Modal show={isModalOpen} className="mt-5 pt-5">
                 <Modal.Body id="modal-ref" className="p-4" style={{ background: '#e4e4e4' }}>
                        <Form id="modal-ref">
                            <Form.Group id="modal-ref" className="mb-3">
                                <Form.Control id="modal-ref" type="text" className="shadow-sm p-3" placeholder="Email or Phone Number"></Form.Control>
                            </Form.Group>
                            <Form.Group id="modal-ref" className="mb-3">
                                <Form.Control id="modal-ref" type="password" className="shadow-sm p-3" placeholder="Password"></Form.Control>
                            </Form.Group>
                            <Button style={{ backgroundColor: '#126e51', borderColor: '#126e51' }} className="w-100 p-3 mb-3 fw-bold shadow-sm" type="submit">
                                Log In
                            </Button>
                            <Link href="/forgot-password">
                                <a 
                                 itemProp="url"
                                 className="d-flex justify-content-center text-decoration-none "
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