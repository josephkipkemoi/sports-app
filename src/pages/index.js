import React, { useState } from 'react';
import Head from '../components/Head';
import styled from 'styled-components';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';
import axios from 'axios';
import OddsData from '../data/odds.json';
import FixtureData from '../data/fixtures.json';

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
  H1, H5, Input, 
} from '../components/Html';

   

const ThemedBody = styled('div')`
 background-color: #585858;

 button {
  color: ${props => props.theme.colors.h5Color};
 }
`

const StyleGameData = styled('div')`
.custom-grid-box-main, .custom-grid-hide {
  background: ${props => props.theme.colors.headerColor};
  color: #c3c3c3;
  margin-right: 6px;
}
.header {
  color: #c3c3c3;
 }
.custom-grid-box {
  background-color: ${props => props.theme.colors.btnColor};
  text-align: center;
  border-top: 1px solid #636363;
}
.btn-custom {
  border: none;
  padding: 24px 12px;
  width: 100%;
  background: ${props => props.theme.colors.btnColor};
}
@media screen and (max-width: 576px) {
  .custom-grid {
    display: flex;
    flex-wrap: wrap;
    padding: 12px;
  }
  .custom-grid h5 {
    font-size: 12px;
  }
  .custom-grid-hide {
    display: none;
  }
 .custom-grid-box {
   max-width: 33%;
 }
`

const StyledMain = styled.div`
max-height: 100vh;
overflow-y: scroll;
overflow-x: hidden;
`
export default function App( { data } ) {

  const { response } = OddsData;

  const GameOdds = (data, i) => (
         <div key={i} className="col custom-grid-box">           
              <div className='header'> {data.value}</div>  
              <button className='btn-custom'>{data.odd}</button>               
         </div>
  )

  const GameTeamNames = ({teams: {home, away}}, i) => (
    <div key={i}>
      <span>{home.name}</span>
      <span>{away.name}</span>
    </div>
  )
 
  const GamesData = (data, i) => {
   
    const bet365Odds = data.bookmakers.filter(({name}) => name === 'Bet365').map(data => data.bets)[0].filter(d => d.id === 1)[0].values;
 
    return (
    <Row key={i} className="custom-grid">     
      <Col lg={8} sm={8} className="custom-grid-box-main">
        <h5 className='header'>                 
          {data.league.name}
        </h5>
        
      </Col>
       {bet365Odds.map(GameOdds)}    
    </Row>
  )}
  return (
    <ThemedBody>
        <div>
            <Head
              title="Sports App"
              description="Africa's Best Online Sports Betting App"
            />
            <main>
              <Row>
               
                  <Col lg={9} md={12} sm={12}>
                  <StyledMain>
                   <TopNavBar/>
                   <h2> Filter</h2>
                   <StyleGameData>
                     {response.map(GamesData)}
                    
                   </StyleGameData>   
                   </StyledMain>            
                  </Col>
                 
                  <Col lg={3} md={12} sm={12}>
                   <Betslip/>
                  </Col>
              </Row>
               
            </main>
        </div>     
    </ThemedBody>
  );
}

// export async function getServerSideProps() {
//   const options = {
//     method: 'GET',
//     url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures?date=2022-05-24',
//     params: {league: '492' , season: '2021'},
//     headers: {
//       'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
//       'X-RapidAPI-Key': 'b2c138608fmsh6567bc9b793b465p1a4945jsnb15afccb7248'
//     }
//   };
  
//   const res = await axios.request(options)
 
//   axios.request(options).then(function ({data}) {
   
  
//   }).catch(function (error) {
//     console.error(error);
//   });

//   return { props: { data: res.data } }

// }

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
    <div sm={1} key={i} className="custom-box d-flex flex-column">
 
      <FontAwesomeIcon icon={link.icon} className="fa-2x text-secondary d-block"/>
     
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

const StyleBetslip = styled.div`
  background-color: #383838;
  padding: 12px;
  max-height: 100vh;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #383838;
  }
  ::-webkit-scrollbar-thumb {
    background: #c3c3c3;
    border-radius: 8px;
  }
  h5 {
    color: ${props => props.theme.colors.h5Color};
  }
  span {
    color: ${props => props.theme.colors.primaryLight}
  }
  .betslip-child {
    background-color: #444;
    padding: 12px;
    margin: 6px;
    border-radius: 6px;
    margin-bottom: 16px;
  }
  @media screen and (max-width: 576px) {
    .inpt-xsm {
      width: 50%;
    }
  }
`


const Betslip = () => {
  return (
    <StyleBetslip className='mx-auto'>
      <div className='d-flex justify-content-between'>
        <H5>BETSLIP</H5>
        <i className="bi bi-three-dots-vertical text-light"></i>
      </div>
      <hr />
  
        <div className='betslip-child'>
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-app-indicator text-muted d-block mx-auto m-3" viewBox="0 0 16 16">
          <path d="M5.5 2A3.5 3.5 0 0 0 2 5.5v5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V8a.5.5 0 0 1 1 0v2.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 1 10.5v-5A4.5 4.5 0 0 1 5.5 1H8a.5.5 0 0 1 0 1H5.5z"/>
          <path d="M16 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
        </svg>
          <span className='d-block fw-bold text-center'>You have not selected any bet</span>
          <span className='d-block text-center'>Make your first pick to start playing.</span>
          <hr/>
          <span className='d-block m-3'>Or introduce your bet code:</span>
          <Row className='m-1 align-items-center'>
            <Col sm={8} md={8} lg={8} className="inpt-xsm">
            <Input className="form-control " placeholder="Bet Code"/>           
            </Col>
            <Col sm={4} md={4} className='text-center inpt-xsm' lg={4}>
              <button className='btn btn-secondary  '>Add</button>
            </Col>           
          </Row>
         
        </div>
      <AddedFeatures/>
      <Offers/>
    </StyleBetslip>
  )
}
 
const StyledFeatures = styled.div`
.feature-box {
  padding: 8px;
}
h5 {
  color: ${props => props.theme.colors.h5Color};
}
h6{
  color: ${props => props.theme.colors.primaryLight};
 
 }
small, p{
  color: ${props => props.theme.colors.primaryDark};
 
 } 
svg {
  margin-right: 4px;
}
`

const AddedFeatures = () => {
  return (
    <StyledFeatures>
      <h5>
        <i className="bi bi-lightning"></i>
        Features
      </h5>
      <div className='feature-box'>
        <h6>Soccer Bet Builder</h6>
        <p>
          Now available on up to 12 selections. Create your own personalised bet on any Soccer game.  T&Cs apply.
        </p>
        <small>More Details</small>
      </div>
      <div className='feature-box'>
        <h6>Live Streaming Highlights</h6>
        <p>
          A selection of the top Soccer matches you can watch at bet365 over the next few days. Eligible customers only.
        </p>
        <small>Live Streaming Rules Apply</small>
      </div>
      <div className='feature-box'>
        <h6>Cash Out</h6>
        <p>
          Giving you the opportunity to take a return before an event has finished. T&Cs apply.
        </p>
        <small>More Details</small>
      </div>
    </StyledFeatures>
  )
}

const Offers = () => {
  return (
    <StyledFeatures>
      <H5>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-snow2" viewBox="0 0 16 16">
          <path d="M8 16a.5.5 0 0 1-.5-.5v-1.293l-.646.647a.5.5 0 0 1-.707-.708L7.5 12.793v-1.086l-.646.647a.5.5 0 0 1-.707-.708L7.5 10.293V8.866l-1.236.713-.495 1.85a.5.5 0 1 1-.966-.26l.237-.882-.94.542-.496 1.85a.5.5 0 1 1-.966-.26l.237-.882-1.12.646a.5.5 0 0 1-.5-.866l1.12-.646-.884-.237a.5.5 0 1 1 .26-.966l1.848.495.94-.542-.882-.237a.5.5 0 1 1 .258-.966l1.85.495L7 8l-1.236-.713-1.849.495a.5.5 0 1 1-.258-.966l.883-.237-.94-.542-1.85.495a.5.5 0 0 1-.258-.966l.883-.237-1.12-.646a.5.5 0 1 1 .5-.866l1.12.646-.237-.883a.5.5 0 0 1 .966-.258l.495 1.849.94.542-.236-.883a.5.5 0 0 1 .966-.258l.495 1.849 1.236.713V5.707L6.147 4.354a.5.5 0 1 1 .707-.708l.646.647V3.207L6.147 1.854a.5.5 0 1 1 .707-.708l.646.647V.5a.5.5 0 0 1 1 0v1.293l.647-.647a.5.5 0 1 1 .707.708L8.5 3.207v1.086l.647-.647a.5.5 0 1 1 .707.708L8.5 5.707v1.427l1.236-.713.495-1.85a.5.5 0 1 1 .966.26l-.236.882.94-.542.495-1.85a.5.5 0 1 1 .966.26l-.236.882 1.12-.646a.5.5 0 0 1 .5.866l-1.12.646.883.237a.5.5 0 1 1-.26.966l-1.848-.495-.94.542.883.237a.5.5 0 1 1-.26.966l-1.848-.495L9 8l1.236.713 1.849-.495a.5.5 0 0 1 .259.966l-.883.237.94.542 1.849-.495a.5.5 0 0 1 .259.966l-.883.237 1.12.646a.5.5 0 0 1-.5.866l-1.12-.646.236.883a.5.5 0 1 1-.966.258l-.495-1.849-.94-.542.236.883a.5.5 0 0 1-.966.258L9.736 9.58 8.5 8.866v1.427l1.354 1.353a.5.5 0 0 1-.707.708l-.647-.647v1.086l1.354 1.353a.5.5 0 0 1-.707.708l-.647-.647V15.5a.5.5 0 0 1-.5.5z"/>
        </svg>
        Offers
      </H5>
      <div className='feature-box'>
        <h6>Soccer Accumulator Bonus</h6>
        <p>
          Earn up to 70% more. New & eligible customers only. T&Cs apply.
        </p>
        <small>More Details</small>
      </div>
      <div className='feature-box'>
        <h6>Tennis Accumulator Bonus</h6>
        <p>
          Earn up to 70% more. New & eligible customers only. T&Cs apply.
        </p>
        <small>More Details</small>
      </div>
    </StyledFeatures>
  )
}