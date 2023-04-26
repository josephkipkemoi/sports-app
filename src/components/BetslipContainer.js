import React, {useState, useRef ,useEffect} from "react";
import  { 
    faSoccerBall,
    faRefresh,
    faTimesCircle,
    faCheckCircle
  }  from "@fortawesome/free-solid-svg-icons";
import Spinner  from 'react-bootstrap/Spinner';
import useSocialShare from '../hooks/socialShare';
import {useGetBalanceByUserIdQuery} from '../hooks/balance';

import { 
    H5, InputNumber, Small, Span, 
 } from '../components/Html';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  { faShare, faCertificate }  from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import configData from '../../config.json';
import  Modal  from 'react-bootstrap/Modal';
import copyToClipboard from '../hooks/copyToClipboard';
import styled from "styled-components";
import  Row  from "react-bootstrap/Row";
import  Col  from "react-bootstrap/Col";
import Tooltip from "./Tooltip";
import axios from "../lib/axios";
import MobileNavComponent from "./MobileNavComponent";
import useAuth from "../hooks/auth";
import AuthUser from "../hooks/AuthUser";
import { randomString } from "../hooks/generateRandomId";
import { CongratulationModal } from "./HtmlElements";
import UserBalance from "./UserBalance";
import OffersModal from "./OffersModal";

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
const StyleBetCart = styled.div`
  color: #fff;
  border: none;
  .share-btn {
    line-height: 24px;
    letter-spacing: 1px;
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
const StyleBetslip = styled.div`
  background-color: #383838;
  padding: 1rem;
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
    padding: 0;
    margin: 0;
    margin-left: 3px;
    .betcart-mb {
      position: fixed;
      bottom: 50px;
      width: 100%;
      margin: 0;
      padding: 0;
      z-index: 2;
    }
   .empty-mobile {
    display: none;
   }
   .mobile-form {
     max-height: 320px;
     overflow-y: scroll;
   }
  }
`
export default function BetslipContainer({ megaJackpotId, market, fiveJackpotId, setMegaJackpotId, setFiveJackpotId }) {
    const [clicked, setClicked] = useState(false)
    const [modalOpen, setIsModalOpen] = useState(false)
    const [mobileCartHeight, setMobileCartHeight] = useState('auto')
    const [code, setCode] = useState('')

    const postSharedCode = async (shareId, user_id, codes) => {
      const betslips = codes.map(c => {
        return sessionStorage.getItem(c)
      })
 
      if(user_id) {
        const res = await axios.post('api/social-share/codes', {
              codes,
              user_id,
              share_code:shareId,
              betslips: JSON.stringify(betslips),
          })

          if(res.status === 201) {
            const { data: { share_code } } = res
            setCode(share_code)
            sessionStorage.setItem('session_id', Date.now())
          }
        } else {
          const res = await axios.post('api/social-share/codes', {
            codes,
            share_code:shareId,
            betslips: JSON.stringify(betslips),
        })

        if(res.status === 201) {
          const { data: { share_code } } = res
          setCode(share_code)
          sessionStorage.setItem('session_id', Date.now())
        }
        }
    
    }

    const toggleShareBtn = (e) => {
      const random = (Math.random() + 1).toString(36).substring(7);
      const codes = JSON.parse(sessionStorage.getItem('fixture_ids'))
      const user = JSON.parse(localStorage.getItem('uu_id'));

      if(e.target.getAttribute('share_code')) {
        postSharedCode(random, user?.uu_id?.id, codes)
      }
   
      setIsModalOpen(prev => !prev)

    }
  
    const openMobileBetslip = (e) => {
      const targetSlip = e.target.getAttribute('slip')
      const target = e.target.id
      const isClicked = ( targetSlip === 'active' ||                  
                          target === 'mobile' ||
                          target === 'mobile-txt' )
  
      if(isClicked && mobileCartHeight === 0) {
        setMobileCartHeight('auto')
      }
      if(isClicked && mobileCartHeight === 'auto') {
        setMobileCartHeight(0)
      }
  
    }
    
const BetslipCartHeader = ({ length }) => {
      return (
        <div 
        className='d-flex align-items-center justify-content-between p-2 shadow-sm' 
        style={{ backgroundColor: '#001041', color: '#fff', borderTopLeftRadius: '0px', borderTopRightRadius: '0px'}} 
        onClick={openMobileBetslip}
        slip="active"
        >
         {length !== 0 &&
          <div 
          style={{ cursor: 'pointer' }}
          >
          {length > 1 ? 
          <div className='d-flex align-items-center' slip="active">
            {mobileCartHeight === 0 ? 
            <i className="bi bi-chevron-double-up mobile-down" slip="active" id="cart-header-su" style={{ marginRight: 5 }}></i> :   
            <i className="bi bi-chevron-double-down mobile-down" id="cart-header-sd" style={{ marginRight: 5 }}></i>
            }
            <h6 className='fw-bold' id="cart-header-multi" slip="active" style={{ margin: 0, letterSpacing: '1px', padding: 0 }}>  Multi Bet ({length})</h6>
          </div>
          :
          <div className='d-flex align-items-center' slip="active">      
           {mobileCartHeight === 0 ? 
            <i className="bi bi-chevron-double-up mobile-down"  slip="active" id="cart-header-mu" style={{ marginRight: 5 }}></i> :   
            <i className="bi bi-chevron-double-down mobile-down"  slip="active" id="cart-header-md" style={{ marginRight: 5 }}></i>
            }
            <h6 className='fw-bold' id="cart-header-single"  slip="active" style={{ margin: 0, letterSpacing: 1 }}>Single Bet ({length})</h6> 
          </div>
          } 
        
        </div>
          }
            <div className='btn btn-sm rounded-pill text-white shadow-sm' share_code="share_code"  onClick={toggleShareBtn}>
              <FontAwesomeIcon icon={faShare} style={{ marginRight: '5px' }} share_code="share_code"/>
              <small className='text-white fw-bold share-btn' share_code="share_code" >Share</small>
            </div>  
        </div>
      )
}
    
const EmptyCart = () => {
    
      const LoadBetCodeComponent = () => {
        // const [code, setCode] = useState('')
    
        const handleBetCode = (e) => {
          const betCode = e.target.value
          setCode(betCode)
        }
        const loadBetCode = async () => {
          // const res = await axios.get('api/social-share/codes/show?share_code=9650297')
          // if(res.status === 200) {
          //    const { data } = res
          //    const ids = []
          //    data.fixtures.map(d => d.map(e => {
          //     ids.push(e.fixture_id)
          //     sessionStorage.setItem('shared_ids', JSON.stringify(ids))
          //     sessionStorage.setItem(e.fixture_id, JSON.stringify(e))
          //   }))
          // }
        }
        return (
           <div className=' d-sm-flex'>
              <input className="form-control shadow w-100 m-1" value={code} placeholder="Bet Code" onChange={handleBetCode}/>   
              <button className='btn btn-secondary shadow w-100 m-1' onClick={loadBetCode} id="add_code">Add Code</button>        
            </div>
        )
      }
        return (
          <div className='card bg-success p-1 shadow empty-mobile'>
            <div className='d-flex justify-content-between'>
             <h5 className='fw-bold' style={{ marginLeft: 8, lineHeight: '24px', letterSpacing: 1, color: '#ffffff' }}>BETSLIP</h5>
             <i className="bi bi-three-dots-vertical text-light"></i>
           </div>
           <div style={{ position: 'relative', zIndex: 2 }}>
              <Tooltip
                message="To load betslip, add your Bet code here"
                number={2}
                right={100}
                top={40}
                caret_position="down"
              />
            </div>
            <div className='betslip-child shadow'>     
              <span className='d-block fw-bold text-center mt-4' style={{ color: '#ffffff', letterSpacing: 1 }}>You have not selected any bet</span>
              <span className='d-block text-center' style={{ color: '#ffffff', letterSpacing: 1 }}>Make your first pick to start playing.</span>
              <hr/>
              <div className='text-center mb-2'>
                  <span className='d-block m-2' style={{ color: '#ffffff', letterSpacing: 1 }}>Or introduce your bet code:</span>
                  <LoadBetCodeComponent/>
              </div>      
            </div>
          </div>
        )
}
  
const CartElements = (link, i) => {
      const fixId = String(link?.fixture_id).slice(0,6)  
       const removeSingleBetslipFixture = (fixture_id) => {
       
       sessionStorage.removeItem(fixture_id)
      }
      
        return (
          <React.Fragment key={i}>  
            <div style={{   paddingRight: '14px', paddingLeft: '14px'}}>
              <div className='d-flex align-items-center justify-content-between'>
                <div className='pt-2'>
                    <FontAwesomeIcon className="text-dark" icon={faSoccerBall} style={{ marginRight: '5px' }}/>
                    <Small>{link && link.betslip_teams}</Small>
                </div>
                <button 
                className='close-btn fw-bold text-dark'
                id="close-btn"
                onClick={() => removeSingleBetslipFixture(fixId)}
                >
                  x
                </button>
              </div>
              <Small>{link && link.betslip_market}</Small>
              <div className='d-flex align-items-center justify-content-between'>      
                  <Small>Your Pick: {link && link.betslip_picked}</Small>
                  <Small className='fw-bold'>{link && link.betslip_odds}</Small>
              </div>
              <hr className='mt-1 mb-1' style={{ margin: 0, color : '#FF7F50' }}/>  
            </div>    
          </React.Fragment>
        )
}
  
  const fetchIds = () => {
    const ids = JSON.parse(sessionStorage.getItem('fixture_ids'))
 
    const result = ids?.map(id => {
      const data = JSON.parse(sessionStorage.getItem(id))
     
      return data
    })
  
    return result
  }
  
  const listenToClickEvent = () => {
    window.addEventListener('click', (e) => {
      if(
        e.target.id === 'fix-btn' ||
        e.target.id === 'close-btn' ||
        e.target.getAttribute('removebtn') === 'remove-btn'
       ) {
        setClicked(prev => !prev)
      }
    })
  }

  const data = fetchIds()?.filter(v => !!v)
 
  const megaJackpotIds = [...new Set(megaJackpotId)]
  const jackpotFiveIds = [...new Set(fiveJackpotId)]
 
  if(market === 'Mega Jackpot') {
    sessionStorage.setItem(market, JSON.stringify(megaJackpotIds))
  }

  if(market === 'Five Jackpot') {
    sessionStorage.setItem(market, JSON.stringify(jackpotFiveIds))
  }

  // Fetch jackpot games from loacalstorage
  const [megaJackpotGames, setMegaJackpotGames] = useState([])
  const [fiveJackpotGames, setFiveJackpotGames] = useState([])

  const [megaJackpotLength, setMegaJackpotLength] = useState(0)
  const [jackpotFiveLength, setJackpotFiveLength] = useState(0)

  const jackpotGames = (mjIds, fjIds) => {

      const mega_jackpot_games = mjIds?.map(id => {
        const games = sessionStorage.getItem(id+"Mega Jackpot") 
        return games
      })

      const five_jackpot_games = fjIds?.map(id => {
        const games = sessionStorage.getItem(id+"Five Jackpot") 
        return games
      })

      return {
        mega: mega_jackpot_games,
        five: five_jackpot_games,
      }
  }

 
  const fetchJackpotGames = () => {
    const megaJackpotIds = JSON.parse(sessionStorage.getItem("Mega Jackpot"))
    const fiveJackpotIds = JSON.parse(sessionStorage.getItem("Five Jackpot"))

    const {mega, five} = jackpotGames(megaJackpotIds, fiveJackpotIds)

    if(megaJackpotIds) {
      setMegaJackpotLength(mega?.length)
      setMegaJackpotGames(mega)
    }

    if(fiveJackpotIds) {
      setJackpotFiveLength(five?.length)
      setFiveJackpotGames(five)
    }

  }

  useEffect(() => {
    listenToClickEvent()
    fetchJackpotGames()

    window.addEventListener('click', ({ target}) => {
      if(
        target.getAttribute('j_click') === 'jp' || 
        target.getAttribute('removebtn') === 'remove-btn'
      ) {
        fetchJackpotGames()
     }
    })
  
  }, [megaJackpotId, fiveJackpotId])
 
  return (
    <StyleBetslip>
      <JackpotBetCart 
        market={market} 
        setMegaJackpotId={setMegaJackpotId}
        setFiveJackpotId={setFiveJackpotId}
        mj_length={megaJackpotLength}
        fj_length={jackpotFiveLength}
        megaJackpotGames={megaJackpotGames}
        fiveJackpotGames={fiveJackpotGames}
      /> 
    <StyleBetCart 
    className='betcart-mb card bg-light shadow pb-4' 
    >
        <ShareContainer 
        isModalOpen={modalOpen} 
        toggleShareBtn={toggleShareBtn}
        share_code={code}
        />
      
        {
         data?.length > 0 ?
          <>
             <BetslipCartHeader length={data?.length}/>
             <div style={{ height: `${mobileCartHeight}` }}>
              <div  className="mobile-form">
                {data?.map(CartElements)}
              </div>
             
              <BetCartFormElements 
                betData={data}
              />
             </div>       
          </>
          : <EmptyCart/>
        } 

      </StyleBetCart>
 
      <MobileNavComponent 
        length={data?.length}
        openSlip={openMobileBetslip}
      />
      </StyleBetslip>
    )
  }

const StyleJackpotCart = styled.div`
border-top-right-radius: 6px;
border-top-left-radius: 6px;
.mg-header {
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
}
.mg-header-len {
  margin-left: 6px;
}
  hr {
    margin-top: .25rem;
    margin-bottom: .25rem;
    padding: 0;
    color: lightgray;
  }
`

const JackpotBetCart = ({ 
  setMegaJackpotId, 
  mj_length, 
  fj_length, 
  setFiveJackpotId, 
  megaJackpotGames, 
  fiveJackpotGames,
 }) => {

 
  return (
    <>
    {mj_length > 0 &&  <JackpotCart
        market={"Mega Jackpot"}   
        jackpotGames={megaJackpotGames} 
        length={mj_length}
        setMegaJackpotId={setMegaJackpotId} 
      />}

      { fj_length > 0 &&  <JackpotCart
        market={"Five Jackpot"}   
        jackpotGames={fiveJackpotGames} 
        length={fj_length}
        setFiveJackpotId={setFiveJackpotId}
      />}

    </>
  )
}


const StyleSubmitButton = styled.button`
  width: 100%;
  border-radius: 6px;
  border: none;
  margin: .25rem;
  // :hover {
  //   cursor: not-allowed;
  // }
  // :hover::before {
  //   content: 'Log in to place bet';
  //   position: absolute;
  //   left: 0;
  //   margin-left: 10px;
  //   margin-top: -40px;
  //   padding: 5px;
  //   background: white;
  //   border-radius: 4px;
  //   letter-spacing: 1px;
  // }
`

const JackpotCart = ({ market, jackpotGames, length, setMegaJackpotId, setFiveJackpotId }) => {

  const [betAmount, ] = useState(100)
 
  const [isModalOpen, setIsModalOpen] = useState(false)

  const closeModal = () => setIsModalOpen(false)
 
  const removeJackpotCart = () => {

    if(market === 'Mega Jackpot') {
      setMegaJackpotId([])
      sessionStorage.removeItem(market)
    }
    
    if(market === 'Five Jackpot') {
      setFiveJackpotId([])
      sessionStorage.removeItem(market)
    }

  }

  const removeSingleBetslip = (i, market) => {
    const sessionIds = JSON.parse(sessionStorage.getItem(market))
    sessionIds.splice(sessionIds.indexOf(String(i)), 1)
  
    if(market === 'Mega Jackpot') {
      setMegaJackpotId(sessionIds)
      sessionStorage.removeItem(i+market)
    }

    if(market === 'Five Jackpot') {
      setFiveJackpotId(sessionIds)
      sessionStorage.removeItem(i+market)
    }

  }
  const { uu_id } = AuthUser()   
  return (
    <StyleJackpotCart className={`bg-${market === 'Mega Jackpot' ? 'dark' : 'dark'} mt-1 rounded shadow mb-2`}>
      <div className="d-flex justify-content-between align-items-center mb-3 bg-secondary p-1 mg-header" style={{ margin: 0, padding: 0 }}>
          <span className="text-white fw-bold mg-header-len">{market} ({length})</span>
          <div className="d-flex align-items-center btn btn-outline-secondary btn-sm">
            <FontAwesomeIcon className="text-light" icon={faShare}  share_code="share_code"/>
            <Small className='text-light fw-bold share-btn' style={{ marginLeft: 5 }} share_code="share_code" >Share</Small>
          </div>
      </div>

      <div className="mt-3" style={{ paddingLeft: '.55rem', paddingRight: '.55rem' }}>
        {jackpotGames?.map((d,i) => {
          const jData = JSON.parse(d)
          return (
            <React.Fragment key={i}>
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <span className="d-flex align-items-center">
                    <Small style={{ marginRight: 9 }}>{jData.id}.</Small>
                    <FontAwesomeIcon icon={faSoccerBall} style={{ marginRight: 6 }}/>
                    {jData.home} - {jData.away}
                  </span>
                  <Small>Your Pick: {jData.picked}</Small>
                </div>
                <button 
                  className="btn btn-sm" 
                  onClick={() => removeSingleBetslip(jData.sessionId, market)}
                  removebtn="remove-btn"
                >
                  <i removebtn="remove-btn" className="bi bi-x-circle-fill text-light"></i>
                </button>
              </div>            
              <hr/>
            </React.Fragment>
          )
        })}
      </div>

      <div style={{ paddingLeft: '.55rem', paddingRight: '.55rem' }}>
        <UserBalanceElement />
      </div>

      <div className="row mb-3" style={{ paddingLeft: '.55rem', paddingRight: '.55rem' }}>
        <Col>
          <Small>Bet Amount</Small>
        </Col>
        <Col className="text-end">
          <Small>KES {betAmount}.00</Small>
        </Col>      
      </div>
      <div className="d-flex justify-content-between" style={{ paddingLeft: '.55rem', paddingRight: '.55rem', paddingBottom: '.75rem' }}>     
       
        <button 
          className="btn btn-secondary w-100 shadow m-1"
          onClick={removeJackpotCart}
          j_click="jp"
        >
          REMOVE ALL   
        </button>
        <SubmitJackpotButton 
          betAmount={betAmount}
          setIsModalOpen={setIsModalOpen}
          market={market}
          length={length}
          jackpotGames={jackpotGames}
        />
      </div>
      <CongratulationModal 
        isModalOpen={isModalOpen} 
        closeModal={closeModal}
        historyRoute="history?his_tab=jbets&tab=j_all"
        market="Jackpot"
      />
  </StyleJackpotCart>
  )
}

const SubmitJackpotButton = ({ betAmount, setIsModalOpen, market, length, jackpotGames }) => {
 
  const [loading, setLoading] = useState(false)
  const { uu_id } = AuthUser()
  const { data, refetch } = useGetBalanceByUserIdQuery(uu_id.id)

  const postBalanceAfterPlacing = async () => {
    const res = await axios.post(`api/users/${uu_id.id}/balance/decrement`, {
      'user_id': uu_id.id,
      'amount': betAmount
    } ,
    {
      headers: {
        'x-sportsapp-key': configData.SPORTS_APP_KEY
      }
    })

    if(res.status === 200) {
      refetch()
    }
  }

  const submitJackpot = async () => {
    setLoading(true)
    if(data.amount < betAmount) {
      alert('Insufficient Balance, Top up to continue')
    }

    if( betAmount > 100) {
      alert('Kshs 100 is accepted per bet')
    }

    const { status } = await axios.post(`api/jackpot/${uu_id.id}/cart`, {
      user_id: uu_id.id,
      jp_picked: JSON.stringify(jackpotGames),
      jp_market: market
    })
 
    if(status === 201) {
      postBalanceAfterPlacing()
      setLoading(false)
      setIsModalOpen(true)
    }
    
  }
 
  const Button = ({ 
    disabled=!uu_id.id ||
    betAmount < 100 || 
    (market === 'Mega Jackpot' && Number(length) !== 10) || 
    (market === 'Five Jackpot' && Number(length) !== 5)
  }) => <StyleSubmitButton onClick={submitJackpot} disabled={disabled}>
          {loading ? <Spinner animation="grow"/> : 'PLACE BET'}
        </StyleSubmitButton>

  return (
    <>
       <Button></Button>
    </>
  )
}




const BetCartFormElements = ({ betData }) => {
    const [isCongratulationModalOpen, setCongratulationModalOpen] = useState(false)
    const [loading, setLoading] = useState(null)
    const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false)
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false)
    const [betAmount, setBetAmount] = useState(configData.MINIMUM_DEPOSIT_AMOUNT);
    const closeCongratulationsMenu = () => setCongratulationModalOpen(false)
    const closeMenu = () => setIsBalanceModalOpen(false)
    const closeOffer = () => setIsOfferModalOpen(false)

    const incrementBetAmount = () => setBetAmount(prev => prev += configData.INCREMENT_DECREMENT_AMOUNT)
    
    const { uu_id } = AuthUser()

    const {data, refetch} = useGetBalanceByUserIdQuery(uu_id.id)

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
        sessionStorage.clear()
      }

      const postBonusBalanceAfterPlacing = async (cart_id,possible_payout,betAmount,cart ) => {
        const res = await axios.post('api/users/fixtures/cart', {
          cart_id,
          possible_payout,
          cart,
          bet_amount: betAmount,
          user_id: uu_id.id
        })
  
        if(res.status === 200) {
          setLoading(false)
          setCongratulationModalOpen(true)
        }

        const balance_response = await axios.post(`api/users/${uu_id.id}/bonus`, {
          bonus: betAmount
        });

        if(balance_response.status === 200) {
          refetch()
        }
     
      }
  
      const setNewSessionStorage = () => {
        sessionStorage.clear()
        sessionStorage.setItem('session_id', Date.now())
      }
  
      const postBetslipCart = async () => {
        setLoading(true)
  
        const balanceAfterPlacing = data.amount - betAmount
        const bonusAfterPlacing = data.bonus - betAmount
        const cart_id = randomString()
        const possible_payout = Math.floor(possibleWin)

        if( data.amount < betAmount || balanceAfterPlacing < 0 ) {
            if(data.bonus < betAmount || bonusAfterPlacing < 0) {
              setIsBalanceModalOpen(true)
              setLoading(false)
             } else {
              return postBonusBalanceAfterPlacing(cart_id, possible_payout, betAmount, JSON.stringify(betData))
             }

          setIsBalanceModalOpen(true)
          setLoading(false)
          return
        }   
        
        const res = await axios.post('api/users/fixtures/cart', {
          cart_id,
          possible_payout,
          bet_amount: betAmount,
          user_id: uu_id.id,
          cart: JSON.stringify(betData)
        })
  
        if(res.status === 200) {
          refetch()
          setLoading(false)
          setCongratulationModalOpen(true)
        }
  
        setNewSessionStorage()
     
      } 
  
      let res = 1
      
      betData.forEach(n => res = res * n.betslip_odds )
  
      const linkBarRef = useRef();
      let possibleWin = res * betAmount
  
      
      return (
          <div 
          style={{ 
            marginTop: 4,
            paddingTop: 12, 
            paddingRight: '14px', 
            paddingLeft: '14px', 
            background: '#ebeded', 
            paddingBottom: '4px' 
            }}
          >
          {betData?.length !== 0 &&
           <div className='d-flex align-items-center justify-content-between'>
                <Small>Total Odds:</Small>
                <Small className='fw-bold'>
                  {res.toFixed(2)}
                </Small>
           </div>
          }
          <div>
              <div className="d-flex align-items-center justify-content-between">
                <Small>Balance</Small>
                <UserBalance user_id={uu_id?.id} type="regular" />
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <Small>Bonus</Small>

                <div className="d-flex align-items-center">
                  <FontAwesomeIcon 
                    icon={faCertificate} 
                    className="text-danger" 
                    size="lg" 
                    style={{ marginRight: 3, cursor: 'pointer' }}
                    onClick={() => setIsOfferModalOpen(true)}
                  />
                  <UserBalance user_id={uu_id?.id} type="bonus" />
                </div>
              </div>
          </div>
          
           {betData?.length !== 0 &&
           <>
           <div className='d-flex align-items-center justify-content-between mb-1'>
            <Small>Amount (Kes)</Small>
            <div className='d-flex'>
              <button className='custom-sm-btn fw-bold btn btn-secondary text-light' onClick={decrementBetAmount}>-</button>
              <InputNumber 
              placeholder={betAmount}
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
              <Small>Possible Payout (Kes):</Small>
              <Small className='fw-bold text-dark'>
                {Number(possibleWin).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </Small>
          </div>
            <div className="d-flex mb-2">           
                <button 
                  className='btn btn-danger rounded-pill shadow-sm m-1 text-light w-100 d-flex justify-content-center align-items-center' 
                  id="close-btn"
                  onClick={() => removeBetslipCart()}
                  style={{ letterSpacing: 1 }}
                >      
                <FontAwesomeIcon size="1x" icon={faTimesCircle} style={{ marginRight: 6 }}/>          
                  Clear Slip
                </button>

                <button 
                ref={linkBarRef}      
                disabled={loading || !uu_id.id}
                className='btn btn-light rounded-pill shadow-sm m-1 text-dark w-100 d-flex justify-content-center align-items-center'
                style={{ letterSpacing: 1 }}
                onClick={() => postBetslipCart()}
                >
                   <i className="bi bi-hand-index-thumb" style={{ marginRight: 6 }}></i>
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
            </div>
            
          </>
          }
          <CongratulationModal 
            isModalOpen={isCongratulationModalOpen} 
            closeModal={closeCongratulationsMenu}
            historyRoute="history?his_tab=sbets&tab=all"
            market="Bet"
          />
          <BalanceModal isModalOpen={isBalanceModalOpen} closeMenu={closeMenu}/>
          <OffersModal isModalOpen={isOfferModalOpen} closeMenu={closeOffer} />
        </div>
      )
}

const BalanceModal = ({ isModalOpen, closeMenu }) => {
    return (
      <Modal show={isModalOpen} className="mt-5 pt-5">
        <Modal.Body modalid="modal-ref" className="p-4" style={{ background: '#e4e4e4' }}>
           <Span 
           modalid="modal-ref" 
           className='fw-bold p-2 d-block mb-2 float-end' 
           onClick={closeMenu} style={{ cursor: 'pointer', width: 32 }}
           >
            X
          </Span>  
           <div className='m-3' modalid="modal-ref">
            <span className='fw-bold d-block mb-2' modalid="modal-ref">Insufficient Funds</span>    
            <span modalid="modal-ref" className='alert alert-danger d-block' style={{ padding: 5 }} >
              Your current balance is too low to place this bet. Deposit now.              
            </span>
            <div className='alert alert-secondary'>
              <p>|--- GO TO LIPA NA MPESA</p>     
              <p>|--- ENTER PAYBILL BUSINESS NO.: <code className="fw-bold" style={{ fontSize: '1.2rem' }}>{configData.MPESA_PAYBILL_NUMBER}</code></p>
              <p>|--- ENTER ACCOUNT NO.: <b>07XX-XXX-XXX</b></p>
              <p>|--- ENTER AMOUNT & SEND</p>
              <p>|--- ONCE YOU RECEIVE MPESA NOTIFICATION, GO AHEAD AND PLACE YOUR BET</p>
            </div>            
           </div>   
        </Modal.Body>                            
     </Modal>
    )
}

const ShareContainer = ({ isModalOpen, toggleShareBtn, share_code }) => {

    const [isCopied, setIsCopied] = useState(false)
    const [copiedSmall, setCopiedSmall] = useState('none')
    const [copiedSmall2, setCopiedSmall2] = useState('none')
    const [isCodeCopied, setIsCodeCopied] = useState(false)
 
    const fullUrl = `https://www.pinaclebet.com/share/${share_code}`

    const [social, setSocial] = useState({
      facebook: '',
      twitter: '',
      whatsapp: '',
      telegram: ''
    })

    const { getSocialShareLinks } = useSocialShare()
    const fetchSocialLinks = async (share_code) => {
      const data = await getSocialShareLinks(share_code)
    
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
      copyToClipboard(share_code)
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
      fetchSocialLinks(share_code)
  
    }, [])
  return (
      <Modal show={isModalOpen} className="mt-5">
        <StyleShareContainer>
        <Modal.Header className='bg-secondary'>
         <h5 className="fw-bold text-light">Share Bet</h5>
         <h6 onClick={toggleShareBtn} className="bg-secondary p-2 rounded-pill text-light cursor-pointer h6-close">X</h6>
        </Modal.Header>
        <Modal.Body>
          <span className='d-flex justify-content-center m-2'>
            Share this bet with friends so that they can bet on it too!
          </span>
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
                <input className='form-control' value={share_code} readOnly={true}/>
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
  
  