import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  { 
    faStar, 
    faSoccerBall,
    faTableTennis, 
    faGlobeAmericas,
    faBaseball,
    faBasketball,
    faVolleyballBall,
    faHorse,
    faGolfBall,
    faTableTennisPaddleBall,
    faCalendar,
    faTrophy,
}  from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const StyleSideNav = styled.div`
background-color: #191970; 
overflow-x: scroll;
overflow-y: hidden;
padding-top: .25rem;
padding-bottom: .25rem;
::-webkit-scrollbar {
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #191850;
}
::-webkit-scrollbar-thumb {
  background:  rgba(255,255,255,0.5);
  border-radius: 8px;
}
 
@media screen and (max-width: 992px) {
  background-color: #191970; 
  .nav-container {
  align-items: center;
  background: linear-gradient(-45deg, rgba(255,255,255,0.22), rgba(25,25,12,0.25));
  box-shadow: 
    4px 4px 6px 0 rgba(0, 0, 0, 0.25),
    -2px -2px 3px 0 rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  display: flex;  
  justify-content: center; 
  }
  a {
    margin: 3px;  
    border-radius: 6px; 
  }
  .nav-container-active {
    background: linear-gradient(-45deg, rgba(0,0,0,0.22), rgba(255,255,255,0.25));
  }
} 
`
const topNavLinks = [
    {
      name: 'Favorites',
      path: '/favorites',
      icon:  faStar
    }, 
    {
      name: 'Jackpots',
      path: '/jackpot',
      icon: faTrophy
    },
    {
      name: 'Soccer',
      path: '/soccer',
      icon: faSoccerBall
    },
    {
      name: 'Tennis',
      path: '/tennis',
      icon: faTableTennis
    },
    {
      name: 'American Football',
      path: '/american-football',
      icon: faGlobeAmericas
    },
    {
      name: 'Baseball',
      path: '/baseball',
      icon: faBaseball
    }, 
    {
      name: 'Basketball',
      path: '/basketball',
      icon: faBasketball
    },
    {
      name: 'Beach Volleyball',
      path: '/beach-volleyball',
      icon: faVolleyballBall
    },
    {
      name: 'Horse Racing',
      path: '/horse-racing',
      icon: faHorse
    },
    {
      name: 'Golf',
      path: '/golf',
      icon: faGolfBall
    },
    {
      name: 'Table Tennis',
      path: '/table-tennis',
      icon: faTableTennisPaddleBall
    },
    {
      name: 'Schedule',
      path: '/live?fixture=scheduled',
      icon: faCalendar
    }
]

export default function TopNavBar() {
    
    const positionRef = useRef(null)
    const router = useRouter()
    const { pathname } = router

    const TopNavLinkItem = (link, i) => (
        <div sm={1} key={i} className={`${link.path === pathname ? 'nav-container-active' : ''} nav-container m-2 mt-3 mb-3`}>     
          <Link href={link.path} prefetch={false} className="icon-text-width">
            <a
              itemProp='url'
              className='text-decoration-none text-secondary d-flex flex-column text-center p-2'     
            >
              <FontAwesomeIcon 
                icon={link.icon} 
                className={`fa-2x mb-2 mt-2 fw-bold ${link.path === pathname ? 'text-warning' : 'text-white'} `}
              />
 
              <small 
              className={`${link.path === pathname ? 'text-warning' : 'text-white'}`}
              style={{ whiteSpace: 'nowrap', width: '72px', overflow: 'hidden', letterSpacing: '1px' }}>
              {link.name}
              </small>
            </a>
          </Link>
        </div>
    )

    useEffect(() => {
      positionRef.current.focus()
    }, [])
    
      return (
        <StyleSideNav className='d-flex justify-content-between shadow rounded' ref={positionRef}>
            {topNavLinks.map(TopNavLinkItem)}
        </StyleSideNav>
      )
}