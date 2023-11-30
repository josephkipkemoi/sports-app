import React, { useEffect, useState } from "react";
import  Row from "react-bootstrap/Row";
import  Col  from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";
import CustomerInfo from '../components/CustomerInfo';
import TopNavBar from "../components/TopNavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faTrophy, 
    faSoccerBall, 
    faClose, 
    faCheck, 
    faWarning, 
    faRefresh,
    faCheckCircle,
    faHourglass,
    faShuffle,
    faInfoCircle,
    faList
    } from '@fortawesome/free-solid-svg-icons'
import { useGetJackpotMarketGamesQuery, useGetJackpotMarketQuery } from "../hooks/jackpot";
import AuthUser from '../hooks/AuthUser';
import { Modal } from "react-bootstrap";
import Link from "next/link";
import axios from "../lib/axios";
import { randomString } from "../hooks/generateRandomId";
import MobileNavComponent from "../components/MobileNavComponent";
import { useRouter } from "next/router";

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
    const router = useRouter()
    const market = router.query.market
    const [marketItems, setMarketItems] = useState([])
    const [activeMarket, setActiveMarket] = useState("")

    const {data, isLoading, error} = useGetJackpotMarketQuery()

    if (isLoading) {
        return <Spinner animation="grow" className="d-block text-center"/>
    }

    if (error) {
        return <span className="text-danger d-block text-center">Error! Try again later!</span>
    }

    const handleLinks = (mkt) => {
       const jpMarket = data?.filter(g => g.market === mkt)
       setMarketItems(jpMarket)
       setActiveMarket(mkt)
    }

    const JackpotLinks = (li, i) => {
        return (
            <React.Fragment key={i}>
                <Link href={`/jackpot?market=${li?.market}`}>
                    <a
                        className={`btn btn-${li?.market === activeMarket ? 'primary' : 'secondary'} m-1`}
                        onClick={() => handleLinks(li?.market)}
                    >
                        {li?.market}
                    </a>
                </Link>
            </React.Fragment>
        )
    }
    return (
        <>
            <div className="d-flex justify-content-center m-2">
                <Link href={`/jackpot`}>
                    <a
                        className="btn btn-warning shadow m-1"
                        onClick={() => handleLinks("all")}
                    >
                        Jackpots
                    </a>
                </Link>
                {data.map(JackpotLinks)}
            </div>
                {data.length === 0 && <NoJackpotAvailable/>}
                {!market && <JackpotMarkets market={data}/>}
                {market === activeMarket && <JackpotMarkets market={marketItems}/>}
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

const JackpotMarketGames = ({ market_id , market_active, market, games_count}) => {
    const randomId = randomString()
    const [successMessage, setSuccessMessage] = useState('')
    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [jackpotSelectionError, setJackpotSelectionError] = useState([])
    const [ids, setIds] = useState([])
    const [errorModalOoen, setErrorModalOpen] = useState(false)
    const [errorOpen, setErrorOpen] = useState(false)
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
    const closeError = () => setErrorOpen(false)

    const handleGame = (e) => {
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
                setErrorOpen(true)
                return setJackpotSelectionError(p => p.concat(e.response.data.message))
            }  
            if(e?.response?.status == 422) {
                setIsLoading(false)
                setErrorOpen(true)
                return setJackpotSelectionError(p => p.concat("You need to pick all games in this market"))
            }  
        }
   }

    const handleClear = () => {
        uniqueIds.forEach(id => {
            localStorage.removeItem(id)
            const btns = document.getElementsByClassName(market_id + "" + id)
            for(let i = 0; i < btns.length; i++) {
                btns[i].classList.remove('btn-warning')
            }
        })
        setIds([])
    }

    const randomPickGames = () => {
        setIds([])
        const marketId = data.jackpot_market[0].market_id
        data.jackpot_games.map(g => {
            const randInt = Math.floor(Math.random() * 3)
            const picked = randInt === 0 && g.home_team || randInt === 1 && "X" || randInt === 2 && g.away_team
            const d = {
                picked,
                game_id: g.id,
                market_id: marketId,
                homeTeam: g.home_team,
                awayTeam: g.away_team
            }
            localStorage.setItem(g.id, JSON.stringify(d))
            setIds(prev => prev.concat(g.id))
            activatBtn(marketId + '' + g.id, randInt)
        })       
    }

    const JackpotGamesItems = (d, i) => {
        const da = new Date(d?.kick_off_time)
        const date = da.getDate() + '/' + da.getMonth() + '/' + da.getFullYear() + '-' + da.getHours() + ':' + da.getMinutes()

        return (
            <React.Fragment key={i}>
                <div className="d-flex align-items-center p-2">
                    <div className="d-flex align-items-center markets-id-temp">
                        <span className="text-secondary" style={{ marginRight: 18, marginLeft: 12 }}>{i+1}.</span>
                        <div>
                            <small>{date}</small>
                            <span>{d?.home_team} - </span>
                            <span>{d?.away_team}</span>
                        </div>
                    </div>
                    <div className="markets-id d-flex justify-content-around w-75">
                        <div onClick={() => activatBtn(d?.jackpot_market_id+ '' +d?.id,0)}>
                            <button
                                id={d?.jackpot_market_id+ '' +d?.id}
                                className={`btn btn-primary w-100 m-1 ${d?.jackpot_market_id+ '' +d?.id}`}
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
                                className={`btn btn-primary w-100 m-1 ${d?.jackpot_market_id+ '' +d?.id}`}
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
                                className={`btn btn-primary w-100 m-1 ${d?.jackpot_market_id+ '' +d?.id}`}
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

    useEffect(() => {
     
    }, [jackpotSelectionError.length, market])

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center p-2">
                <span className="w-75 text-center">
                    Don't have time? Let Random Pick choose the {market} for you!
                </span>       
                <button
                    className="d-flex align-items-center justify-content-center btn btn-warning rounded-0 m-1"
                    onClick={randomPickGames}
                >
                    <FontAwesomeIcon 
                        icon={faShuffle} 
                        style={{ marginRight: 8 }}
                    />
                    Random Pick
                </button>        
            </div>
            <div className="bg-light d-flex p-2">
                <div className="markets-id-temp"></div>
                <div className="d-flex w-75 justify-content-around markets-id fw-bold">
                    <small>1</small>
                    <small>X</small>
                    <small>2</small>
                </div>
            </div>
            {data?.jackpot_games?.map(JackpotGamesItems)}
            <div className="text-center">             
                <span>
                    {uniqueIds.length === games_count ?
                    <FontAwesomeIcon 
                      icon={faCheckCircle} 
                      className="text-success" 
                      style={{ marginRight: 8 }}
                    />
                    :
                    <FontAwesomeIcon 
                        icon={faHourglass} 
                        className="text-danger" 
                        style={{ marginRight: 8 }}
                    />
                    }                     
                    Picked {uniqueIds.length} of {games_count}
                </span>
                {uniqueIds.length !== games_count &&
                <small>
                  You need to pick all {games_count} games
                </small>
                }
            </div>
            <StyleJackpotActive className="d-flex justify-content-center p-1">
                <button 
                    className="d-flex align-items-center justify-content-center btn btn-secondary rounded-0 m-1"
                    onClick={handleClear}
                >
                    <FontAwesomeIcon icon={faClose} style={{ marginRight: 6 }}/>
                    Clear
                </button>
                <button 
                    className={`d-flex align-items-center justify-content-center btn btn-danger rounded-0 shadow m-1 fw-bold ${!!user?.uu_id?.id == true ? '' : 'disabled-btn'}`}
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
            {errorModalOoen &&
             <JackpotErrorModal
             errorModalOoen={errorModalOoen}
             closeErrorModal={closeErrorModal}
            />
            }
           
            {successModalOpen &&
            <SuccessModal
              successModalOpen={successModalOpen}
              successMessage={successMessage}
              closeSuccessModal={closeSuccessModal}
            />
            }
          
            {errorOpen &&
            <ErrorModal
                message={jackpotSelectionError[0]}
                errorModalOpen={errorOpen}
                closeErrorModal={closeError}
            />
            }
          
            <MobileNavComponent/>
        </div>
    )
}

const ErrorModal = ({ message, errorModalOpen, closeErrorModal }) => {
    return (
        <Modal show={errorModalOpen} centered>
            <Modal.Body>
                <p className="alert alert-info text-center shadow">
                    <FontAwesomeIcon icon={faInfoCircle} style={{marginRight: 8}}/>
                    {message}
                </p>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary rounded-0 shadow-sm w-25" onClick={closeErrorModal}>
                        Close
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

const SuccessModal = ({ successModalOpen, successMessage, closeSuccessModal }) => {
    return (
        <Modal show={successModalOpen} centered>  
            <Modal.Body className="bg-primary text-white border-0 p-5 text-center">
                <h3>{successMessage}</h3>
            </Modal.Body>
            <Modal.Footer className="bg-light border-0">
                <div className="d-flex justify-content-between w-100">
                    <button className="btn btn-dark m-2 d-flex align-items-center justify-content-center w-100" onClick={closeSuccessModal}>
                        <FontAwesomeIcon size="sm" icon={faClose} style={{ marginRight: 6 }}/>
                        Close
                    </button>
                    <Link href="/history?his_tab=jbets&tab=j_all" onClick={closeSuccessModal}>
                        <a
                            itemProp="url"
                            className="btn btn-warning m-2 w-100 d-flex align-items-center justify-content-center" 
                        >
                            <FontAwesomeIcon icon={faList} size="xs" style={{ marginRight: 6 }}/>
                            View Betslip
                        </a>
                    </Link>                 
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