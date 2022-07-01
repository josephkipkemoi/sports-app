import React, { useEffect, useRef, useState } from 'react';
import Head from '../components/Head';
import styled from 'styled-components';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';
import { useGetCustomFixturesQuery, useGetCustomOddsQuery, useGetFixturesQuery, useGetOddsFixtureQuery } from '../hooks/fixture';
import useCustomFixture from '../hooks/customFixture';
import useCustomOdds from '../hooks/odds';
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
function App() {

  const [clicked, setClicked] = useState(false)

 
  useEffect(() => {

    const currentSession = sessionStorage.getItem('session_id')
 
    if(!!currentSession === false) {
      sessionStorage.setItem('session_id', Date.now())
    }  

  },[clicked])



  const Games = () => {
    
    const { postFixture } = useCustomFixture();

    const { data, error, isLoading } = useGetFixturesQuery();

    if(isLoading) {
      return <span>loading...</span>
    }

    if(error){
      return <span>Error</span>
    }

    const { response } = data;

    let fixtureIdData = []
    let dateData = []
    let countryData = []
    let leagueNameData = []
    let homeTeamData = []
    let awayTeamData = []
    let logoData = []

    response.map(data => {
       const { fixture: { id, date }, league: { country, name, logo }, teams: { away, home } } = data;

       fixtureIdData.push(id)
       dateData.push(date)
       countryData.push(country)
       leagueNameData.push(name)
       homeTeamData.push(home.name)
       awayTeamData.push(away.name)
       logoData.push(logo)
    })
    const sendFixtureData = async (e) => {
      e.preventDefault()
     

     postFixture({
        'fixture_id': fixtureIdData,
        'fixture_date': dateData,
        'fixture_country': countryData,
        'fixture_league_name': leagueNameData,
        'fixture_logo': logoData,
        'home_team': homeTeamData,
        'away_team': awayTeamData
      })
 
        
    }
 
  
    return (
      <>
        <button onClick={sendFixtureData}>Click Me</button>
      </>
    )
   }

   const GameElement = () => {
    const { postBetslip } = useCustomBetslip()
    // const { getOdds } = useCustomOdds()
 
    const { data, error, isLoading } = useGetCustomOddsQuery()
    const fixture = useGetCustomFixturesQuery()
 
    const [fixtureData, setFixtureData] = useState([])
 
    if(error)
    {
      return <span>Errors</span>
    }

    if(isLoading)
    {
      return <span>loading...</span>
    }
 
    let newMarket = []

    if(fixture.status === 'fulfilled')
    {
  
      data.data.filter(([d]) => {
        
        if(JSON.parse(fixture?.data?.fixture_id).indexOf(d?.fixture.id) !== -1)
        {
          const ids = JSON.parse(fixture?.data?.fixture_id).indexOf(d?.fixture.id) 
          const home = JSON.parse(fixture?.data?.home_team)[ids] 
          const away = JSON.parse(fixture?.data?.away_team)[ids] 
     
      
          let oddsMarket = {
            home_team: home,
            away_team: away,
            league: d.league.name,
            fixture_id: d.fixture.id,
            market_odds: d.bookmakers
          }
        
          newMarket.push(oddsMarket)
        } 
         
      })
    }

    const sendBetslip = async (e)  => {
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
 

    return (
      <>
        {newMarket.map((data,i) => {
          return (
            <React.Fragment key={i + data.league}>
            <Col lg={8} sm={8} className="custom-grid-box-main p-2">  
      
              <Row style={{ marginLeft: 2 }}>
              <h5 className='header'>{data.league}</h5>
                <Col lg={1} md={1} sm={1}>
                  <Link href={`fixture/${data.fixture_id}?home=${data.home_team}&away=${data.away_team}`} >
                  <a
                    itemProp='url'
                    className='text-decoration-none text-light'  
                    onClick={() =>{
                      sessionStorage.setItem('home_team', data.home_team)
                      sessionStorage.setItem('away_team', data.away_team)                      
                      }}                  
                  >
                    <Small>
                      {data.market_odds[0].bets.length}
                      <i className="bi bi-arrow-right-short"></i>
                    </Small>
                  </a>
                  </Link>  
                </Col>
                <Col>
                  <span className='d-block'>{data.home_team} - </span>
                  <span className='d-block'>{data.away_team}</span>
                </Col>
                <Col></Col>
              </Row>
                     
            </Col>
            <Col lg={4} sm={4} className="d-flex">
              {data.market_odds[0].bets.map(odd => {             
                return odd.id === 1 && odd.values.map((val, i) => {
                   return (
                     <div key={i+val.name + val.odd} className='text-center mb-3 w-100'>
                        <span className='header text-center'>{val.value}</span>  
                       <button 
                        odds={val.odd} 
                        className='btn-custom'
                        btn_id={i}
                        home_team={data.home_team} 
                        market={odd.name} 
                        away_team={data.away_team} 
                        picked={val.value}
                        fixtureid={data.fixture_id}
                        onClick={sendBetslip}  
                        >{val.odd}</button>   
                                        
                     </div>
                   )
                 })
              })}
            </Col>
              <hr/>
          </React.Fragment>
          )
          
        })}
      </>
    )  
  }

  const GamesData = () => {
    return (
    <Row  className="custom-grid">     
       <GameElement />
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
              {/* <Games/> */}
              <Row>
               
                  <Col lg={9} md={12} sm={12}>
                  <StyledMain>
                   <TopNavBar/>
                   <CustomFilter/>
                   <hr/>
                   <StyleGameData>
                      <GamesData/>
                   </StyleGameData>   
                   </StyledMain>            
                  </Col>
                 
                  <Col lg={3} md={12} sm={12}>
                  
                   <Betslip clicked={clicked}/>
                  </Col>
              </Row>
            </main>
        </div>     
    </ThemedBody>
  );
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
 input[type=search] {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
 }
 button {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
 }
`
const CustomFilter = () => {
  return (
    <Row className="gy-2 p-2">
      <Col  className="d-flex align-content-center">
        <h3 className='text-light fw-bold'>Highlights</h3>
      </Col>
      <Col lg="6" md="6" sm="6" className="d-flex align-items-center">
        <StyleButton className='mx-auto d-flex'>
        <button className='btn'>
          <i className="bi bi-printer"></i>
        </button>        
        <button className='background-none'>
          <i className="bi bi-arrow-clockwise text-light p-1"></i>
          <small className='text-light'>Refresh</small>
        </button>
        </StyleButton>      
      </Col>
      <Col lg="3" md="3" sm="3" className='px-3'> 
        <StyleSearch className='d-flex mx-auto'>
          <input type="search" placeholder="Search" className="form-control"/>
          <button className='btn btn-secondary d-flex p-2'>
          <i className="bi bi-search"></i>
          </button>
        </StyleSearch>       
      </Col>
    </Row>    
  )
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
    border-left: 1px solid; 
    border-right: 1px solid;
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

const CongratulationModal = () => {
    return (
      <Modal show={isCongratulationModalOpen} className="mt-5 pt-5">
      <Modal.Body modalId="modal-ref" className="p-4" style={{ background: '#e4e4e4' }}>
        <Span 
        modalId="modal-ref" 
        className='fw-bold p-2 d-block mb-2' 
        onClick={closeCongratulationsMenu} 
        style={{ cursor: 'pointer', width: 32 }}
        >
          X
        </Span>  
        <h1 modalId="modal-ref">Congratulations Bet placed</h1>
        <Link href='/history'>
          <a
            itemProp='url'
            className='btn btn-warning btn-sm fw-bold'
          >
            View Bet
          </a>
        </Link>
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
      <>
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
         <Input className="form-control" value={code} placeholder="Bet Code" onChange={handleBetCode}/>           
         </Col>
         <Col sm={4} md={4} className='text-center inpt-xsm' lg={4}>
           <button className='btn btn-secondary' onClick={loadBetCode}>Add</button>
         </Col>           
       </Row>
   </div>
      </>
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
        <hr/>     
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


    const postBalanceAfterPlacing = (balance_after_placing) => {
      axios.post(`api/users/${userId}/balance`, {
        'user_id': userId,
        'amount': balance_after_placing
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
      postBalanceAfterPlacing(balanceAfterPlacing)
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
        <>
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
            <button className='custom-sm-btn fw-bold' onClick={decrementBetAmount}>-</button>
            <InputNumber 
            value={betAmount}
            className="form-control custom-input"
            onChange={updateBetAmount}
            />
            <button className='custom-sm-btn-right fw-bold' onClick={incrementBetAmount}>+</button>
          </div>
          <div className={`position-absolute position-tooltip ${betAmount >= 50 ? 'close-tooltip' : ''}`}>
            <i 
            className="bi bi-info bg-secondary text-light fw-bold rounded-circle custom-label" 
            style={{ marginRight: '3px' }}></i>
            <Small>Minimum stake <b className='fw-bold'>Ks 50.00</b></Small>
          </div>
         
        </div>
         <div className='d-flex align-items-center justify-content-between'>
            <Small>Possible Payout (Kshs):</Small>
            <Small className='fw-bold text-warning'>
              {Number(possibleWin).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </Small>
        </div>
        <div className='d-flex align-items-center justify-content-between' ref={congratulationsLinkBarRef}>
          <button 
          className='btn btn-danger btn-sm text-light w-100 ' 
          style={{ marginRight: '3px' }}
          onClick={() => removeBetslipCart()}
          >
            REMOVE ALL
          </button>
            <button 
            ref={linkBarRef}      
            disabled={!isAuthenticated || loading}
            className=' text-dark w-100'
            onClick={postBetslipCart}
            style={{ 
              border: 'none', 
              color: 'rgba(0,0,0,0.6)',
              cursor: `${!isAuthenticated ? 'not-allowed' : 'cursor'}`,
              padding: '0.25rem 0.5rem',
              borderRadius: 4,
              fontSize: '0.875rem',
              lineHeight: '1.5rem'
            }}
            >
              {loading ? 
               <Spinner
               animation="grow"
               size="sm"
               style={{ marginRight: 5 }}
             >
             </Spinner>
                      :
              ''}             
             {loading ? 'Loading...' : 'PLACE BET'}
            </button>
        </div>
        </>
        }
        </>
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
    <>
     {slip?.data?.length !== 0 &&
      <div 
      className='d-flex align-items-center justify-content-between p-2 bg-secondary' 
      onClick={openMobileBetslip}
      style={{ cursor: 'pointer' }}
      >
      {slip?.data?.length > 1 ? 
      <>
       <h6>
        {mobileCartHeight === 0 ? 
        <i className="bi bi-chevron-double-up mobile-down" style={{ marginRight: 5 }}></i>:   
        <i className="bi bi-chevron-double-down mobile-down" style={{ marginRight: 5 }}></i>
        }
        Multi Bet ({slip?.data?.length})
      </h6>
      </>
      :
      <>      
       <h6 className='d-flex align-items-center'>
       {mobileCartHeight === 0 ? 
        <i className="bi bi-chevron-double-up mobile-down" style={{ marginRight: 5 }}></i>:   
        <i className="bi bi-chevron-double-down mobile-down" style={{ marginRight: 5 }}></i>
        }
        Single Bet ({slip?.data?.length})
       </h6>
      </>
      } 
      <div  className='btn btn-light btn-sm text-dark'  onClick={toggleShareBtn}>
        <i className="bi bi-share" style={{ marginRight: '5px' }}></i>
        <button   className='share-btn'>Share</button>
      </div>  
    </div>
      }
    </>
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
  padding: 12px;
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
`
const MobileCartItems = () => {
  return (
    <StyleMobileCartItems>
      <StyleBetCart>
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
      <StyleBetCart className='betcart-mb'>
      <BetslipCartHeader/>
      <ShareContainer/> 
     
      {/* {slip.length === 0 && <EmptyCart/> } */}
      {slip.data === undefined && <StyleSpinner><Spinner animation="grow" size="lg"/></StyleSpinner>}
      {slip?.data?.length === 0 && <EmptyCart/>}
      {slip?.data?.length !== 0 && slip.data?.map(CartElements)}   
      <BetCartFormElements/>
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

export default App;