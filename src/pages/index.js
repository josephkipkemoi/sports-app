import React, { useEffect, useRef, useState } from 'react';
import Head from '../components/Head';
import styled from 'styled-components';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';
import { useGetV1CustomFixtureQuery } from '../hooks/fixture';
import configData from '../../config.json';
import  Modal  from 'react-bootstrap/Modal';
import copyToClipboard from '../hooks/copyToClipboard';

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
  faRefresh
}  from "@fortawesome/free-solid-svg-icons";

import { 
  H1, H5, Input, InputNumber, Small, Span, 
} from '../components/Html';
import { usePostCustomFixtureQuery } from '../hooks/customFixture';
import useCustomBetslip from '../hooks/customBetslip';
import { useGetBetslipQuery } from '../hooks/betslip';
import {useGetBalanceByUserIdQuery} from '../hooks/balance';
import axios from '../lib/axios';
import { useRouter } from 'next/router';
import useClickOutside from '../hooks/useClickOutside';
import { Spinner } from 'react-bootstrap';
import useSocialShare from '../hooks/socialShare';
import useAuth from '../hooks/auth';
import Support from '../components/Support';
const ThemedBody = styled('div')`
 background-color: #585858;

 button {
  color: ${props => props.theme.colors.h5Color};
 }
`

const StyleGameData = styled('div')`
height: 100vh;
.custom-grid-box-main, .custom-grid-hide {
  background: ${props => props.theme.colors.btnColor};
  color: #c3c3c3; 
}
.header {
  background: ${props => props.theme.colors.btnColor};
  color: #c3c3c3;
 }
.custom-grid-box {
  background-color: ${props => props.theme.colors.btnColor};
  text-align: center;
  border-top: 1px solid #636363;
}
.btn-custom {
  border: none;
  cursor: pointer;
  padding: 24px 12px;
  width: 100%;
  background: ${props => props.theme.colors.btnColor};
  transition: .3s ease-out;
}
 
.btn-custom:hover {
  background: ${props => props.theme.colors.headerColor};
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
background-color: ${props => props.theme.colors.btnColor};
max-height: 100vh;
overflow-y: scroll;
overflow-x: hidden;

`
const StyledFavorites = styled.div`
 
@media screen and (max-width: 576px) {

  
}
`
function App() {

  const [clicked, setClicked] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  
  useEffect(() => {

    const currentSession = sessionStorage.getItem('session_id')
 
    if(!!currentSession === false) {
      sessionStorage.setItem('session_id', Date.now())
    }  

  },[clicked])

   const GameElement = () => {

    const { postBetslip } = useCustomBetslip()
    
    const {error, isLoading, data} = useGetV1CustomFixtureQuery()
    
    if(error)
    {
      return <span>Errors</span>
    }

    if(isLoading)
    {
      return <Spinner animation='grow'/>
    }

    const response = data.fixtures.filter(val => val.unserialized_odds !== false)


    const sendBetslip = async (e)  => {
      e.preventDefault()
      const homeTeam = e.target.getAttribute('home_team');
      const awayTeam =  e.target.getAttribute('away_team');
      const odds = e.target.getAttribute('odds');
      const market = e.target.getAttribute('market'); 
      const picked = e.target.getAttribute('picked');
      const fixtureId = e.target.getAttribute('fixtureid');
      const session_id = sessionStorage.getItem('session_id')

       postBetslip({
        fixture_id: fixtureId+session_id,
        session_id: session_id,
        betslip_teams: homeTeam + ' v ' + awayTeam,
        betslip_market: market,
        betslip_picked: picked,
        betslip_odds: odds 
      })
 
      setClicked(prev => !prev)
    }

    const sendBetslip2 = async (e,odds, market_id, picked)  => {
 
      const homeTeam = localStorage.getItem('home_team');
      const awayTeam =   localStorage.getItem('away_team');
      const fixtureId = localStorage.getItem('fixture_id');
      const session_id = sessionStorage.getItem('session_id')
      const games = response.filter(g => g.fixture_id == fixtureId)
      const market = games[0].unserialized_odds.bookmakers[0].bets[market_id]?.name

       postBetslip({
        fixture_id: fixtureId+session_id,
        session_id: session_id,
        betslip_teams: homeTeam + ' v ' + awayTeam,
        betslip_market: market,  
        betslip_picked: picked,
        betslip_odds: odds 
      })
 
      setClicked(prev => !prev)
    }

    const displayMoreMarkets = (index, home, away, fixture_id) => {

      localStorage.setItem('home_team', home)
      localStorage.setItem('away_team', away)
      localStorage.setItem('fixture_id', fixture_id)
  
      const elements = document.getElementsByClassName('more-market')[index]
       if( elements.style.display === 'none') {
        elements.style.display = 'block'

      } else {
        elements.style.display = 'none'

      }

    }
 
    const MoreFixtureMarket = (name, i) => {

      const OddsMarket = (odds, ii) => {        
        return (
          <React.Fragment key={ii+i+odds.odd}>         
                <div className='d-sm-flex m-1' style={{ width: '30%'}}>
                  <button 
                  className='btn-custom d-sm-flex justify-content-between flex-wrap '                  
                  odds={odds.odd} 
                  market={i} 
                  picked={odds.value}
                  onClick={(e) => sendBetslip2(e,odds.odd,i,odds.value)}  
                  >
                  <span className='d-block'>{odds.value}</span>
                  <span className='fw-bold text-light'>{odds.odd}</span>
                  </button>
                </div>   
          </React.Fragment>
        )
      }

 
      return ( 
        <React.Fragment key={i+name.name}>
            <div 
              className='text-light bg-success w-100 p-2 fw-bold card'
              style={{ lineHeight: '30px' }}
            >
              <small style={{ marginLeft: 10, letterSpacing: 2 }}>{name.name}</small>
            </div>
            <div className='d-flex justify-content-between flex-wrap'>
            {name.values.map(OddsMarket)}
            </div>          
        </React.Fragment>
      )
    }

    const updateFavorite = async (fixture_id) => {
      const user_id = Number(localStorage.getItem('u_i'))

       await axios.post('api/favorites', {
        user_id,
        fixture_id
      });

    }  
    return (
      <>
        {response.map((data,i) => {
          const date = new Date(data.fixture_date)
          return (
            <React.Fragment key={i + data.fixture_date}>
            <Col lg={8} sm={8} className="custom-grid-box-main p-2">  
      
              <Row style={{ marginLeft: 2 }}>
              <h5 className='header'> 
                <img 
                  src={data.flag} 
                  className="img-fluid"                 
                  style={{ width : 16, marginRight: 5}}
                /> 
                  {data.country} | {data.league_name}
              </h5>
              <div>
              <small style={{ marginRight: 5 }}>
                Bet ID: B360{data.fixture_id} |
              </small>
              <small style={{ marginRight: 5 }}>
                {date.toLocaleDateString('en-GB')}
              </small>
              <small>
                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </small>
              </div>

                <StyledFavorites>
                  <Row>
                    <Col className='d-inline-flex'>
                      <i className="bi bi-star" onClick={() => updateFavorite(data.fixture_id)}></i>
                      <div style={{ marginTop: 2.5, marginLeft: 10 }}>
                        <span>{data.home}</span>
                        <i className="bi bi-dash"></i>
                        <span>{data.away}</span>
                      </div>                    
                    </Col>
                  </Row>
                 
                </StyledFavorites>

              </Row>
                     
            </Col>
            <Col lg={4} sm={4} className="d-flex align-items-center">
              {data.unserialized_odds.bookmakers[0].bets.map(odd => {             
                return odd.id === 1 && odd.values.map((val, i) => {
                   return (
                     <div key={i+val.name + val.odd} className='text-center mb-3 w-100'>
                        <span className='header text-center'>{val.value}</span>  
                         
                       <button 
                        odds={val.odd} 
                        className='btn-custom'
                        btn_id={i}
                        home_team={data.home} 
                        market={odd.name} 
                        away_team={data.away} 
                        picked={val.value}
                        fixtureid={data.fixture_id}
                        onClick={sendBetslip}  
                        >{val.odd}</button>   
                                   
                     </div>
                   )
                 })
              })}

              <div className='text-center' style={{ position: 'relative' }}>

                <Small 
                  onClick={() => displayMoreMarkets(i, data.home, data.away, data.fixture_id)}
                  className="d-flex align-items-center text-warning fw-bold"
                >
                    <i className="bi bi-plus" ></i>    
                    {data.unserialized_odds.bookmakers[0].bets.length}               
                </Small>
                <small className='text-warning fw-bold' style={{ position: 'absolute', right: 0 }}> Markets</small> 

              </div>
               
            </Col>
            <div className='more-market' style={{ display: 'none' }}>
              {data.unserialized_odds.bookmakers[0].bets.map(MoreFixtureMarket)}
            </div>

            <hr className='text-secondary'/>
            
          </React.Fragment>
          )
          
        })}

      </>
    )  
  }

  const GamesData = () => {
    const router = useRouter()
    const {tab} = router.query

    return (
    <Row  className="custom-grid p-2">     
       {router.asPath === '/'  && <GameElement />}
       { tab === 'soccer' && <GameElement />}
       {tab === 'favorites' && <FavoritesElement/>}
    </Row>
  )}

  const [searchTerm, setSearchTerm] = useState('')
    
  const onchange = (e) => {
    setSearchTerm(e.target.value) 
  }

  const onsubmit = async () => {
    setIsSearchLoading(true)
    const res = await axios.get(`api/fixture/search?q=${searchTerm}`);
   
    if(res.status === 200) {
      setSearchResults(res.data.data)
      setIsSearchLoading(false)
    }
  }

  return (
    <ThemedBody>
        <div>            
            <main>
              <Row>
                  <Col lg={9} md={12} sm={12} style={{ padding: 0, paddingLeft: 10 }}>
                  <StyledMain>
                   <TopNavBar/>
                   <CustomFilter onchange={onchange} onsubmit={onsubmit}/>

                   <StyleGameData>
                     {isSearchLoading ? <Spinner animation="grow"/> : ''}
                     {searchResults.length > 0 ? 
                       <SearchResults data={searchResults}/> : 
                     ''}
                    
                      <GamesData/>
                   </StyleGameData>   
                   </StyledMain>            
                  </Col>
                 
                  <Col lg={3} md={12} sm={12} style={{ padding: 0, paddingRight: 5 }}>                  
                    <Betslip clicked={clicked}/>
                  </Col>
              </Row>
            </main>
        </div>   

        <Support/>  
    </ThemedBody>
  );
}

const FavoritesElement = () => {
  return (
    <div className='p-4'>
      <h3 className='text-light'>Favorites</h3>
      <hr/>
      <div className='text-center mt-5'>
        <span className='text-light'>You do not have any favorites</span>
      </div>
    </div>
  )
}

const SearchResults = ({ data }) => {

  // if(isSearchLoading) {
  //   return <Spinner animation="grow"/>
  // }
 
  const SearchResultItems = (name, i) => {

    return (
      <React.Fragment key={i + name.fixture_date}>
        <hr/>
      <Col lg={8} sm={8} className="custom-grid-box-main p-2">  

        <Row style={{ marginLeft: 2 }}>
        <h5 className='header'> <img src={name.flag} className="img-fluid" style={{ width : 16 }}/> {name.country} | {name.league_name}</h5>
        <small>{name.fixture_date}</small>
          <Col lg={1} md={1} sm={1} className="d-flex flex-column justify-content-between">
            
              <i className="bi bi-star"></i>
              
              <Small onClick={() => displayMoreMarkets(i)}>
                {/* {name.unserialized_odds.bookmakers[0].bets.length} */}
                <i className="bi bi-arrow-right-short"></i>
              </Small>
              
          </Col>
          <Col>
            <span className='d-block'>{name.home} - </span>
            <span className='d-block'>{name.away}</span>
          </Col>
          <Col></Col>
        </Row>
               
      </Col>
      <Col lg={4} sm={4} className="d-flex">
        {/* {name.unserialized_odds.bookmakers[0].bets.map(odd => {             
          return name.id === 1 && name.values.map((val, i) => {
             return (
               <div key={i+val.name + val.odd} className='text-center mb-3 w-100'>
                  <span className='header text-center'>{val.value}</span>  
                 <button 
                  odds={val.odd} 
                  className='btn-custom'
                  btn_id={i}
                  home_team={data.home} 
                  market={odd.name} 
                  away_team={data.away} 
                  picked={val.value}
                  fixtureid={data.fixture_id}
                  onClick={sendBetslip}  
                  >{val.odd}</button>   
                                  
               </div>
             )
           })
        })} */}
      </Col>
      <div className='more-market' style={{ display: 'none' }}>
        {/* {name.unserialized_odds.bookmakers[0].bets.map(MoreFixtureMarket)} */}
      </div>
        <hr/>
      
    </React.Fragment>
    )
  }
  return (
    <>
       {data.map(SearchResultItems)}
    </>
  )
}

const StyleButton = styled.div`
button {
  background: none;
  border: none;
}
button:hover {
  color: #fff;
}
`
const StyleSearch = styled.div`
 background: none;
 border: none;
 margin-left: -5px;
 max-width: 240px;
 max-height: 32px;
 input[type=search] {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  height: 100%;
 }
 button {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
 }
`
const CustomFilter = ({ onchange, onsubmit }) => {
  return (
    <Row className="d-flex flex-row align-items-center p-2 card bg-success shadow-sm mb-2" >
      <Col>
        <h3 className='text-light fw-bold' style={{ letterSpacing: 1, margin: 0 }}>Highlights</h3>
      </Col>
      <Col lg="6" md="6" sm="6" className="d-flex">
        <StyleButton className='mx-auto d-flex align-items-center'>
        <button className='btn'>
          <i className="bi bi-printer"></i>
        </button>        
        <button className='background-none'>
          <i className="bi bi-arrow-clockwise text-light p-1"></i>
          <small className='text-light'>Refresh</small>
        </button>
        </StyleButton>      
      </Col>
      <Col lg="3" md="3" sm="3" className='d-flex justify-content-end'> 
        <StyleSearch className='d-flex'>
          <input 
          type="search" 
          placeholder="Search" 
          className="form-control input-sm text-dark"
          onChange={onchange}
          style={{ background: 'lightgray', borderRight: 'none', borderColor: 'gray' }}
          />
          <button className='btn btn-secondary d-flex align-items-center p-1' onClick={onsubmit}>        
            <i className="bi bi-search" style={{ marginLeft: 3, marginRight: 5 }}></i>
            <small className='text-light' style={{ marginTop: 3 }}>Search</small>
          </button>
        </StyleSearch>       
      </Col>
    </Row>    
  )
}
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
    path: '?tab=favorites',
    icon:  faStar
  }, 
  {
    name: 'Soccer',
    path: '?tab=soccer',
    icon: faSoccerBall
  },
  {
    name: 'Tennis',
    path: '?tab=tennis',
    icon: faTableTennis
  },
  {
    name: 'American Football',
    path: '?tab=american-football',
    icon: faGlobeAmericas
  },
  {
    name: 'Baseball',
    path: '?tab=baseball',
    icon: faBaseball
  }, 
  {
    name: 'Basketball',
    path: '?tab=basketball',
    icon: faBasketball
  },
  {
    name: 'Beach Volleyball',
    path: '?tab=beach-volleyball',
    icon: faVolleyballBall
  },
  {
    name: 'Horse Racing',
    path: '?tab=horse-racing',
    icon: faHorse
  },
  {
    name: 'Golf',
    path: '?tab=golf',
    icon: faGolfBall
  },
  {
    name: 'Table Tennis',
    path: '?tab=table-tennis',
    icon: faTableTennisPaddleBall
  },
  {
    name: 'Streaming',
    path: '?tab=streaming',
    icon: faSignal
  },
  {
    name: 'Schedule',
    path: '?tab=schedule',
    icon: faCalendar
  }
]
const TopNavBar = () => {
  
  const TopNavLinkItem = (link, i) => (
    <div sm={1} key={i}>     
      <Link href={link.path} prefetch={false} className="icon-text-width">
        <a
          itemProp='url'
          className='text-decoration-none text-secondary d-flex flex-column text-center p-2'         
        >
          <FontAwesomeIcon 
            icon={link.icon} 
            className={`fa-2x text-secondary mb-2 mt-2`}
          />
          <small  style={{ whiteSpace: 'nowrap', width: '72px', overflow: 'hidden' }}>
          {link.name}
          </small>
        </a>
      </Link>
    </div>
  )

  return (
    <StyleSideNav className='d-flex justify-content-between'>
        {topNavLinks.map(TopNavLinkItem)}
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
 
  @media screen and (max-width: 990px) {
    .betcart-mb {
       display: none;
    }
  
  }
`

const StyleBetCart = styled.div`
  color: #fff;
  .share-btn {
    border: none;
    color: #0f0f0f;
    background-color: #fff;
  }
  .close-btn {
    border: none;
    background: none;
    color: #fff;
  }
  .custom-input {
    width: 82px;
    text-align: center;
    border-radius: 0px;
    border: none;
  }
  .custom-sm-btn {
    border: none;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    color: #000;
  }
  .custom-sm-btn-right {
    border: none;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    color: #000;
  }
 .position-tooltip {
   right: 55px;
   background: #fff;
   border-radius: 6px;
   width: auto;
   color: #000;
   padding-top: 5px;
   padding-bottom: 3px;
   padding-right: 3px;
   padding-left: 3px;
   margin-bottom: 85px;
 }
 .close-tooltip {
   display: none;
 }
 .custom-label {
   padding: 4px;
   font-weight: bolder;
 }

 @media screen and (min-width: 990px) {
  .mobile-down {
    display: none;
  }
 
}
`
const StyleSpinner = styled.div`
 margin: 50% auto;
 width: 1rem;
`
const StyleShareContainer = styled.div`
.h6-close {
  cursor: pointer;
  opacity: .7;
  transition: .3s ease-in;
}
.h6-close:hover {
  opacity: 1;
}
.social-hover {
  cursor: pointer;
  opacity: 1;
  transition: .2s ease-in;
}
.social-hover:hover {
  opacity: .71;
}
`
export const Betslip = ({ clicked }) => {
  const [slip, setSlip] = useState([])
  const [oddsTotal, setOddsTotal] = useState(0)
  const [shareCode, setShareCode] = useState(null)
  const [balance, setBalance] = useState(0)
  const [isModalOpen, setModalOpen] = useState(false);

  const [isCongratulationModalOpen, setCongratulationModalOpen] = useState(false);
  const [clickedd, setClicked] = useState(false)
  const { isAuthenticated } = useAuth({ middleware: 'guest' })
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(null)
  const congratulationsLinkBarRef = useRef();
  const linkBarRef = useRef();
  const router = useRouter()
  const { sp_s } = router.query
  const closeMenu = () => setModalOpen(false)
  const closeCongratulationsMenu = () => setCongratulationModalOpen(false)

  const fetchUrlSessionSlip = (shared_code_url, shared_code_storage) => {
    if(shared_code_url) {
      axios
      .get(`api/betslips/${shared_code_url}`)
      .then(d => {
        if(d.status === 200) {
          setSlip(d.data)
        }
      })
      .catch(e => console.error(e.message)) 
    }

    if(shared_code_storage) {
      axios
      .get(`api/betslips/${shared_code_storage}`)
      .then(d => {
        if(d.status === 200) {
          setSlip(d.data)
        }
      })
      .catch(e => console.error(e.message)) 
    }

  }
 

  const fetchBetslips = (session) => {

      axios
        .get(`api/betslips/${session}`)
        .then(d => setSlip(d.data))
        .catch(e => console.error(e.message))
  }

  const fetchBetslipOddsTotal = (session) => {
      axios
        .get(`api/betslips/sessions/${session}/odds-total`)
        .then(d => setOddsTotal(Number(d.data.odds_total).toFixed(2)))
        .catch(e => console.error(e.message))
  }

const BalanceModal = () => {
    return (
      <Modal show={isModalOpen} className="mt-5 pt-5">
        <Modal.Body modalId="modal-ref" className="p-4" style={{ background: '#e4e4e4' }}>
           <Span modalId="modal-ref" className='fw-bold p-2 d-block mb-2' onClick={closeMenu} style={{ cursor: 'pointer', width: 32 }}>X</Span>  
           <div className='m-3' modalId="modal-ref">
            <span className='fw-bold d-block mb-2' modalId="modal-ref">Insufficient Funds</span>    
            <span modalId="modal-ref" className='alert alert-danger d-block' style={{ padding: 5 }} >
              Your current balance is too low to place this bet. Deposit now.              
            </span>
            <div className='alert alert-secondary'>
              <p>|--- GO TO LIPA NA MPESA</p>     
              <p>|--- ENTER PAYBILL BUSINESS NO.: <b>123123</b></p>
              <p>|--- ENTER ACCOUNT NO.: <b>07XX-XXX-XXX</b></p>
              <p>|--- ENTER AMOUNT & SEND</p>
              <p>|--- ONCE YOU RECEIVE MPESA NOTIFICATION, GO AHEAD AND PLACE YOUR BET</p>
            </div>            
           </div>   
        </Modal.Body>                            
     </Modal>
    )
}

const StyleStars = styled.div`
.custom-1 {
  position: absolute;
  margin-top: 20px;
  margin-left: 40px;
}
.custom-2 {
  position: absolute;
  margin-top: 60px;
  left: 70px;
} 
.custom-2-1 {
  position: absolute;
  margin-top: 20px;
  right: -30px;
} 
.custom-3 {
  position: absolute;
  margin-top: 5px;
  right: 10px;
} 
.custom-4 {
  position: absolute;
  margin-top: 15px;
  right: -60px;
} 
.balloon-1 {
  position: absolute;
  margin-top: 0px;
  right: 50px;
}
.balloon-2 {
  position: absolute;
  margin-top: 60px;
  right: -80px;
}
`
const StyleCongratulationsModalMidMenu = styled.div`
h1,h2 {
  line-height: 42px;
}
a {
  line-height: 32px;
}
.small-position {
  margin-top: 2px;
  font-size: 14px;
}
`
const CongratulationModal = () => {
  const Stars = () => {
    return (
      <div className='d-flex justify-content-center mt-3' style={{ position: 'absolute', width: '50%' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-stars text-light" viewBox="0 0 16 16">
          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-stars text-warning custom-1" viewBox="0 0 16 16">
          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-balloon-fill text-warning" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8.48 10.901C11.211 10.227 13 7.837 13 5A5 5 0 0 0 3 5c0 2.837 1.789 5.227 4.52 5.901l-.244.487a.25.25 0 1 0 .448.224l.04-.08c.009.17.024.315.051.45.068.344.208.622.448 1.102l.013.028c.212.422.182.85.05 1.246-.135.402-.366.751-.534 1.003a.25.25 0 0 0 .416.278l.004-.007c.166-.248.431-.646.588-1.115.16-.479.212-1.051-.076-1.629-.258-.515-.365-.732-.419-1.004a2.376 2.376 0 0 1-.037-.289l.008.017a.25.25 0 1 0 .448-.224l-.244-.487ZM4.352 3.356a4.004 4.004 0 0 1 3.15-2.325C7.774.997 8 1.224 8 1.5c0 .276-.226.496-.498.542-.95.162-1.749.78-2.173 1.617a.595.595 0 0 1-.52.341c-.346 0-.599-.329-.457-.644Z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-balloon-fill text-warning balloon-1" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8.48 10.901C11.211 10.227 13 7.837 13 5A5 5 0 0 0 3 5c0 2.837 1.789 5.227 4.52 5.901l-.244.487a.25.25 0 1 0 .448.224l.04-.08c.009.17.024.315.051.45.068.344.208.622.448 1.102l.013.028c.212.422.182.85.05 1.246-.135.402-.366.751-.534 1.003a.25.25 0 0 0 .416.278l.004-.007c.166-.248.431-.646.588-1.115.16-.479.212-1.051-.076-1.629-.258-.515-.365-.732-.419-1.004a2.376 2.376 0 0 1-.037-.289l.008.017a.25.25 0 1 0 .448-.224l-.244-.487ZM4.352 3.356a4.004 4.004 0 0 1 3.15-2.325C7.774.997 8 1.224 8 1.5c0 .276-.226.496-.498.542-.95.162-1.749.78-2.173 1.617a.595.595 0 0 1-.52.341c-.346 0-.599-.329-.457-.644Z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-balloon-fill text-warning balloon-2" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8.48 10.901C11.211 10.227 13 7.837 13 5A5 5 0 0 0 3 5c0 2.837 1.789 5.227 4.52 5.901l-.244.487a.25.25 0 1 0 .448.224l.04-.08c.009.17.024.315.051.45.068.344.208.622.448 1.102l.013.028c.212.422.182.85.05 1.246-.135.402-.366.751-.534 1.003a.25.25 0 0 0 .416.278l.004-.007c.166-.248.431-.646.588-1.115.16-.479.212-1.051-.076-1.629-.258-.515-.365-.732-.419-1.004a2.376 2.376 0 0 1-.037-.289l.008.017a.25.25 0 1 0 .448-.224l-.244-.487ZM4.352 3.356a4.004 4.004 0 0 1 3.15-2.325C7.774.997 8 1.224 8 1.5c0 .276-.226.496-.498.542-.95.162-1.749.78-2.173 1.617a.595.595 0 0 1-.52.341c-.346 0-.599-.329-.457-.644Z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-stars text-light custom-2" viewBox="0 0 16 16">
          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-stars text-warning custom-2-1" viewBox="0 0 16 16">
          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-stars text-light custom-3" viewBox="0 0 16 16">
          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-stars text-light custom-4" viewBox="0 0 16 16">
          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
        </svg>
      </div>
    )
  }
    return (
      <Modal show={isCongratulationModalOpen} className="mt-5">
      <Modal.Body modalId="modal-ref" className="p-4 bg-primary rounded" >
        <Span 
        modalId="modal-ref" 
        className='fw-bold p-2 d-block mb-2 float-end' 
        onClick={closeCongratulationsMenu} 
        style={{ cursor: 'pointer', width: 32 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-x-circle-fill text-light" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
          </svg>
        </Span>  
        <StyleStars>
          <Stars/>
        </StyleStars>
        <div className='d-flex justify-content-center mt-5 pt-4 w-100' style={{ zIndex: 2 }}>
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="104" height="104" 
            fill="currentColor" 
            className="bi bi-trophy-fill text-warning " 
            viewBox="0 0 16 16">
              <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
            </svg>
          </div>
        <StyleCongratulationsModalMidMenu className='text-center mt-3 mb-3'>
          <h1 modalId="modal-ref" className='fw-bold text-light'>Congratulations!</h1>
          <h3 className='mt-2 mb-4 text-light'>You have placed your bet successfully!</h3>
          <div className='d-flex'>
            <Link href='#'>
              <a
                itemProp='url'
                className='btn btn-light w-100 mt-2 m-1 shadow-lg d-flex justify-content-center'
              >
                <i className="bi bi-share" style={{ marginRight: 5 }}></i>
                <small className='small-position'>Share</small>
              </a>
              </Link>
              <Link href='/history?his_tab=sbets&tab=all'>
              <a
                itemProp='url'
                className='btn btn-warning w-100 mt-2 m-1 shadow-lg d-flex justify-content-center'
              >
                <i className="bi bi-card-list" style={{ marginRight: 5 }}></i>
                <small className='small-position'>View Bet</small>               
              </a>
          </Link>
          </div>
        
        </StyleCongratulationsModalMidMenu>
      
      </Modal.Body>                            
   </Modal>
    )
}

const EmptyCart = () => {
  const [code, setCode] = useState('')

  const handleBetCode = (e) => {
    const betCode = e.target.value
    setCode(betCode)
  }
  const loadBetCode = () => {
    sessionStorage.setItem('share_code', code)
    fetchUrlSessionSlip(code)
  }
    return (
      <div className='card bg-success p-1 shadow'>
        <div className='d-flex justify-content-between'>
         <h5 className='fw-bold text-light' style={{ marginLeft: 8, lineHeight: '24px', letterSpacing: 1 }}>BETSLIP</h5>
         <i className="bi bi-three-dots-vertical text-light"></i>
       </div>
        <div className='betslip-child shadow'>     
          <span className='d-block fw-bold text-center mt-4'>You have not selected any bet</span>
          <span className='d-block text-center'>Make your first pick to start playing.</span>
          <hr/>
          <div className='text-center mb-2'>
              <span className='d-block m-2'>Or introduce your bet code:</span>
              <input className="form-control w-100 p-2 mb-2" value={code} placeholder="Bet Code" onChange={handleBetCode}/>   
              <button className='btn btn-secondary mt-2 w-100 shadow' onClick={loadBetCode}>Add Betslip Code</button>        
          </div>      
        </div>
      </div>
    )
}

const CartElements = (link, i) => {
 
   const fixId = String(link.fixture_id).slice(0,6) + link.session_id 
   const removeSingleBetslipFixture = (fixture_id) => {
   
    axios.delete(`api/betslips/fixtures/${fixture_id}`)
 
    setClicked(prev => !prev)
  
  }
  
    return (
      <React.Fragment key={i}>  
        <div style={{ paddingTop: 0, paddingRight: '14px', paddingLeft: '14px'}}>
          <div className='d-flex align-items-center justify-content-between'>
            <div className='mt-2'>
                <FontAwesomeIcon icon={faSoccerBall} style={{ marginRight: '5px' }}/>
                <Small>{link.betslip_teams}</Small>
            </div>
            <button 
            className='close-btn fw-bold'
            onClick={() => removeSingleBetslipFixture(fixId)}
            >
              x
            </button>
          </div>
          <Small>{link.betslip_market}</Small>
          <div className='d-flex align-items-center justify-content-between'>      
              <Small>Your Pick: {link.betslip_picked}</Small>
              <Small className='fw-bold'>{link.betslip_odds}</Small>
          </div>
          <hr className='mt-1 mb-1' style={{ margin: 0, color : '#FF7F50' }}/>  
        </div>    
      </React.Fragment>
    )
}

const BetCartFormElements = () => {
    const [betAmount, setBetAmount] = useState(configData.MINIMUM_DEPOSIT_AMOUNT);
 
    const incrementBetAmount = () => setBetAmount(prev => prev += configData.INCREMENT_DECREMENT_AMOUNT)

    const decrementBetAmount = () => {
      if(betAmount <= 50) {
        return
      }
      setBetAmount(prev => prev -= configData.INCREMENT_DECREMENT_AMOUNT)
    }

    const updateBetAmount = (e) => {
      setBetAmount(Number(e.target.value));  
    }
    const removeBetslipCart = () => {
      const sessionId = sessionStorage.getItem('session_id')
      sessionStorage.removeItem('share_code')
      router.push('/')
      axios.delete(`api/betslips/sessions/${sessionId}`)  
      setClicked(prev => !prev)
    }

    const possibleWin = betAmount * oddsTotal 

    const postBetslipCartToDb = async (session_id, user_id, bet_amount, total_odds, final_payout) => {
     
      const res = await axios.post('api/checkout', {
        session_id,
        user_id,
        total_odds,
        final_payout,
        stake_amount: bet_amount
      })

      if(res.status === 200) {
        setLoading(false)
        setCongratulationModalOpen(true)
      }
    }


    const postBalanceAfterPlacing = async () => {
      await axios.post(`api/users/${userId}/balance/decrement`, {
        'user_id': userId,
        'amount': betAmount
      } ,
      {
        headers: {
          'x-sportsapp-key': configData.SPORTS_APP_KEY
        }
      })
    }

    const setNewSessionStorage = () => {
     sessionStorage.setItem('session_id', Date.now())
    }
    const postBetslipCart = (e) => {
      e.preventDefault()   
      setLoading(true)

      const balanceAfterPlacing = balance - betAmount
  
      if(balance < betAmount || balanceAfterPlacing < 0) {
        setModalOpen(true)
        setLoading(false)
        return
      }   

      const sessionId = Number(sessionStorage.getItem('session_id'));
  
      postBetslipCartToDb(sessionId, userId, betAmount, Number(oddsTotal), possibleWin)
      postBalanceAfterPlacing()
      setNewSessionStorage()
  
    } 

    const UserBalanceElement = () => {
      
    if(userId) {
      const { data, error, isLoading } = useGetBalanceByUserIdQuery(userId)
  
      if(error) {
        return <span>Error...</span>
      }
      if(isLoading) {
        return ''
      }
      
      const { amount } = data;
    
      setBalance(amount)
      return (
        <>
         {!!isAuthenticated && slip?.data?.length !== 0 ? 
          <div className='d-flex align-items-center justify-content-between mb-1'>
            <Small>Balance:</Small>
            <Small className='fw-bold'>
              <FontAwesomeIcon 
              icon={faRefresh} 
              style={{ 
                cursor: 'pointer',
                paddingRight: 8, 
                paddingLeft: 8,
              }}
              />
              KES {balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </Small>
          </div>
          : ''
        }
        </>
      )
    }
     
    }
    return (
        <div style={{ paddingTop: 0, paddingRight: '14px', paddingLeft: '14px', background: '#505050', paddingBottom: '4px' }}>
        {slip?.data?.length !== 0 &&
         <div className='d-flex align-items-center justify-content-between'>
              <Small>Total Odds:</Small>
              <Small className='fw-bold'>{oddsTotal}</Small>
         </div>
        }
       
        <UserBalanceElement/>
         {slip?.data?.length !== 0 &&
         <>
         <div className='d-flex align-items-center justify-content-between'>
          <Small>Amount (Kshs)</Small>
          <div className='d-flex'>
            <button className='custom-sm-btn fw-bold btn btn-secondary text-light' onClick={decrementBetAmount}>-</button>
            <InputNumber 
            value={betAmount}
            className="form-control custom-input"
            onChange={updateBetAmount}
            />
            <button className='custom-sm-btn-right fw-bold btn btn-secondary text-light' onClick={incrementBetAmount}>+</button>
          </div>
          <div className={`position-absolute position-tooltip ${betAmount >= 50 ? 'close-tooltip' : ''}`}>
            <i 
            className="bi bi-info bg-secondary text-light fw-bold rounded-circle custom-label" 
            style={{ marginRight: '3px' }}></i>
            <Small>Minimum stake <b className='fw-bold'>Ks 50.00</b></Small>
          </div>
         
        </div>
         <div className='d-flex align-items-center justify-content-between mb-3'>
            <Small>Possible Payout (Kshs):</Small>
            <Small className='fw-bold text-warning'>
              {Number(possibleWin).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </Small>
        </div>
          <Row className='mb-3'>          
            <Col lg={6} sm={12}>
              <button 
              ref={linkBarRef}      
              disabled={!isAuthenticated || loading}
              className='btn btn-light shadow-sm mb-1 text-dark w-100'
              style={{ letterSpacing: 1 }}
              onClick={postBetslipCart}
              >
                {loading ? 
                <Spinner
                animation="grow"
                size="sm"
              >
              </Spinner>
                        :
                ''}             
              {loading ? 'Loading...' : 'Place Bet'}
              </button>
            </Col>
            <Col lg={6} sm={12} className="align-items-center">
              <button 
              className='btn btn-danger shadow-sm mb-1 text-light w-100 ' 
              onClick={() => removeBetslipCart()}
              style={{ letterSpacing: 1 }}
              >                
                Remove All
              </button>
            </Col>
          </Row>
        </>
        }
        </div>
    )
}

const [modalOpen, setIsModalOpen] = useState(false)
const [mobileCartHeight, setMobileCartHeight] = useState(0)

const toggleShareBtn = () => setIsModalOpen(prev => !prev)
const openMobileBetslip = () => {
  if(mobileCartHeight === 0) {
    setMobileCartHeight('auto')
  }
  if(mobileCartHeight === 'auto') {
    setMobileCartHeight(0)
  }
}
const BetslipCartHeader = () => {
  return (
    <div className='d-flex align-items-center justify-content-between p-3 rounded shadow card-header' style={{ borderBottom: '2px solid #FF7F50' }}>
     {slip?.data?.length !== 0 &&
      <div 
      onClick={openMobileBetslip}
      style={{ cursor: 'pointer' }}
      >
      {slip?.data?.length > 1 ? 
      <div className='d-flex align-items-center'>
        {mobileCartHeight === 0 ? 
        <i className="bi bi-chevron-double-up mobile-down" style={{ marginRight: 5 }}></i>:   
        <i className="bi bi-chevron-double-down mobile-down" style={{ marginRight: 5 }}></i>
        }
        <p className='fw-bold' style={{ margin: 0 }}>  Multi Bet ({slip?.data?.length})</p>
      </div>
      :
      <div className='d-flex align-items-center'>      
       {mobileCartHeight === 0 ? 
        <i className="bi bi-chevron-double-up mobile-down" style={{ marginRight: 5 }}></i>:   
        <i className="bi bi-chevron-double-down mobile-down" style={{ marginRight: 5 }}></i>
        }
        <p className='fw-bold' style={{ margin: 0, letterSpacing: 1 }}>Single Bet ({slip?.data?.length})</p> 
      </div>
      } 
    
    </div>
      }
        <div className='btn btn-light btn-sm text-dark'  onClick={toggleShareBtn}>
        <i className="bi bi-share" style={{ marginRight: '5px' }}></i>
        <button className='share-btn'>Share</button>
      </div>  
    </div>
  )
}

const StlyeInputClipboard = styled.div`
  input {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  button {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
`
const StyleCopied = styled.div`
 position: absolute;
 right: 0;  
 margin-top: -20px;
 margin-right: 25px;
`
const ShareContainer = () => {
  const [session, setSession] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [copiedSmall, setCopiedSmall] = useState('none')
  const [copiedSmall2, setCopiedSmall2] = useState('none')
  const [isCodeCopied, setIsCodeCopied] = useState(false)
  const fullUrl = `https://www.bet360.co.ke?sp_s=${session}`
  const codeSession = session

  const [social, setSocial] = useState({
    facebook: '',
    twitter: '',
    whatsapp: '',
    telegram: ''
  })
  const { getSocialShareLinks } = useSocialShare()
  const fetchSocialLinks = async (session_id) => {
    const data = await getSocialShareLinks(session_id)
   
    setSocial(prev => ({
      ...prev,
      facebook: data.links.facebook,
      twitter: data.links.twitter,
      whatsapp: data.links.whatsapp,
      telegram: data.links.telegram
    }))
  }

  const handleClick = () => {
     copyToClipboard(fullUrl)
     .then(() => {
        setIsCopied(true)
        setCopiedSmall2('')
        setTimeout(() => {
          setIsCopied(false)
          setCopiedSmall2('none')
        }, 1500)
     })
     .catch(e => {
      console.error(e)
     })
  }

  const handleCodeClick = () => {
    copyToClipboard(session)
    .then(() => {
      setIsCodeCopied(true)
      setCopiedSmall('')
       setTimeout(() => {
        setIsCodeCopied(false)
        setCopiedSmall('none')
       }, 1500)
    })
    .catch(e => {
     console.error(e)
    })
  }

useEffect(() => {
  const sessionId = sessionStorage.getItem('session_id')
  const userId = localStorage.getItem('u_i');
  setUserId(userId)
  fetchSocialLinks(sessionId)
  setSession(sessionId)
}, [])

return (
    <Modal show={modalOpen} className="mt-5">
      <StyleShareContainer>
      <Modal.Header className='bg-secondary'>
       <h5 className="fw-bold text-light">Share Bet</h5>
       <h6 onClick={toggleShareBtn} className="bg-secondary p-2 rounded-pill text-light cursor-pointer h6-close">X</h6>
      </Modal.Header>
      <Modal.Body>
        <span className='d-flex justify-content-center m-2'>Share this bet with friends so that they can bet on it too!</span>
        <div className='mb-2 mt-3 p-3'>
          <Row>
            <Col className='d-flex justify-content-around'>
              <Link href={social.facebook}>
              <a target="_blank" itemProp='url' className="d-flex flex-column align-items-center social-hover text-decoration-none text-dark">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-facebook mb-2" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
                <span>Facebook</span>
              </a>  
            </Link>
            <Link href={social.whatsapp}>
              <a target="_blank" itemProp='url' className="d-flex flex-column align-items-center social-hover text-decoration-none text-dark">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-whatsapp mb-2" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
                <span>Whatsapp</span>
              </a>
            </Link>
              
              <Link href={social.twitter}>
                <a target="_blank" itemProp='url' className="d-flex flex-column  align-items-center social-hover text-decoration-none text-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-twitter mb-2" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                  <span>Twitter</span>
                </a>
              </Link>
              <Link target="_blank" href={social.telegram}>
                <a itemProp='url' className="d-flex flex-column  align-items-center social-hover text-decoration-none text-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-telegram mb-2" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"/>
                  </svg>
                  <span>Telegram</span>
                </a>
              </Link>  
            </Col>
          </Row>
         
        </div>
        <hr className='text-secondary'/>
        <div className='p-3'>
          <span className='d-block'>Copy the link: </span>
          <StlyeInputClipboard>
          <div className='d-flex'>           
              <input className='form-control' value={fullUrl} readOnly={true}/>
              <button className='btn btn-secondary' onClick={handleClick}>
                {isCopied ? 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard2-check" viewBox="0 0 16 16">
                    <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z"/>
                    <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12Z"/>
                    <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3Z"/>
                  </svg>
                          :
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard2" viewBox="0 0 16 16">
                    <path d="M3.5 2a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5H12a.5.5 0 0 1 0-1h.5A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1H4a.5.5 0 0 1 0 1h-.5Z"/>
                    <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5Z"/>
                  </svg>   
                }        
              </button>    
               <StyleCopied style={{ display: `${copiedSmall2}` }}>
                  <small className='badge badge-info text-dark'>Copied</small>
                </StyleCopied>       
          </div>
          </StlyeInputClipboard>

        </div>
        <div className='p-3'>
        <span className='d-block'>Or copy the bet code: </span>
          <StlyeInputClipboard>
            <div className='d-flex'>
              <input className='form-control' value={codeSession} readOnly={true}/>
              <button className='btn btn-secondary' onClick={handleCodeClick}>
              {isCodeCopied ? 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard2-check" viewBox="0 0 16 16">
                    <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z"/>
                    <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12Z"/>
                    <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3Z"/>
                  </svg>
                          :
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard2" viewBox="0 0 16 16">
                    <path d="M3.5 2a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5H12a.5.5 0 0 1 0-1h.5A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1H4a.5.5 0 0 1 0 1h-.5Z"/>
                    <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5Z"/>
                  </svg>   
                }          
              </button>  
                <StyleCopied style={{ display: `${copiedSmall}` }}>
                  <small className='badge badge-info text-dark'>Copied</small>
                </StyleCopied>
            </div>
          </StlyeInputClipboard>

        </div>
      
      </Modal.Body>
      </StyleShareContainer>
      
    </Modal>
  )
}
const StyleMobileCartItems = styled.div`
  position: fixed;
  height: auto;
  padding-right: 0;
  padding-left: 12px;
  bottom: 0px;
  z-index: 3;
  background-color: #444;
  width: 100%;
  margin: 0;
  @media screen and (min-width: 990px) {
    display: none;
  }
`
const StyleMobileElements = styled.div`
  max-height: 320px;
  overflow-y: scroll;
  height: ${mobileCartHeight};
  padding: 6px;
  padding-bottom: 18px;
`
const MobileCartItems = () => {
  return (
    <StyleMobileCartItems className=' bg-success'>
        <StyleBetCart >
        <BetslipCartHeader/>
        <StyleMobileElements>
          {slip?.data?.length !== 0 && slip.data?.map(CartElements)}   
          <BetCartFormElements/>
        </StyleMobileElements>    
        </StyleBetCart>
    </StyleMobileCartItems>
  )
}

const BetslipSessionModal = () => {
  const closeMenu = () => setSessionModalOpen(false)

  const  {postBetslip} = useCustomBetslip()
  const [currentSession, setCurrentSession] = useState(null)
  const  sessionSlip = useGetBetslipQuery(sp_s)
  const [isSessionModalOpen, setSessionModalOpen] = useState(false)

  const checkSlipSession = () => {
    if(sp_s !== undefined) {
       setSessionModalOpen(true)
    }
    if(sp_s === undefined) {
      setSessionModalOpen(false)
    }
  }

  const postSessionCart = () => {
    sessionStorage.setItem('share_code', sp_s)
    if(sessionSlip.isSuccess) {
      sessionSlip.data.data.map(name => {
        const {betslip_market, betslip_odds,betslip_picked,betslip_teams, fixture_id } = name
     
      if(currentSession) { postBetslip({
          fixture_id: fixture_id,
          session_id: currentSession,
          betslip_teams: betslip_teams,
          betslip_market,
          betslip_picked,
          betslip_odds
        })
        .then(d => {
          if(d === 200) {
            setClicked(prev => !prev)
            setSessionModalOpen(false)
            router.push('/')
          }
        })}
      
      })
    }
    setClicked(prev => !prev)
            setSessionModalOpen(false)
            router.push('/')
   
  }

  useEffect(() => {
    const currentSession = sessionStorage.getItem('session_id')
    setCurrentSession(currentSession)
    checkSlipSession()
  }, [])
  return (
    <>
      <Modal show={isSessionModalOpen}>
        <Modal.Header>
          <h4>Load Betslip</h4>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <h4>Bet Code: {sp_s}</h4>
            <Col>
              <button className='btn btn-primary w-100' onClick={postSessionCart}>CONFIRM</button>
            </Col>
            <Col>
              <button className='btn btn-danger w-100' onClick={closeMenu}>CANCEL</button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  )
}

  useEffect(() => {
    const currentSession = sessionStorage.getItem('session_id')
    const sharedSessionCode = sessionStorage.getItem('share_code')
    fetchBetslips(currentSession)
    fetchBetslipOddsTotal(currentSession)
    fetchUrlSessionSlip(sp_s , sharedSessionCode)

  }, [clicked, clickedd, sp_s])

  return (
    <>
     <StyleBetslip className='mx-auto'>
      <StyleBetCart className='betcart-mb card bg-success shadow'>
     
      <ShareContainer/> 

      {slip?.data?.length > 0 ? 
      <> <BetslipCartHeader/>{ slip.data?.map(CartElements)} <BetCartFormElements/></> : 
      <EmptyCart/>}
    
      <BetslipSessionModal/>

      </StyleBetCart>
      <CongratulationModal/>
      <BalanceModal/>
      <AddedFeatures/>
      <Offers/>
    </StyleBetslip>
    <MobileCartItems/>

    </>
   
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
    <StyledFeatures className='mt-4'>
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

export default App;