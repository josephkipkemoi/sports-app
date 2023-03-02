import React, { useEffect, useState } from "react";
import  Row from "react-bootstrap/Row";
import  Col  from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";
import CustomerInfo from '../components/CustomerInfo';
import TopNavBar from "../components/TopNavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faSoccerBall, faClose, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useGetJackpotMarketGamesQuery, useGetJackpotMarketQuery } from "../hooks/jackpot";

const StyledJackpot = styled.div`
    background: #424242;
    h3 {
        letter-spacing: 1px;
    }
    h6 {
        margin: 0;
        padding: 0;
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
    .markets-id {
        width: 30%;
    }
    .markets-id-temp {
        width: 70%;
    }
`
export default function Jackpot() {
   
    return (
        <StyledJackpot>
            <Row className="px-2">
                <Col lg="9" md="9" sm="12" style={{ padding: 0, height: 'auto' }}> 
                    <TopNavBar/>
                    <StyleJackpotContainer>                       
                        <JackpotContainer/>
                    </StyleJackpotContainer>                   
                </Col>
                <Col lg="3" md="3" sm="12" style={{ paddingLeft: 0, height: '100vh', overflowY: 'scroll', overflowX: 'hidden' }}>
                    <CustomerInfo/>
                </Col>
            </Row>       
        </StyledJackpot>
    )
}

const NoJackpotAvailable = () => {
    return (
        <div className="text-center mt-5 text-dark p-5">
            <FontAwesomeIcon icon={faTrophy} size="10x" className="text-success"/>
            <h4 className="mt-3">Coming Soon!</h4>
        </div>
    )
}

const JackpotContainer = () => {
    const {data, isLoading, error} = useGetJackpotMarketQuery()

    if (isLoading) {
        return <Spinner animation="grow" className="d-block text-center"/>
    }

    if (error) {
        return <span className="text-danger d-block text-center">Error! Try again later!</span>
    }

    return (
        <>
          {data.length > 0 ?         
            <JackpotMarkets market={data}/>
          : <NoJackpotAvailable/>}
        </>          
    )
}

const JackpotMarkets = ({ market }) => {
    const JackpotMarketItems = (d, i) => {
        return (
            <React.Fragment key={i}>
                <div 
                    className="d-flex align-items-center justify-content-between text-white p-3 bg-dark rounded-0 shadow-sm mb-3"
                >
                    <button style={{ margin: 0, padding: 0, background: 'none', border: 'none' }}>
                        <FontAwesomeIcon icon={faSoccerBall} className="text-white"/>
                    </button>
                    <div className="d-flex align-items-center">
                        <h6 className="fw-bold" >{d?.market}</h6>
                        <span className="text-warning fw-bold" style={{ marginRight: 10, marginLeft: 10 }}>
                            KSH {(Number(d?.market_prize)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </span>
                        <span>{d?.games_count} Games</span>
                    </div>
                    <button style={{ margin: 0, padding: 0, background: 'none', border: 'none' }}>
                        <i className="bi bi-printer"  style={{ color: '#ffffff' }}></i>                
                    </button>
                </div>
                <JackpotMarketGames 
                    market={d?.market}
                    market_id={d?.market_id} 
                    market_active={d?.market_active}
                />
            </React.Fragment>
        )
    }
    return (
        <>
            {market.map(JackpotMarketItems)}
        </>
    )
}

const JackpotMarketGames = ({ market_id , market_active, market}) => {
    const [activeIds, setActiveIds] = useState([])
    const ids = Array.from(new Set(activeIds))
    const {data, isLoading, error} = useGetJackpotMarketGamesQuery(market_id)
    if (isLoading) {
        return <Spinner animation="grow" />
    }
    if (error) {
        return <span className="text-danger">Error! Try again later</span>
    }

    const handleGame = (e) => {
        const id = e.target.getAttribute('market_id') + e.target.getAttribute('game_id')
        const picked = e.target.getAttribute('picked')
        console.log(picked, id)
        const data = {
            picked,
            picked_id: id
        }
        localStorage.setItem(id, JSON.stringify(data))
        localStorage.setItem(id+"picked", picked)
        fetchPicked(id)
    }

    const fetchPicked = (id) => {
        const p = localStorage.getItem(id)
        const d = JSON.parse(p)
        setActiveIds(prev => prev.concat(d))
    }

    const JackpotGamesItems = (d, i) => {
        const da = new Date(d?.kick_off_time)
        const date = da.getDate() + '/' + da.getMonth() + '/' + da.getFullYear() + '-' + da.getHours() + ':' + da.getMinutes()
      
        return (
            <React.Fragment key={i}>
                <div className="d-flex align-items-center p-2">
                    <div className="d-flex align-items-center markets-id-temp">
                        <span style={{ marginRight: 18, marginLeft: 12 }}>{i+1}</span>
                        <div>
                            <small>{date}</small>
                            <span>{d?.home_team} - {d?.away_team}</span>
                        </div>
                    </div>
                    <div className="markets-id d-flex justify-content-around">
                        {/* {console.log(ids[i] , (d?.jackpot_market_id+ '' +d?.id))} */}
                        <button
                            className={`btn btn-${ids[i]?.picked_id === (d?.jackpot_market_id+ '' +d?.id) ? 'warning' :'primary'} w-100 m-1 p-2`}
                            disabled={!market_active}
                            onClick={handleGame}
                            market_id={d?.jackpot_market_id}
                            game_id={d?.id}
                            home_team={d?.home_team}
                            away_team={d?.away_team}
                            picked={d?.home_team}
                            picked_id={d?.jackpot_market_id+ '' +d?.id}
                        >
                            {d?.home_odds}
                        </button>
                        <button
                            className="btn btn-primary w-100 m-1 p-2"
                            disabled={!market_active}
                            onClick={handleGame}
                            market_id={d?.jackpot_market_id}
                            game_id={d?.id}
                            home_team={d?.home_team}
                            away_team={d?.away_team}
                            picked={"X"}
                            picked_id={d?.jackpot_market_id+ '' +d?.id}
                        >
                            {d?.draw_odds}
                        </button>
                        <button
                            className="btn btn-primary w-100 m-1 p-2"
                            disabled={!market_active}
                            onClick={handleGame}
                            market_id={d?.jackpot_market_id}
                            game_id={d?.id}
                            home_team={d?.home_team}
                            away_team={d?.away_team}
                            picked={d?.away_team}
                            picked_id={d?.jackpot_market_id+ '' +d?.id}
                        >
                            {d?.away_odds}
                        </button>
                    </div>
                </div>
            </React.Fragment>
        )
    }

  
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center p-2">
                <span>
                    Don't have time? Let Random Pick choose the {market} for you!
                </span>
                <button
                    className="btn btn-warning shadow-sm w-100 p-2"
                >
                    Random Pick
                </button>
            </div>
            <div className="bg-light d-flex p-2">
                <div className="markets-id-temp"></div>
                <div className="d-flex justify-content-around markets-id fw-bold">
                    <small>1</small>
                    <small>X</small>
                    <small>2</small>
                </div>
            </div>
            {data?.jackpot_games?.map(JackpotGamesItems)}
            <div className="d-flex justify-content-center p-2">
                <button className="btn btn-secondary rounded-0 shadow-sm m-1">
                    <FontAwesomeIcon icon={faClose} style={{ marginRight: 6 }}/>
                    Clear
                </button>
                <button className="btn btn-danger rounded-0 shadow-sm m-1 fw-bold">
                    <FontAwesomeIcon icon={faCheck} style={{ marginRight: 6 }}/>
                    Submit {market}
                </button>
            </div>
        </div>
    )
}
