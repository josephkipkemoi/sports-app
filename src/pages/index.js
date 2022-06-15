import React, { useContext, useEffect, useRef, useState } from 'react';
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
import useGetBalanceByUserIdQuery from '../hooks/balance';
import axios from '../lib/axios';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import useAuth from '../hooks/auth';
import useClickOutside from '../hooks/useClickOutside';
import { Spinner } from 'react-bootstrap';
  
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
 function App() {
  const [sessionId, setSesstionId] = useState('');
  const [clicked, setClicked] = useState(false)
 

  useEffect(() => {

    const currentSession = sessionStorage.getItem('session_id')
 
    if(!!currentSession === false) {
      sessionStorage.setItem('session_id', Date.now())
    }  
    setSesstionId(currentSession)

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
            <Col lg={8} sm={8} className="custom-grid-box-main">   
              <h5 className='header'>{data.league}</h5>
              <Row>
                <Col lg={1} md={1} sm={1}>
                  <Link href={`fixture/${data.fixture_id}`}>
                  <a
                    itemProp='url'
                    className='text-decoration-none text-light'
                    
                  >
                    <Small>
                      {data.market_odds[0].bets.length}
                      <i className="bi bi-arrow-right-short"></i>
                    </Small>
                  </a>
                  </Link>  
                </Col>
                <Col>
                  <span className='d-block'>{data.home_team}</span>
                  <span className='d-block'>{data.away_team}</span>
                </Col>
                <Col></Col>
              </Row>
                     
            </Col>
            <Col lg={4} sm={4} className="d-flex">
              {data.market_odds[0].bets.map(odd => {             
                return odd.id === 1 && odd.values.map(val => {
                   return (
                     <div key={i+val.name + val.odd} className='text-center mb-3 w-100'>
                        <span className='header text-center'>{val.value}</span>                 
                        <button 
                        className='btn-custom' 
                        odds={val.odd} 
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
                   <h2> Filter</h2>
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

const StyleBetCart = styled.div`
  color: #fff;
  margin-bottom: 24px;
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
`
const StyleSpinner = styled.div`
 margin: 50% auto;
 width: 1rem;
`
export const Betslip = ({ data, clicked }) => {
  const [slip, setSlip] = useState([])
  const [oddsTotal, setOddsTotal] = useState(0)
  const [balance, setBalance] = useState(0)
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCongratulationModalOpen, setCongratulationModalOpen] = useState(false);
  const [clickedd, setClicked] = useState(false)
  const { user } = useAuth({ middleware: 'guest' })
  const linkBarRef = React.useRef();
  const congratulationsLinkBarRef = React.useRef();

  const closeMenu = () => setModalOpen(false)
  const closeCongratulationsMenu = () => setCongratulationModalOpen(false)

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
  
  const getBalance = async () => {
    if(!!user) {
      const res = await axios.get(`api/users/${user?.id}/balance`, {
        headers: {
          'x-sportsapp-key': configData.SPORTS_APP_KEY
        }
      })
  
      setBalance(res?.data?.amount)
    }  
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
              <p>|--- ENTER ACCOUNT NO.: <b>0{user?.phone_number}</b></p>
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
            View History
          </a>
        </Link>
      </Modal.Body>                            
   </Modal>
    )
  }

  const EmptyCart = () => {
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
         <Input className="form-control " placeholder="Bet Code"/>           
         </Col>
         <Col sm={4} md={4} className='text-center inpt-xsm' lg={4}>
           <button className='btn btn-secondary'>Add</button>
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
      axios.delete(`api/betslips/sessions/${sessionId}`)  
      setClicked(prev => !prev)
    }

    const possibleWin = betAmount * oddsTotal 

    const postBetslipCartToDb = (session_id, user_id, bet_amount, total_odds, final_payout) => {
    
      axios.post('api/checkout', {
        session_id,
        user_id,
        total_odds,
        final_payout,
        stake_amount: bet_amount
      })
    }

    const postBalanceAfterPlacing = (balance_after_placing) => {
      axios.post(`api/users/${user?.id}/balance`, {
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
      
      const balanceAfterPlacing = balance - betAmount
  
      if(balance < betAmount || balanceAfterPlacing < 0) {
        setModalOpen(true)
        return
      }   
      const sessionId = sessionStorage.getItem('session_id');
  
      postBetslipCartToDb(sessionId, user.id, betAmount, Number(oddsTotal), possibleWin)
      postBalanceAfterPlacing(balanceAfterPlacing)
      setCongratulationModalOpen(true)
      setNewSessionStorage()
  
    } 
    return (
        <>
        {slip?.data?.length !== 0 &&
         <div className='d-flex align-items-center justify-content-between'>
              <Small>Total Odds:</Small>
              <Small className='fw-bold'>{oddsTotal}</Small>
         </div>
        }
        {!!user ? 
          <div className='d-flex align-items-center justify-content-between mb-1'>
            <Small>Balance:</Small>
            <Small className='fw-bold'>
            <span class="glyphicon glyphicon-refresh"></span>
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
            disabled={!user}
            className=' text-dark w-100'
            onClick={postBetslipCart}
            style={{ 
              border: 'none', 
              color: 'rgba(0,0,0,0.6)',
              cursor: `${!user ? 'not-allowed' : 'cursor'}`,
              padding: '0.25rem 0.5rem',
              borderRadius: 4,
              fontSize: '0.875rem',
              lineHeight: '1.5rem'
            }}
            >
              PLACE BET
            </button>
        </div>
        </>
    )
  }

 

  useEffect(() => {
    const currentSession = sessionStorage.getItem('session_id')
    fetchBetslips(currentSession)
    fetchBetslipOddsTotal(currentSession)
    getBalance()
  }, [clicked, clickedd, user])

  return (
    <StyleBetslip className='mx-auto'>
      <StyleBetCart>
      {slip?.data?.length !== 0 &&
      <div className='d-flex align-items-center justify-content-between p-2 bg-secondary'>
      {slip?.data?.length > 1 ? <h6>Multi Bet ({slip?.data?.length})</h6> : <h6>Single Bet ({slip?.data?.length})</h6>} 
      <div className='btn btn-light btn-sm text-dark'>
        <i className="bi bi-share" style={{ marginRight: '5px' }}></i>
        <button className='share-btn'>Share</button>
      </div>         
    </div>

      
      }
        
        {slip?.data === undefined && <StyleSpinner><Spinner animation="grow" size="lg"/></StyleSpinner>}
        {slip?.data?.length === 0 && <EmptyCart/>}
        {slip?.data?.length !== 0 && slip.data?.map(CartElements)}
       
        <BetCartFormElements/>
      </StyleBetCart>
      <CongratulationModal/>
      <BalanceModal/>
      {/* <BetslipCart /> */}
      <AddedFeatures/>
      <Offers/>
    </StyleBetslip>
  )
}
 

const BetslipCart = ({}) => {

  const [betAmount, setBetAmount] = useState(configData.MINIMUM_DEPOSIT_AMOUNT);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCongratulationModalOpen, setCongratulationModalOpen] = useState(false);
  const [finalPayout, setFinalPayout] = useState(0)
  const [oddsTotal, setOddsTotal] = useState(0)
  const [balance, setBalance] = useState(0)
  const { user } = useAuth({ middleware: 'guest' })
  const [clickedd, setClicked] = useState(false)
  const [sessionId, setSessionId] = useState('')


  const fetchBetslipOddsTotal = () => {
    axios
      .get(`api/betslips/sessions/${sessionId}/odds-total`)
      .then(d => setOddsTotal(Number(d.data.odds_total).toFixed(2)))
      .catch(e => console.error(e.message))
  }


  const removeBetslipCart = () => {
    axios.delete(`api/betslips/sessions/${sessionId}`)  
    setClicked(prev => !prev)
  }

  const removeSingleBetslipFixture = (fixture_id) => {
 
    axios.delete(`api/betslips/fixtures/${fixture_id}`)
 
    setClicked(prev => !prev)
  
  }

  const getBalance = async () => {
    if(!!user) {
      const res = await axios.get(`api/users/${user?.id}/balance`, {
        headers: {
          'x-sportsapp-key': configData.SPORTS_APP_KEY
        }
      })
  
      setBalance(res?.data?.amount)
    }  
  }

  const postBalanceAfterPlacing = (balance_after_placing) => {
    axios.post(`api/users/${user?.id}/balance`, {
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

  const postBetslipCartToDb = (session_id, user_id, bet_amount, total_odds, final_payout) => {
    
    axios.post('api/checkout', {
      session_id,
      user_id,
      total_odds,
      final_payout,
      stake_amount: bet_amount
    })
  }

  const postBetslipCart = (e) => {
    e.preventDefault()   
    
    const balanceAfterPlacing = balance - betAmount

    if(balance < betAmount || balanceAfterPlacing < 0) {
      setModalOpen(true)
      return
    }   
    const sessionId = sessionStorage.getItem('session_id');

    postBetslipCartToDb(sessionId, user.id, betAmount, Number(oddsTotal), finalPayout)
    postBalanceAfterPlacing(balanceAfterPlacing)
    setCongratulationModalOpen(true)
    setNewSessionStorage()

  } 

  const closeMenu = () => setModalOpen(false)
  const closeCongratulationsMenu = () => setCongratulationModalOpen(false)

  const linkBarRef = React.useRef();
  const congratulationsLinkBarRef = React.useRef();

  useClickOutside(linkBarRef, closeMenu)
  useClickOutside(congratulationsLinkBarRef, closeCongratulationsMenu)

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
              <p>|--- ENTER ACCOUNT NO.: <b>0{user?.phone_number}</b></p>
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
            View History
          </a>
        </Link>
      </Modal.Body>                            
   </Modal>
    )
  }

  const EmptyCart = () => {
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
          <Input className="form-control " placeholder="Bet Code"/>           
          </Col>
          <Col sm={4} md={4} className='text-center inpt-xsm' lg={4}>
            <button className='btn btn-secondary'>Add</button>
          </Col>           
        </Row>
    </div>
       </>
     )
  }

 
  const BetCart = () => {

    const [slip, setSlip] = useState([])

    const fetchBetslips = () => {
      axios
        .get(`api/betslips/${sessionId}`)
        .then(d => setSlip(d.data))
        .catch(e => console.error(e.message))
    }
  

    const incrementBetAmount = () => setBetAmount(prev => prev += configData.INCREMENT_DECREMENT_AMOUNT)

    const decrementBetAmount = () => {
      if(betAmount <= 50) {
        return
      }
      setBetAmount(prev => prev -= configData.INCREMENT_DECREMENT_AMOUNT)
    }
    
    const updateBetAmount = (e) => {
      const amount = Number(e.target.value);
      setBetAmount(amount)   
    }

    const possibleWin = betAmount * oddsTotal

    setFinalPayout(possibleWin);

    useEffect(() => {
      fetchBetslips()
      getBalance()
      fetchBetslipOddsTotal()
  
      const sessionId = sessionStorage.getItem('session_id')
      setSessionId(sessionId)
    }, [1, clickedd])

    const BetCartElements = (link, i) => {
      const fixId = String(link.fixture_id).slice(0,6) + link.session_id 
 
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

    return (
      <StyleBetCart>
        <div className='d-flex align-items-center justify-content-between p-2 bg-secondary'>
          {/* {slip?.data?.length > 1 ? <h6>Multi Bet ({slip?.data?.length})</h6> : <h6>Single Bet ({slip?.data?.length})</h6>}  */}
          <div className='btn btn-light btn-sm text-dark'>
            <i className="bi bi-share" style={{ marginRight: '5px' }}></i>
            <button className='share-btn'>Share</button>
          </div>         
        </div>

        {!Array.isArray(slip) && slip.data.map(BetCartElements)}

          <div className='d-flex align-items-center justify-content-between'>
              <Small>Total Odds:</Small>
              <Small className='fw-bold'>{oddsTotal}</Small>
          </div>
          {!!user ? 
            <div className='d-flex align-items-center justify-content-between mb-1'>
              <Small>Balance:</Small>
              <Small className='fw-bold'>
              <span class="glyphicon glyphicon-refresh"></span>
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
          <div className='d-flex align-items-center justify-content-between'>
          <Small>Amount (Kshs)</Small>
          <div className='d-flex'>
            <button className='custom-sm-btn fw-bold' onClick={decrementBetAmount}>-</button>
            <InputNumber 
            className="form-control custom-input" 
            value={betAmount} 
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
            disabled={!user}
            className=' text-dark w-100'
            onClick={postBetslipCart}
            style={{ 
              border: 'none', 
              color: 'rgba(0,0,0,0.6)',
              cursor: `${!user ? 'not-allowed' : 'cursor'}`,
              padding: '0.25rem 0.5rem',
              borderRadius: 4,
              fontSize: '0.875rem',
              lineHeight: '1.5rem'
            }}
            >
              PLACE BET
            </button>
        </div>

      </StyleBetCart>
    ) 
  }

  return (
    <>
    <BetCart/>
      {/* {1 > 0 ? <BetCart/> : <EmptyCart/>}   */}
      <BalanceModal/>   
      <CongratulationModal/> 
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