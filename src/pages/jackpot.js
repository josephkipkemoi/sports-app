import React, { useState } from "react";
import  Row from "react-bootstrap/Row";
import  Col  from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";
import BetslipContainer from '../components/BetslipContainer';
import CustomerInfo from '../components/CustomerInfo';
import TopNavBar from "../components/TopNavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSoccerBall } from '@fortawesome/free-solid-svg-icons'
import axios from "../lib/axios";
import { useGetJackpotFixturesQuery } from "../hooks/admin";
import GameComponent from '../components/GameComponent';

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
export default function Jackpot() {
    const [jackpotId, setJackpotId] = useState([])

    const megaJackpotData = useGetJackpotFixturesQuery('Mega Jackpot')
    const fiveJackpotData = useGetJackpotFixturesQuery('Five Jackpot')
 
    if(megaJackpotData.isLoading || fiveJackpotData.isLoading) {
       return <Spinner animation="grow"/>
    }

    if(megaJackpotData.error || fiveJackpotData.error) {
       return <span>Try again later!</span>
    }
   
    return (
        <StyledJackpot>
            <Row className="px-2">
                <Col lg="9" md="9" sm="12" style={{ padding: 0 }}> 
                    <TopNavBar/>

                 
                    <JackpotContainer 
                        data={megaJackpotData.data}
                        setJackpotId={setJackpotId}
                        jackpot="Mega Jackpot"
                        jackpot_prize="10,134,344.00"
                        games_count="10"
                    />

                    <JackpotContainer 
                        data={fiveJackpotData.data} 
                        setJackpotId={setJackpotId}
                        jackpot="Five Jackpot"
                        jackpot_prize="5,654,152.00"
                        games_count="5"
                    /> 
                   
                </Col>
                <Col lg="3" md="3" sm="12" style={{ paddingLeft: 0 }}>
                    <BetslipContainer jackpotId={jackpotId}/>
                    <CustomerInfo/>
                </Col>
            </Row>       
        </StyledJackpot>
    )
}

const NoJackpotAvailable = () => {
    return (
        <div className="text-center mt-5 text-white p-5">
            <span>No games available! Check again later</span>
        </div>
    )
}

const JackpotContainer = ({ data, setJackpotId, jackpot, games_count, jackpot_prize }) => {
 
    const JackpotItems = (n, i) => {

        const handleData = (e) => {
            const id = e.target.getAttribute('id')
            const home = e.target.getAttribute('home')
            const away = e.target.getAttribute('away')
            const picked = e.target.getAttribute('picked')
            
            const jData = {
                home,
                away,
                picked
            }

            sessionStorage.setItem(id, JSON.stringify(jData))
            setJackpotId(prev => prev.concat(id))
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
                <div className="col-lg-3 col-md-3 col-sm-3 d-flex">
                    <button 
                    className="btn btn-success m-1 w-100" 
                    style={{ width: '80px' }}
                    home={n.jp_home}
                    away={n.jp_away}
                    id={i}
                    j_click="jp"
                    picked="Home"
                    onClick={handleData}
                    disabled={!n.jp_active}
                    >
                        {n.jp_home_odds}
                    </button>
                    <button 
                    className="btn btn-success m-1 w-100" 
                    style={{ width: '80px' }}
                    home={n.jp_home}
                    j_click="jp"
                    away={n.jp_away}
                    id={i}
                    picked="Draw"
                    onClick={handleData}
                    disabled={!n.jp_active}
                    >
                        {n.jp_draw_odds}
                    </button>
                    <button 
                    className="btn btn-success m-1 w-100" 
                    style={{ width: '80px' }}
                    j_click="jp"
                    home={n.jp_home}
                    away={n.jp_away}
                    id={i}
                    picked="Away"
                    onClick={handleData}
                    disabled={!n.jp_active}
                    >
                        {n.jp_away_odds}
                    </button>
                </div>
            </div>
        )
    }
    return (
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
                        KSH {jackpot_prize}
                    </span>
                    <span>{games_count} Games</span>
                </div>
                <button style={{ margin: 0, padding: 0, background: 'none', border: 'none' }}>
                    <i className="bi bi-printer"  style={{ color: '#ffffff' }}></i>                
                </button>
            </div>
            <div className="col-lg-9 col-md-9 col-sm-9"></div>
            <div className="col-lg-3 col-md-3 col-sm-3">
                <div className="d-flex justify-content-between text-light text-center">
                    <span className=" w-100" style={{ width: '80px' }}>Home</span>
                    <span className=" w-100" style={{ width: '80px' }}>Draw</span>
                    <span className=" w-100" style={{ width: '80px' }}>Away</span>
                </div>
            </div>
            {data.map(JackpotItems)}
        </Row>
    )
}
