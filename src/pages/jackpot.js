import React, { useEffect, useState } from "react";
import  Row from "react-bootstrap/Row";
import  Col  from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";
import BetslipContainer from '../components/BetslipContainer';
import CustomerInfo from '../components/CustomerInfo';
import TopNavBar from "../components/TopNavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import { useGetJackpotFixturesQuery } from "../hooks/admin";
import { useGetJackpotPrizeWinsQuery } from "../hooks/jackpot";

const StyledJackpot = styled.div`
    background: #424242;
    h3 {
        letter-spacing: 1px;
    }
    span {
        letter-spacing: 1px;
        display: block;
    }
    .card-bb {
        min-height: 50vh;
    }
    .text-body {
        margin: 15vh auto;
    }
`
const StyleJackpotContainer = styled.div`
    height: 100vh;
    background-color: #edebeb;
    overflow-y: scroll;
    overflow-x: hidden;
`
export default function Jackpot() {
    const [megaJackpotId, setMegaJackpotId] = useState([])
    const [fiveJackpotId, setFiveJackpotId] = useState([])

    const [market, setMarket] = useState('')

    const megaJackpotData = useGetJackpotFixturesQuery('Mega Jackpot')
    const fiveJackpotData = useGetJackpotFixturesQuery('Five Jackpot')
    const jackpotPrize = useGetJackpotPrizeWinsQuery()

    const fetchJackpotGames = () => {
        const megaJackpotIds = JSON.parse(sessionStorage.getItem('Mega Jackpot'))
        const fiveJackpotIds = JSON.parse(sessionStorage.getItem('Five Jackpot'))

        if(megaJackpotIds) {
            setMegaJackpotId(megaJackpotIds)
        }   
        if(fiveJackpotIds) {
            setFiveJackpotId(fiveJackpotIds)
        }
    }

    useEffect(() => {

        fetchJackpotGames()

    }, [])

    if (
        megaJackpotData.isLoading || 
        fiveJackpotData.isLoading || 
        jackpotPrize.isLoading
        ) {
       return <Spinner animation="grow"/>
    }

    if  (
        megaJackpotData.error || 
        fiveJackpotData.error || 
        jackpotPrize.error
        ) {
       return <span>Try again later!</span>
    }

    const { data, MegaCount, FiveCount } = jackpotPrize.data
    const [ megaMarket, fiveMarket ] = data
    return (
        <StyledJackpot>
            <Row className="px-2">
                <Col lg="9" md="9" sm="12" style={{ padding: 0, height: 'auto' }}> 
                    <TopNavBar/>
                    <StyleJackpotContainer>
                        <JackpotContainer 
                            data={megaJackpotData.data}
                            setMegaJackpotId={setMegaJackpotId}
                            setMarket={setMarket}
                            jackpot={megaMarket?.market}
                            jackpot_prize={megaMarket?.jackpot_prize}
                            games_count={MegaCount}
                        />

                        <JackpotContainer 
                            data={fiveJackpotData.data} 
                            setFiveJackpotId={setFiveJackpotId}
                            setMarket={setMarket}
                            jackpot={fiveMarket?.market}
                            jackpot_prize={fiveMarket?.jackpot_prize}
                            games_count={FiveCount}
                        /> 

                        <NoJackpotAvailable/>
                    </StyleJackpotContainer>                   
                </Col>
                <Col lg="3" md="3" sm="12" style={{ paddingLeft: 0, height: '100vh', overflowY: 'scroll', overflowX: 'hidden' }}>
                    <BetslipContainer 
                        megaJackpotId={megaJackpotId} 
                        fiveJackpotId={fiveJackpotId}
                        setMegaJackpotId={setMegaJackpotId}
                        setFiveJackpotId={setFiveJackpotId}
                        market={market}
                    />
                    <CustomerInfo/>
                </Col>
            </Row>       
        </StyledJackpot>
    )
}

const NoJackpotAvailable = () => {
    return (
        <div className="text-center mt-5 text-dark p-5 ">
            <FontAwesomeIcon icon={faTrophy} size="10x" className="text-success"/>
            <h4 className="mt-3">Coming Soon!</h4>
        </div>
    )
}

const JackpotContainer = ({ data, setMegaJackpotId, setFiveJackpotId, jackpot, games_count, jackpot_prize, setMarket }) => {
 
    const JackpotItems = (n, i) => {

        const handleData = (e, btnIndex) => {
            const id = e.target.getAttribute('id')
            const home = e.target.getAttribute('home')
            const away = e.target.getAttribute('away')
            const picked = e.target.getAttribute('picked')
            const market = e.target.getAttribute('market')
            const divs = document.getElementsByClassName('mjp_btn_div')[i]
            const btn = divs.getElementsByClassName('jp_btn')
 
            for(let i = 0; i < btn.length; i++) {
                btn[i].classList.remove('active')
            }
    
            btn[btnIndex].classList.add('active')

            const jData = {
                home,
                away,
                picked,
                market,
                id: i+1,
                sessionId: i
            }
 
            sessionStorage.setItem(id+market, JSON.stringify(jData))

            if(market === 'Mega Jackpot') {
                setMegaJackpotId(prev => prev.concat(id))
                setMarket(market)

            }

            if(market === 'Five Jackpot') {
                setFiveJackpotId(prev => prev.concat(id))
                setMarket(market)
            }
        
        }
 
        return (
            <div key={i} className="d-flex justify-content-between shadow-sm mb-3">
                <div className="col-lg-9 col-md-9 col-sm-9 d-flex align-items-center">
                    <span className="text-white">{i+1}</span>
                    <div style={{ marginLeft: 20 }}>
                        <small className="text-light">{n.jp_time}</small>
                        <span className="text-white">{n.jp_home}</span>
                        <span className="text-white">{n.jp_away}</span>
                    </div>
                </div>
                <div 
                    className={`col-lg-3 col-md-3 col-sm-3 d-flex mjp_btn_div`}
                >
                    <button 
                        className={`btn btn-success m-1 w-100 ${n.jp_market === 'Mega Jackpot' ? 'jp_btn' : 'fjp_btn'} `}
                        style={{ width: '80px' }}
                        home={n.jp_home}
                        away={n.jp_away}
                        id={i}
                        market={n.jp_market}
                        j_click="jp"
                        picked={n.jp_home}
                        onClick={(e) => handleData(e,0)}
                        disabled={!n.jp_active}
                    >
                        {!n.jp_active ?  <i className="bi bi-exclamation-circle"></i> : n.jp_home_odds}                       
                    </button>
                    <button 
                        className="btn btn-success m-1 w-100 jp_btn" 
                        style={{ width: '80px' }}
                        home={n.jp_home}
                        j_click="jp"
                        away={n.jp_away}
                        id={i}
                        market={n.jp_market}
                        picked="Draw"
                        onClick={(e) => handleData(e,1)}
                        disabled={!n.jp_active}
                    >
                        {!n.jp_active ?  <i className="bi bi-exclamation-circle"></i> : n.jp_draw_odds}
                    </button>
                    <button 
                        className="btn btn-success m-1 w-100 jp_btn" 
                        style={{ width: '80px' }}
                        j_click="jp"
                        home={n.jp_home}
                        away={n.jp_away}
                        id={i}
                        market={n.jp_market}
                        picked={n.jp_away}
                        onClick={(e) => handleData(e,2)}
                        disabled={!n.jp_active}
                    >
                        {!n.jp_active ?  <i className="bi bi-exclamation-circle"></i> : n.jp_away_odds}
                    </button>
                </div>
            </div>
        )
    }
    return (
        <>
          {/* {data.length > 0 ? 
            <Row className="p-3" style={{ padding: 0, margin: 0 }}>              
            <div 
            className="d-flex align-items-center justify-content-between text-white p-3 bg-dark rounded shadow-sm mb-3"
            >
                <button style={{ margin: 0, padding: 0, background: 'none', border: 'none' }}>
                    <FontAwesomeIcon icon={faSoccerBall} className="text-white"/>
                </button>
                <div className="d-flex align-items-center">
                    <span className="fw-bold" >{jackpot}</span>
                    <span className="text-warning" style={{ marginRight: 10, marginLeft: 10 }}>
                        KSH {(Number(jackpot_prize)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                    <span>{games_count} Games</span>
                </div>
                <button style={{ margin: 0, padding: 0, background: 'none', border: 'none' }}>
                    <i className="bi bi-printer"  style={{ color: '#ffffff' }}></i>                
                </button>
            </div>
            <div className="col-lg-9 col-md-9 col-sm-9"></div>
            <div className="col-lg-3 col-md-3 col-sm-3">
                <div className="d-flex justify-content-between text-dark text-center">
                    <span className=" w-100" style={{ width: '80px' }}>Home</span>
                    <span className=" w-100" style={{ width: '80px' }}>Draw</span>
                    <span className=" w-100" style={{ width: '80px' }}>Away</span>
                </div>
            </div>
            {data.map(JackpotItems)}
        </Row>
          : <NoJackpotAvailable/>} */}
    
        </>          
    )
}

