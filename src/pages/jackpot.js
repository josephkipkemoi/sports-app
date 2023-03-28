import React, { useEffect, useState } from "react";
import  Row from "react-bootstrap/Row";
import  Col  from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";
import CustomerInfo from '../components/CustomerInfo';
import TopNavBar from "../components/TopNavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faSoccerBall, faClose, faCheck, faWarning, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { useGetJackpotMarketGamesQuery, useGetJackpotMarketQuery } from "../hooks/jackpot";
import AuthUser from '../hooks/AuthUser';
import { Modal } from "react-bootstrap";
import Link from "next/link";
import axios from "../lib/axios";
import { randomString } from "../hooks/generateRandomId";
import MobileNavComponent from "../components/MobileNavComponent";

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
                    games_count={d?.games_count}
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
    const randomId = randomString()
    const [successMessage, setSuccessMessage] = useState('')
    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [jackpotSelectionError, setJackpotSelectionError] = useState([])
    const [ids, setIds] = useState([])
    const [errorModalOoen, setErrorModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const uniqueIds = Array.from(new Set(ids))
    const user = AuthUser()
    const {data, error} = useGetJackpotMarketGamesQuery(market_id)

    if (error) {
        return <span className="text-danger">Error! Try again later</span>
    }

    const openErrorModal = () => setErrorModalOpen(true)
    const closeErrorModal = () => setErrorModalOpen(false)
    const closeSuccessModal = () => setSuccessModalOpen(false)

    const handleGame = (e, jId) => {
        const id = e.target.getAttribute('game_id')
        const picked = e.target.getAttribute('picked')
        const marketId = e.target.getAttribute('market_id')
        const homeTeam = e.target.getAttribute('home_team')
        const awayTeam = e.target.getAttribute('away_team')

        const data = {
            picked,
            game_id: id,
            market_id: marketId,
            homeTeam,
            awayTeam
        }
        localStorage.setItem(id, JSON.stringify(data))
        setIds(prev => prev.concat(id))
    }

    const activatBtn = (index,i) => {
        const btns = document.getElementsByClassName(index)
        for(let i = 0; i < btns.length; i++) {
            btns[i].classList.remove('btn-warning')
        }
        btns[i].classList.add('btn-warning')
    }

    const postJackpot = async () => {
        setIsLoading(true)
      
        if(!!user?.uu_id?.id == false) {
            setIsLoading(false)
           return openErrorModal()
        }

        const games = uniqueIds.map(id => {
            const game = localStorage.getItem(id)
            return game
        })

        try {
            const res = await axios.post("api/jackpots/results/validate", {
                'user_id': user?.uu_id?.id,
                'market_id': market_id,
                'picked_games_count': uniqueIds.length,
                jackpot_bet_id: randomId,
                jackpot_games: JSON.stringify(games)
            })
            if(res.status == 201) {
                setIsLoading(false)
                setSuccessMessage(res.data.message)
                setSuccessModalOpen(true)
            }
        } catch (e) {
            if(e?.response?.status == 400) {
                setIsLoading(false)
                return setJackpotSelectionError(p => p.concat(e.response.data.message))
            }  
            if(e?.response?.status == 422) {
                setIsLoading(false)
                return setJackpotSelectionError(p => p.concat("You need to pick all games in this market"))
            }  
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
                                onClick={e => handleGame(e, d?.jackpot_bet_id)}
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

    const customTimer = () => {
        if(jackpotSelectionError.length > 0) {
            setJackpotSelectionError([])
        }
    }
    
    useEffect(() => {
        const timer = setTimeout(customTimer, 4500)
        return () => clearTimeout(timer)
    }, [jackpotSelectionError.length, market])

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
            {jackpotSelectionError.length > 0 && 
                <p className="alert alert-danger m-3">
                <FontAwesomeIcon icon={faWarning} style={{ marginRight: 8 }} />
                    {jackpotSelectionError[0]}
                </p>
            }
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
                    className={`d-flex align-items-center btn btn-danger rounded-0 shadow-sm m-1 fw-bold ${!!user?.uu_id?.id == true ? '' : 'disabled-btn'}`}
                    onClick={postJackpot}
                    disabled={isLoading}
                >
                    {isLoading ?
                        <>
                            <Spinner animation="grow" size="sm" style={{ marginRight: 6 }}/>
                            Loading...
                        </>
                    : 
                    <>
                        <FontAwesomeIcon icon={faCheck} style={{ marginRight: 6 }}/>
                        Submit {market}
                    </>}
                
                </button>
            </StyleJackpotActive>
            <JackpotErrorModal
                errorModalOoen={errorModalOoen}
                closeErrorModal={closeErrorModal}
            />
            <SuccessModal
                successModalOpen={successModalOpen}
                successMessage={successMessage}
                closeSuccessModal={closeSuccessModal}
            />
            <MobileNavComponent/>
        </div>
    )
}

const SuccessModal = ({ successModalOpen, successMessage, closeSuccessModal }) => {
    return (
        <Modal show={successModalOpen} centered>
            <Modal.Header className="bg-primary text-white p-3 border-0">
                <h2>You are one step from becoming a Millionare!</h2>
            </Modal.Header>
            <Modal.Body className="bg-light border-0 p-5 text-center">
                <h3>{successMessage}</h3>
            </Modal.Body>
            <Modal.Footer className="bg-info border-0">
                <div className="d-flex justify-content-between w-100">
                    <button className="btn btn-light m-2 w-100" onClick={closeSuccessModal}>
                        <FontAwesomeIcon icon={faRefresh} style={{ marginRight: 6 }}/>
                        Place Again
                    </button>
                    <button className="btn btn-dark m-2 w-100" onClick={closeSuccessModal}>
                        <FontAwesomeIcon icon={faClose}  style={{ marginRight: 6 }}/>
                        Close
                    </button>
                </div>              
            </Modal.Footer>
        </Modal>
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