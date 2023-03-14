import React, { useEffect, useState } from "react";
import  Row from "react-bootstrap/Row";
import  Col  from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";
import CustomerInfo from '../components/CustomerInfo';
import TopNavBar from "../components/TopNavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faSoccerBall, faClose, faCheck, faWarning } from '@fortawesome/free-solid-svg-icons'
import { useGetJackpotMarketGamesQuery, useGetJackpotMarketQuery } from "../hooks/jackpot";
import AuthUser from '../hooks/AuthUser';
import { Modal } from "react-bootstrap";
import Link from "next/link";

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

const StyleJackpotActive = styled.div`
    .disabled-btn {
        position: relative;
    }
    .disabled-btn:hover::after {
        content: "Login to place jackpot!";
        position: absolute;
        top: -35px;
        padding: 4px 8px;
        color: #fff;
        left: 0;
        width: auto;
        height: auto;
        background: red;
        cursor: not-allowed;
    }
`

const JackpotMarketGames = ({ market_id , market_active, market}) => {
    const [errorModalOoen, setErrorModalOpen] = useState(false)
    const user = AuthUser()
    const {data, isLoading, error} = useGetJackpotMarketGamesQuery(market_id)
    if (isLoading) {
        return <Spinner animation="grow" />
    }
    if (error) {
        return <span className="text-danger">Error! Try again later</span>
    }

    const openErrorModal = () => setErrorModalOpen(true)
    const closeErrorModal = () => setErrorModalOpen(false)

    const handleGame = (e) => {
        const id = e.target.getAttribute('game_id')
        const picked = e.target.getAttribute('picked')
        const data = {
            picked,
            picked_id: id
        }
        localStorage.setItem(id, JSON.stringify(data))
    }

    const activatBtn = (index,i) => {
        const btns = document.getElementsByClassName(index)
        for(let i = 0; i < btns.length; i++) {
            btns[i].classList.remove('btn-warning')
        }
        btns[i].classList.add('btn-warning')
    }

    const postJackpot = () => {
        if(!!user?.uu_id?.id == false) {
            openErrorModal()
        }
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
                        <div onClick={() => activatBtn(d?.jackpot_market_id+ '' +d?.id,0)}>
                            <button
                                id={d?.jackpot_market_id+ '' +d?.id}
                                className={`btn btn-primary w-100 m-1 p-2 ${d?.jackpot_market_id+ '' +d?.id}`}
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
                        </div>
                        <div onClick={() => activatBtn(d?.jackpot_market_id+ '' +d?.id,1)}>
                            <button
                                id={d?.jackpot_market_id+ '' +d?.id}
                                className={`btn btn-primary w-100 m-1 p-2 ${d?.jackpot_market_id+ '' +d?.id}`}
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
                        </div>
                        <div onClick={() => activatBtn(d?.jackpot_market_id+ '' +d?.id,2)}>
                            <button
                                id={d?.jackpot_market_id+ '' +d?.id}
                                className={`btn btn-primary w-100 m-1 p-2 ${d?.jackpot_market_id+ '' +d?.id}`}
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
            <StyleJackpotActive className="d-flex justify-content-center p-2">
                <button className="btn btn-secondary rounded-0 shadow-sm m-1">
                    <FontAwesomeIcon icon={faClose} style={{ marginRight: 6 }}/>
                    Clear
                </button>
                <button 
                    className={`btn btn-danger rounded-0 shadow-sm m-1 fw-bold ${!!user?.uu_id?.id == true ? '' : 'disabled-btn'}`}
                    onClick={postJackpot}
                >
                    <FontAwesomeIcon icon={faCheck} style={{ marginRight: 6 }}/>
                    Submit {market}
                </button>
            </StyleJackpotActive>
            <JackpotErrorModal
                errorModalOoen={errorModalOoen}
                closeErrorModal={closeErrorModal}
            />
        </div>
    )
}

const JackpotErrorModal = ({ errorModalOoen, closeErrorModal }) => {
    return (
        <Modal show={errorModalOoen} >
            <Modal.Body className="bg-light">
                <h4 className="alert alert-danger shadow mb-4">
                    <FontAwesomeIcon icon={faWarning} style={{ marginRight: 8 }} />
                    Unauthorized Action
                </h4>
                <h5 className="text-dark">
                    Please <Link href="/login">Login</Link>  to place bet or <Link href="/register">Signup Here</Link>
                </h5>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-dark" onClick={closeErrorModal}>
                    <FontAwesomeIcon icon={faClose} style={{ marginRight: 8 }} />
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    )
}