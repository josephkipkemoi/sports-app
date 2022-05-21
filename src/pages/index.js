import React from 'react';
import Head from '../components/Head';
import styled from 'styled-components';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
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
  faCalendar
}  from "@fortawesome/free-solid-svg-icons";


import { 
  H1 
} from '../components/Html';
import Link from 'next/link';
  

const ThemedBody = styled('div')`
 background-color: #585858;
`
export default function App() {
 
  return (
    <ThemedBody>
        <div>
            <Head
              title="Sports App"
              description="Africa's Best Online Sports Betting App"
            />
            <main>
              <Row>
                  <Col lg={9} md={9}>
                   <TopNavBar/>
                  </Col>
                  <Col>
                  <span>Betslip</span>
                  </Col>
              </Row>
                <H1>Sports App</H1>
            </main>
        </div>     
    </ThemedBody>
  );
}

const StyleSideNav = styled.div`
background-color: #383838;
width: 100%;
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

const StyledSpan = styled.div`
padding: 8px; 
text-align: center;
 
display: flex;
flex-wrap: nowrap;
justify-content: start;
a {
  font-size: 12px;
  text-decoration: none;
  text-align: center;
  color: #9c9c9c;
  white-space: nowrap;
  overflow: hidden;
  margin-top: 8px;
}
.custom-box {
  margin-left: 4px;
  min-width: 102px;
  max-width: 102px;
}

`

const topNavLinks = [
  {
    name: 'Favourites',
    path: '/favourites',
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
const TopNavBar = () => {

  const TopNavLinkItem = (link, i) => (
    <div sm={1} key={i} className="custom-box d-flex flex-column ">
       <FontAwesomeIcon icon={link.icon} className="fa-2x text-secondary  d-block "/>
      <Link href={link.path} prefetch={false} className="icon-text-width">
        <a
          itemProp='url'
        >
          {link.name}
        </a>
      </Link>
    </div>
  )

  return (
    <StyleSideNav>
      <StyledSpan>
        {topNavLinks.map(TopNavLinkItem)}
      </StyledSpan>
    </StyleSideNav>
  )
}
 
