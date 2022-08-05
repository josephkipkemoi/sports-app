import React from "react";
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
    faSignal,
    faCalendar,
}  from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const StyleSideNav = styled.div`
background-color: #383838;
 
overflow-x: scroll;
overflow-y: hidden;

::-webkit-scrollbar {
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #383838;
}
::-webkit-scrollbar-thumb {
  background: #c3c3c3;
  border-radius: 8px;
}
`
const topNavLinks = [
    {
      name: 'Favorites',
      path: '/favorites',
      icon:  faStar
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
      name: 'Streaming',
      path: '/streaming',
      icon: faSignal
    },
    {
      name: 'Schedule',
      path: '/schedule',
      icon: faCalendar
    }
]

export default function TopNavBar() {
    const router = useRouter()
    const { pathname } = router
    const TopNavLinkItem = (link, i) => (
        <div sm={1} key={i}>     
          <Link href={link.path} prefetch={false} className="icon-text-width">
            <a
              itemProp='url'
              className='text-decoration-none text-secondary d-flex flex-column text-center p-2'         
            >
              <FontAwesomeIcon 
                icon={link.icon} 
                className={`fa-2x mb-2 mt-2 ${link.path === pathname ? 'text-warning' : 'text-success'} `}
              />
              {console.log()}
              <small 
              className={`${link.path === pathname ? 'text-warning' : 'text-white'}`}
              style={{ whiteSpace: 'nowrap', width: '72px', overflow: 'hidden', letterSpacing: '1px' }}>
              {link.name}
              </small>
            </a>
          </Link>
        </div>
      )
    
      return (
        <StyleSideNav className='d-flex justify-content-between shadow rounded'>
            {topNavLinks.map(TopNavLinkItem)}
        </StyleSideNav>
      )
}