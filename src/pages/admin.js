import axios from "../lib/axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import Link from "next/link";
import  Col from "react-bootstrap/Col";
import  Row  from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import  Button from "react-bootstrap/Button";
import  Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Select from "react-select";
import { InputNumber, Small } from "../components/Html";
import { 
    useGetAdminUserBalanceByIdQuery, 
    useGetAllUsersQuery, 
    useGetAllFixturesIdsQuery, 
    useGetJackpotFixturesQuery 
} from "../hooks/admin";
import { useGetBalanceByUserIdQuery } from "../hooks/balance";
import { PhoneSvgIcon } from "../components/Svg";
import { useGetJackpotMarketQuery, useGetJackpotPrizeWinsQuery } from "../hooks/jackpot";
import { Container, Modal, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useGetFixtureIdsWhereOddsNullQuery } from "../hooks/fixture";
import { AlertModalElement, ErrorElement, ProgressBarElement } from "../components/HtmlElements";
import {  
    useGetAllUsersWhoMessagedAdminQuery, 
    useGetUserMessageByIdQuery } from "../hooks/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faWarning, faBan, faRefresh, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Echo from "laravel-echo";
import Pagination from '../components/Pagination';
import { randomString } from "../hooks/generateRandomId";

const StyledAdmin = styled.div`
    height: 100vh;
    overflow-y: scroll;
    h1 {
        letter-spacing: 2px;
        margin: 0;
        padding: 0;
    }
`

const adminLinks = [
    {
        name: 'Users',
        path: 'admin?tab=users'
    },
    {
        name: 'Fixtures',
        path: 'admin?tab=fixtures'
    },
    {
        name: 'Feedback',
        path: 'admin?tab=feedback'
    },
    {
        name: 'Jackpot',
        path: 'admin?tab=jackpot'
    },
    {
        name: 'Live',
        path: 'admin?tab=live'
    }
]
 
export default function Admin() {
    const router = useRouter();
    const { tab } = router.query;
    const [fixtureIdLoading, setFixtureIdLoading] = useState(false)
    const [fixtureLoaded, setFixtureLoaded] = useState(false)
    const [fixtureOddsLoading, setFixtureOddsLoading] = useState(false)
    const [fixtureOddsLoaded, setFixtureOddsLoaded] = useState(false)
    const [hideAdmin, setHideAdmin] = useState(true)
  
    const postFixtureIds = async () => {
        setFixtureIdLoading(true)
        const res = await axios.post('api/custom_fixture/post');
        
        if(res.status === 200) {
            setFixtureIdLoading(false)
            setFixtureLoaded(true)
        }
    }

    const postFixtureOdds = async () => {
        setFixtureOddsLoading(true)
        const res = await axios.post('api/custom_fixture/odds');
         
        if(res.status === 200) {
            setFixtureOddsLoaded(true)
            setFixtureOddsLoading(false)
        }
    }

    const AdminLinkItems = (link, i) => {
        return (
            <div>
                <Link href={link.path} key={i}>
                    <a
                        itemProp="url"
                        className="text-decoration-none text-dark btn"
                    >
                        {link.name}
                    </a>
                </Link>
            </div>
           
        )
    }

    const getUser = () => {
        const user = JSON.parse(localStorage.getItem('uu_id'))
   
        if(user.uu_id.phone_number === 254700545727 || process.env.NODE_ENV === 'development') {
            setHideAdmin(false)
        }
    }

    useEffect(() => {
       getUser()
    }, [])
    
    return (
        <StyledAdmin className="p-3 container bg-primary">

            {hideAdmin ? '' :  
            <>
            <div className="text-center p-2 bg-light rounded-pill shadow-lg mb-3">
                <h1 className="fw-bold text-dark d-flex justify-content-center align-items-center">
                    <i className="bi bi-headset" style={{ marginRight: 5}}></i>
                     Welcome
                    <i className="bi bi-emoji-sunglasses" style={{ marginLeft: 5 }}></i>
                </h1> 
            </div>
           <Navbar bg="light" expand="lg" className="rounded">
                <Container>
                    <Navbar.Brand href="#home">Tabs</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {adminLinks.map(AdminLinkItems)}
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            </>
           }
       
            <div style={{ height: '100vh' }}>
            {tab === 'fixtures' && 
             <FixturesComponent 
                postFixtureIds={postFixtureIds}
                postFixtureOdds={postFixtureOdds}
                fixtureIdLoading={fixtureIdLoading}
                fixtureLoaded={fixtureLoaded}
                fixtureOddsLoaded={fixtureOddsLoaded}
                fixtureOddsLoading={fixtureOddsLoading}
             />
             }
            {tab === 'users' && <UsersProfileComponent/>}
            {tab === 'feedback' && <CustomerFeedback/>}
            {tab === 'jackpot' && <JackpotComponent/>}
            {tab === 'live' && <LiveGamesComponent/>}
            </div>
         
        </StyledAdmin>
    )
}

const LiveGamesComponent = () => {
    const updateLiveGames = async () => {
       await axios.post('api/fixtures/live')
    }
    return (
        <>
           <Card className="mt-3">
            <Card.Header>Update Live Games</Card.Header>
            <Card.Body>
                <button 
                    className="btn btn-primary"
                    onClick={updateLiveGames}
                >
                    Update
                </button>
            </Card.Body>
        </Card>
        </>
    )
}

const jackpot_options = [
    {
        value: 'Mega Jackpot',
        label: 'Mega Jackpot'
    },
    {
        value: 'Five Jackpot',
        label: 'Five Jackpot'
    }
];


const JackpotComponent = () => {

    const [fields, setFields] = useState({
        jp_home: '',
        jp_away: '',
        jp_home_odds: '',
        jp_draw_odds: '',
        jp_away_odds: '',
        jp_time: '',
        jp_market: '',
        jp_active: true
    });

    const [jackpotId, setJackpotId] = useState('');

    const megaJackpotData = useGetJackpotFixturesQuery('Mega Jackpot')
    const fiveJackpotData = useGetJackpotFixturesQuery('Five Jackpot')

    if(megaJackpotData.isLoading || fiveJackpotData.isLoading) {
        return <Spinner animation="grow"/>
     }
 
    if(megaJackpotData.error || fiveJackpotData.error) {
        return <span>Try again later!</span>
    }

    const mega_jackpot_id_options = megaJackpotData.data.map(d => ({label: d.id,value: d.id}) )
    const five_jackpot_id_options = fiveJackpotData.data.map(d => ({label: d.id,value: d.id}))

    const handleField = (e) => setFields(prev => ({...prev, [e.target.name]: e.target.value}))
    const handleMarketField = (e) => setFields(prev => ({...prev, jp_market: e.value}))

    const submitGame = async () => {
        const res = await axios.post('api/admin/jackpot', fields)
  
        if(res.status === 201 && fields.jp_market === "Mega Jackpot") {
            megaJackpotData.refetch()
        }
        if(res.status === 201 && fields.jp_market === "Five Jackpot") {
            fiveJackpotData.refetch()
        }
    }

    const updateGame = async () => {
       await axios.patch(`api/admin/jackpot/${jackpotId}/patch`, fields)
         
    }

    const updateJackpotId = ({ value }) => setJackpotId(value)

    const deactivateJackpotMarket = async () => {
        await axios.patch(`api/admin/jackpot/${fields.jp_market}/status`, {
            jp_active: false
        })
    }

    const activateJackpotMarket = async () => {
        await axios.patch(`api/admin/jackpot/${fields.jp_market}/status`, {
            jp_active: true
        })
    }

    return (
        <Card className="mt-5">
            <Card.Header>
                <h4>Jackpot</h4>
            </Card.Header>
            <Card.Body className="px-4">
                <Row className="gx-2">
                    <div className="mb-3">
                        <JackpotMarket/>
                    </div>
                    <AddUpdateJackpotGame/>
                </Row>
              
                <hr/>
                
                <div className="mt-3 row gx-4">
                <Col lg="12">
                    <h5 className="text-center fw-bold bg-primary p-2 text-white">REMOVE/DELETE SINGLE GAME</h5>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="w-100">
                            <Small className="text-dark m-1">Select Market</Small>
                            <Select options={jackpot_options}/>
                        </div>
                        <div className="w-100">
                            <Small className="text-dark m-1">Select ID</Small>
                            <Select className="m-1"/>
                        </div>
                        <div className="d-flex flex-column w-100">
                            <Small className="text-dark m-1">Caution</Small>
                            <button className="btn btn-danger m-1">Remove Game</button>
                        </div>
                    </div>
                </Col>
                <hr/>
                <Col>
                    <h5 className="text-center fw-bold bg-primary p-2 text-white">REMOVE/DELETE ALL GAMES</h5>
                    <div className="d-flex">
                        <div className="w-100" >
                            <Small className="text-dark m-1">Select Market</Small>
                            <Select className="m-1" options={jackpot_options}/>
                        </div>
                        <div className="w-100">
                            <Small className="text-dark m-1">Caution</Small>
                            <button className="btn btn-danger w-100 m-1">Remove All</button>
                        </div>
                    </div>
                </Col>
                </div>
            </Card.Body>           
        </Card>
    )
}

const AddUpdateJackpotGame = () => {
    const generateId = randomString()
    const [error, setError] = useState(null)
    const [gameAdded, setGameAdded] = useState(false)
    const [game, setGame] = useState({
        market: null,
        jackpot_market_id: null,
        home_team: '',
        away_team: '',
        home_odds: null,
        draw_odds: null,
        away_odds: null,
        kick_off_time: null
    })

    const { market, jackpot_market_id, home_team, away_team, home_odds, draw_odds, away_odds, kick_off_time } = game
    const jpMarket = useGetJackpotMarketQuery()

    const handleField = (e) =>  setGame(prev => ({
        ...prev, 
        [e.target.name]: e.target.value
    }))

    const submitGame = async () => {
        try {
            const res = await axios.post(`api/jackpots/markets/${jackpot_market_id}/games`, {
                jackpot_market_id,
                home_team,
                away_team,
                home_odds,
                draw_odds,
                away_odds,
                kick_off_time,
                jackpot_bet_id : generateId
            })
            if (res.status == 201 ) {
                setGameAdded(true)
                setError(null)
            }
        } catch (error) {
            if(error.response.status == 400) {
                setError(error.response.data.message)
            }
        }
      
    }
    const updateGame = () => {

    }

    const handleMarket = (e) => setGame(prev => ({
        ...prev, 
        market: e.label,
        jackpot_market_id: e.value
    }))

    useEffect(() => {

    }, [gameAdded])
    
    if (jpMarket.isLoading) {
        return <Spinner animation="grow" />
    }
    const jackpotMarkets = jpMarket?.data?.map(d => {
        return {
            value: d.market_id,
            label: d.market
        }
    })

    return (
        <div className="bg-primary">
            <h5 className="text-center fw-bold  p-2 text-white">Add/Update Games to {market}</h5>
            {error && 
            <p className="alert alert-danger">
                <FontAwesomeIcon icon={faWarning} style={{ marginRight: 8 }}/>
                {error}
            </p>
            }
            <Col lg="2" className="p-2 rounded shadow bg-info" style={{ border: '1px solid lightgray' }}>
                <div>
                <Small className="text-dark">Jackpot Market</Small>
                {gameAdded && <span className="text-danger fw-bold">Game Added</span>}
                <Select 
                    className="mb-2" 
                    options={jackpotMarkets} 
                    onChange={handleMarket} 
                    name="market" 
                />                      
                <hr className="text-white"/>
                <Small className="text-dark">Select ID to Update</Small>
                    <Select 
                        // options={ fields.jp_market === 'Mega Jackpot' ? mega_jackpot_id_options : five_jackpot_id_options}
                        // onChange={updateJackpotId}
                    />
                </div>
            </Col>
            <Col className="p-2 rounded shadow bg-info" style={{ border: '1px solid lightgray' }}>
                        <div>
                            <Small className="text-dark">
                                Games Added: 
                                {/* {fields.jp_market === "Mega Jackpot" ? megaJackpotData.data.length : fiveJackpotData.data.length} */}
                            </Small>
                            <div className="d-flex">
                                <input 
                                    type="text" 
                                    onChange={handleField} 
                                    name="home_team" 
                                    placeholder="Home Team" 
                                    className="form-control m-1"
                                />
                                <input 
                                    type="text" 
                                    onChange={handleField}
                                    name="away_team" 
                                    placeholder="Away Team" 
                                    className="form-control m-1"
                                />
                            </div>
                            <div className="d-flex">
                                <InputNumber 
                                    onChange={handleField} 
                                    name="home_odds"  
                                    placeholder="Home Odds" 
                                    className="form-control m-1"
                                />
                                <InputNumber 
                                    onChange={handleField} 
                                    name="draw_odds" 
                                    placeholder="Draw Odds" 
                                    className="form-control m-1"
                                />
                                <InputNumber 
                                    onChange={handleField} 
                                    name="away_odds" 
                                    placeholder="Away Odds" 
                                    className="form-control m-1"
                                />
                                <input 
                                    onChange={handleField} 
                                    name="kick_off_time" 
                                    type="datetime-local" 
                                    className="form-control m-1"
                                />      
                            </div>
                            <div>
                                <button 
                                    className="btn btn-primary m-1" 
                                    onClick={submitGame}
                                >
                                    Add Game
                                </button>
                                <button
                                    className="btn btn-warning m-1" 
                                    onClick={updateGame}
                                >
                                    Update Game
                                </button>                              
                            </div>
                            <div>
                            </div>
                        </div>
            </Col>
        </div>
    )
}
const JackpotMarket = () => {
    const [market, setMarket] = useState({
        market_id: null,
        market: '',
        market_prize: null,
        games_count: null,
        min_stake: null
    })
    const [marketAdded, setMarketAdded] = useState(false)

    const handlechange = (e) => {
        setMarket(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const postJpMarket =  () => {
        try {
            const res =  axios.post("api/jackpots/markets", market)

            if (res.status == 201) {
                setMarketAdded(true)
            }  
        } catch (error) {
            console.error(error)
        }
      
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if(marketAdded == true) {
                setMarketAdded(false)
            }
        }, 2000)
        return () => clearTimeout(timer)
    }, [marketAdded])

    return (
        <div className="bg-danger p-2 shadow rounded">
            {marketAdded && <span className="alert alert-info">{market.market} Added</span>}
            <div className="row">
                <h6 className="fw-bold text-white text-center m-3">
                    Fill form to add Jackpot Market
                </h6>
                <div className="col">
                    <input 
                        className="form-control m-2" 
                        type="number" 
                        placeholder="Jackpot Market ID" 
                        onChange={handlechange}
                        name="market_id"
                    />
                    <input 
                        className="form-control m-2" 
                        placeholder="Add Jackpot Market" 
                        onChange={handlechange}
                        name="market"
                    />
                </div>
                <div className="col">
                    <input 
                        className="form-control mt-2" 
                        type="number" 
                        placeholder="Add Jackpot Prize(KSHS)" 
                        onChange={handlechange}
                        name="market_prize"
                    />
                    <input 
                        className="form-control mt-2" 
                        type="number" 
                        placeholder="Market Games Count" 
                        onChange={handlechange}
                        name="games_count"
                    />
                    <input 
                        className="form-control mt-2" 
                        type="number" 
                        placeholder="Minimum Stake" 
                        onChange={handlechange}
                        name="min_stake"
                    />
                </div>
            </div>        
            <button 
                className="btn btn-primary w-100 p-2 mt-3 mb-3 shadow-sm rounded-0"
                onClick={postJpMarket}
                disabled={marketAdded}
            >
                Add Jackpot Market
            </button>
        </div>
    )
}

const CustomerFeedback = () => {
    const [message, setMessage] = useState('')
    const [userId, setUserId] = useState(null)
    const [messageBox, setMessageBox] = useState([])
    const [times, setTimes] = useState([])
    const timesArr = times.length > 0 && new Set(times)
   
    const {data, error, isLoading, refetch } = useGetUserMessageByIdQuery(711487151)

    if(error) {
        return <span>Error</span>
    }

    if(isLoading) {
        return <Spinner animation="grow"/>
    }
    // useEffect(() => {
        // setUserId(JSON.parse(localStorage.getItem('uu_id')).uu_id.id)
    // }, [])
   

    const handleInput = (e) => {
        setMessage(e.target.value)
    }

    const submitMessage = async (originalMessage, phoneNumber) => {
        const num = Number('254' + phoneNumber)
        const res = await axios.post('api/admin/users/message', {
            message,
            phone_number: num,
            original_message: originalMessage,
            user_id: userId
        })
    }

    const MessageItems = (link, i) => {
 
         return (
            <React.Fragment key={i}>
                <div className=" m-1 d-flex flex-row">                    
                    <PhoneSvgIcon width="16" height="16"/>
                        <small className="text-dark">
                            {link.phone_number}
                        </small>
                                                   
                       <div id="example-collapse-text" className="card p-2 shadow" style={{ marginLeft: 15 }}>
                            <span>
                                {link.name} | {link.email}
                            </span> 
                            <p>
                                {link.message}
                            </p> 
                        </div>
                        <div>
                            <textarea className="form-control" onChange={handleInput}/>
                            <button className="btn btn-primary" onClick={() => submitMessage(link.message, link.phone_number)}>Reply</button>
                        </div>
                </div>    
                <hr/>        
            </React.Fragment>
        )
    }

    // Pusher.logToConsole = true

    // let pusher = new Pusher('b36bb776d85f37fdff66', {
    //     cluster: 'ap2'
    // })

    // let channel1 = pusher.subscribe(`message-channel${4}`)
    // admin-message-channel
    // const res = channel1.bind(`message.new`, function (data,err) {
    //     // sessionStorage.setItem(data.timestamp,data.message)
    //     // setTimes((prev) => prev.concat(data.timestamp))   
    //     refetch()
    // //    alert(data)
    // }) 

    // sessionStorage.setItem('timestamps',JSON.stringify(Array.from(timesArr)))

    // Array.from(timesArr).map(MessageItems)
    return (
        <Card className="mt-2"> 
            <Card.Header className="bg-primary text-light">
                <h3 className="fw-bold">Feedback</h3>
            </Card.Header>
            <Card.Body>   
                {/* <p>{messageBox}</p>   */}
             
                {/* {data.map(MessageItems)}
                <textarea></textarea> */}
                <Row>
                    {/* <Col lg={2} md={2} sm={2}> */}
                        <UsersContactCustomerCare/>
                    {/* </Col> */}
                    {/* <Col> */}

                    {/* </Col> */}
                    {/* {data.map(MessageItems)} */}
                </Row>
            </Card.Body>
        </Card>
    )
}

const UsersContactCustomerCare = () => {

    const [userNum, setUserNum] = useState(null)
    const [userId, setUserId] = useState(null)

    const { data, isLoading, error, refetch } = useGetAllUsersWhoMessagedAdminQuery()

    if(error) {
        return <span>Error</span>
    }


    if(isLoading) {
        return <Spinner animation="grow" />
    }


    const UsersElements = (n, i) => {
        return (
            <div 
                key={i} 
                className={`d-flex justify-content-between align-items-center btn btn-light p-2 m-1 rounded-pill`}
                onClick={() => {
                    setUserNum(n.phone_number)
                    setUserId(n.id)
                }}
            >
                <FontAwesomeIcon 
                icon={faUser} 
                className="text-white bg-info p-2 rounded-circle" 
                size='lg'
                style={{ marginRight: 6 }}
                />
                <span className="text-dark fw-bold">{n.phone_number}</span>
            </div>
        )
    }
    return (
        <>
            <div className="mb-3 mt-3">
                <button className="btn btn-primary" onClick={refetch}>Refresh</button>         
            </div>
                <Col lg={3} md={4} sm={4}>                    
                    <Card.Header><h4>Users</h4></Card.Header>
                    <div className="bg-primary pt-2 pb-2">
                        {data.data.map(UsersElements)}
                    </div>
                </Col>       
                <Col lg={9} md={8} sm={8}>  
                    <MessageComponent user={userNum} id={userId}/>
                </Col>
        </>
    )
}

const MessageComponent = ({ user, id }) => {
    const [chatMessage, setChatMessage] = useState([])
    const [sender, setSender] = useState('')

    const [formDetails, setFormDetails] = useState({
        message: '',
        user_id: user,
        phone_number: user
    })

    const {data, error, isLoading, refetch } = useGetUserMessageByIdQuery(user)

    if(error) {
        return <span>Error</span>
    }

   
    const handleText = (e) => {
        setFormDetails(prev => ({...prev, message : e.target.value, user_id: id, phone_number: user }))
    }

    const submitMessage = async () => {
        const res = await axios.post('api/admin/users/message', formDetails)
    }

    const MessageItems = (link, i) => {
 
        return (
           <React.Fragment key={i}>
               <div className=" m-1 d-flex flex-row">                    
                   <PhoneSvgIcon width="16" height="16"/>
                       <small className="text-dark">
                           {link.phone_number}
                       </small>
                                                  
                      <div id="example-collapse-text" className="card p-2 shadow" style={{ marginLeft: 15 }}>
                           <span>
                               {link.name} | {link.email}
                           </span> 
                           <p>
                               {link.message}
                           </p> 
                       </div>
                       {/* <div>
                           <textarea className="form-control" onChange={'handleInput'}/>
                           <button className="btn btn-primary" onClick={() => submitMessage(link.message, link.phone_number)}>Reply</button>
                       </div> */}
               </div>    
               <hr/>        
           </React.Fragment>
       )
   }

    // useEffect(() => {   
        
    //     window.Echo = new Echo({
    //         broadcaster: 'pusher',
    //         key: 'b36bb776d85f37fdff66',
    //         cluster: 'ap2'
    //     })

    //     window.Echo.channel(`admin-channel`)
    //                 .listen('.message.new', function(data){
    //                     setChatMessage((prev) =>  [...prev, data.message])
    //                         setFormDetails(prev => ({...prev, user_id: data.user_id, phone_number: data.user.phone_number }))
    //                         setSender(data.sender)
    //     })
    // setFormDetails(prev => ({...prev, phone_number: user }))
    // }, [])   

    if(isLoading) {
        return <Spinner animation="grow"/>
    }
    
    return (
        <Card>
            <Card.Header><h4 className="text-dark">Inbox</h4></Card.Header>            
            <div style={{ minHeight: 120 }}>
       
                        <Card.Body  style={{ margin: 0, padding: 0 }}>                        
                                {/* <div key={i} className="d-flex align-items-end mb-4">
                                    {sender === 'CustomerCareAgent' ? <FontAwesomeIcon 
                                            icon={faHeadset} 
                                            className="text-white bg-info p-2 rounded-circle" 
                                            size='lg'
                                            style={{ marginRight: 8 }}
                                        /> : 
                                        <FontAwesomeIcon 
                                            icon={faUser} 
                                            className="text-white bg-info p-2 rounded-circle" 
                                            size='lg'
                                            style={{ marginRight: 8 }}
                                        />}
                                        
                                        <div className="w-100  ">
                                        <small className="text-secondary phone">Admin</small>
                                        <div className="bg-info rounded p-3 shadow-sm">
                                        <span className="text-white">{d}</span>
                                        </div>
                                    </div>
                                </div> */}
                                {data.map(MessageItems)}
                          
                        </Card.Body>                    
            
            </div> 
                    <Card.Footer>
                        <textarea onChange={handleText}  placeholder="Write message here..." className="form-control"></textarea>
                        <button className="btn btn-primary" onClick={submitMessage}>Reply</button>
                    </Card.Footer>             
        </Card>
    )
}

const UsersProfileComponent = () => {

    const [userId, setUserId] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)

    const { data, isLoading, error, refetch } = useGetAllUsersQuery(pageNumber)

    if(error) {
        return <span>Error...</span>
    }

    if(isLoading) {
        return <Spinner animation="grow"/>
    }

    const options =  data.data.data.map(n => {
        return {
            user_id: n.id,
            value: n.phone_number,
            label: n.phone_number,
        }
    })

    const selectUser = (e) => {
        const user_id = (e?.user_id || e?.target?.getAttribute('ui'))
        setUserId(user_id)
    }
 
    const UserNumElements = (l,i) => {
        return (
            <div className="d-flex align-items-center">
                {i+1}
                <button className="btn btn-primary w-100 m-1" onClick={selectUser} ui={l.id} style={{ letterSpacing: '2px' }}>{l.phone_number}</button>
            </div>           
        )
    }
    return (
        <Card className="mt-2 bg-danger">
                <Card.Body className="bg-light rounded">
                    <div className="d-sm-flex">
                        <Card className="w-100 m-2 shadow border-0 rounded bg-primary">
                            <Card.Header className="bg-primary text-white rounded border-0 m-0 text-center">
                                <h3 style={{ margin: 0, padding: 0 }}>Users</h3>
                            </Card.Header>
                            <hr className="m-0 p-0 text-light" />
                            <Card.Body className="text-center bg-primary text-white rounded"><h1>{data.count}</h1></Card.Body>
                        </Card>                    
                        <Card className="w-100 m-2 shadow border-0 bg-success rounded">
                            <Card.Header className="bg-success text-white m-0 text-center">
                                <h3 style={{ margin: 0, padding: 0 }}>Average</h3>
                            </Card.Header>
                            <hr className="m-0 p-0 text-light" />
                            <Card.Body className="text-center bg-success text-white rounded"><h1>Kes {Number(data.avg).toLocaleString(undefined, {})}</h1></Card.Body>
                        </Card>
                        <Card className="w-100 m-2 shadow border-0 bg-dark">
                            <Card.Header className="bg-dark text-white  m-0 text-center">
                                <h3 style={{ margin: 0, padding: 0 }}>Pending</h3>
                            </Card.Header>
                            <hr className="m-0 p-0 text-light" />
                            <Card.Body className="text-center bg-dark text-white rounded"><h1>Kes {Number(data.notPlaced).toLocaleString(undefined, {})}</h1></Card.Body>
                        </Card>
                        <Card className="w-100 m-2 shadow border-0 bg-warning">
                            <Card.Header className="bg-warning text-white  m-0 text-center">
                                <h3 style={{ margin: 0, padding: 0 }}>Total Amount</h3>
                            </Card.Header>
                            <hr className="m-0 p-0 text-light" />
                            <Card.Body className="text-center bg-warning text-white rounded"><h1>Kes {Number(data.wagers).toLocaleString(undefined, {})}</h1></Card.Body>
                        </Card>
                        <Card className="w-100 m-2 shadow border-0 bg-danger">
                            <Card.Header className="bg-danger text-white  m-0 text-center">
                                <h3 style={{ margin: 0, padding: 0 }}>Grand Total</h3>
                            </Card.Header>
                            <hr className="m-0 p-0 text-light" />
                            <Card.Body className="text-center bg-danger text-white rounded"><h1>Kes {Number(data.grandTotal).toLocaleString(undefined, {})}</h1></Card.Body>
                        </Card>
                    </div>
                    <Row className="shadow-sm m-2 p-2 rounded mx-auto">                        
                        <Col sm="12" md="3" lg="3" className="p-3">               
                            <button className="btn btn-dark m-2 w-100" onClick={refetch}>
                                <FontAwesomeIcon icon={faRefresh} style={{ marginRight: 8 }}/>
                                Reload
                            </button>                 
                            <h5 className="text-dark fw-bold">Select User</h5>
                            <Select options={options} className="text-dark" onChange={selectUser}/>    

                            {data.data.data.map(UserNumElements)}
                             <div className="d-flex mt-3" style={{ overflow: 'scroll' }}>
                                <Pagination 
                                    data={data.data} 
                                    setPageNumber={setPageNumber}
                                />
                             </div>
                            
                        </Col>
                        <Col sm="12" md="9" lg="8" className="shadow m-2 p-3">
                            <UserProfileElement user_id={userId} refetchData={refetch}/>
                        </Col>
                    </Row>
                </Card.Body> 
        </Card>
    )
}

const options = [
    {
        value: 'Lost',
        label: 'Lost'
    },
    {
        value: 'Pending',
        label: 'Pending'
    },
    {
        value: 'Won',
        label: 'Won'
    }
]

const UserBetHistoryElement = ({ data }) => {
 
    const [isStatusChanged, setIsStatusChanged] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [betStatus, setBestatus] = useState(options[0].value)
    const [outcome, setOutcome] = useState('0:0')

    const setBetOption = (e) => {
        setBestatus(e.value)
    }

    const changeStatus = async (user_id, session_id) => {

        setIsLoading(true)
        const res = await axios.patch(`api/admin/users/${user_id}/bets/${session_id}/update`, 
            { bet_status: betStatus }
        );

        if(res.status === 200) {
            setIsLoading(false)
            setIsStatusChanged(true)
        }

    }

    const handleHistorySubmit = async (cart_id) => {
        const res = await axios.patch('api/admin/history/updateCartHistory', {
            id: cart_id,
            outcome,
        })
    
    }

   
    const BetHistoryElements = (link, i) => {
 
        return (
            <React.Fragment key={i} >
                <tr scope="row">
                    <td>{i+1}</td>
                    <td>{link.bet_amount}</td>
                    <td>{link.possible_payout / link.bet_amount}</td>
                    <td>{link.possible_payout}</td>
                    <td>{link.bet_status}</td>
                    <td>
                        <Select className="text-dark" options={options} onChange={setBetOption}/>
                    </td>
                    <td>
                        <button 
                        className="btn btn-danger btn-sm"  
                        onClick={() => changeStatus(link.user_id, link.cart_id)}>
                            {isLoading ? 'Loading...' : 'Change' }
                            {isStatusChanged && <><i className="bi bi-check2-circle text-warning"></i></> }
                        </button>
                    </td>
                    <td>
                        <input type="text" className="form-control" onChange={(e) => setOutcome(e.target.value)}/>
                    </td>
                    <td>
                        <button className="btn btn-primary btn-sm" onClick={() => handleHistorySubmit(link.id)}>Submit</button>
                    </td>
                </tr>
            </React.Fragment>
        )
    }
    return (
        <Card className="border-0">
            <Card.Header className="bg-dark text-white d-flex align-items-center justify-content-between">
                <h4 className="fw-bold">Bet History</h4>
                <button className="btn btn-light m-2" onClick={() => refetch()}>
                    <FontAwesomeIcon icon={faRefresh} style={{ marginRight: 8 }}/>
                    Update History
                </button>
            </Card.Header>
            <Card.Body>
                <table className="table bg-primary rounded shadow text-white">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Odds</th>
                            <th scope="col">Payout</th>
                            <th scope="col">Status</th>
                            <th scope="col">Change Status</th>
                            <th scope="col">Update Status</th>
                            <th scope="col">Outcome</th>
                            <th scope="col">Update Outcome</th>
                        </tr>
                    </thead>
                    <tbody >
                        {data.map(BetHistoryElements)}
                    </tbody>
                </table>
            </Card.Body>         
        </Card>
    )
}

const StyleUserElement = styled.div`
    h4 {
        margin: 0;
        padding: 0;
    }
    h5 {
        margin: 0;
        padding: 0;
        color: #fff;
        font-weight: bold; 
    }
`

const UserProfileElement = ({ user_id, refetchData }) => {
  
        const { data, error, isLoading, refetch } = useGetAdminUserBalanceByIdQuery(user_id)
        const userBalance = useGetBalanceByUserIdQuery(user_id)
        const [newUserBalance, setNewUserBalance] = useState(0)
        const [bonus, setBonus] = useState(0)
        const [isBalanceUpdated, setIsBalanceUpdated] = useState(false)
        const [isModalOpen, setIsModalOpen] = useState(false)
        // const [newNum, setNewNum] = useState('')

        if(isLoading) { 
            return <Spinner animation="grow"/>
        }
    
        if(error) {
            return <ErrorElement message="Select User to Continue"/>
        }
 
        const { user_profile, history_profile } = data
   
        const { email, country_residence, phone_number } = user_profile

        const updateBalance = async () => {
            const amount = Number(newUserBalance) 
            const res = await axios.patch(`api/admin/users/${user_id}/balance/update`, {
                amount,
            });

            if(res.status === 200) {
                setIsBalanceUpdated(true)
                userBalance.refetch()
                setNewUserBalance(0)
                setTimeout(() => {
                    setIsBalanceUpdated(false)
                }, 1000)
             
            }
        }

        const updateBalanceDecrement = async () => {
            const amount = Number(newUserBalance) 
            const res = await axios.patch(`api/users/${user_id}/balance/decrement_user`, {
                amount,
                user_id,
            });
        }

        const changeBalance = (e) => {
            setNewUserBalance(e.target.value)
        }

        // const handleUserUpdate = async () => {
        //     const res = await axios.patch('api/admin/users/updateUser', {
        //         user_id,
        //         phone_number: Number(newNum)
        //     })
        // }
        const handleRemove = () => {
            setIsModalOpen(true)
        }

        const closeModal = () => {
            setIsModalOpen(false)
        }

        const removeUser = async (i) => {
           const res = await axios.delete(`api/admin/users/delete?id=${i}`)
 
           if(res.status === 200) {
            refetchData()
            closeModal()
           }
        }

        const updateBonus = async () => {
            const newBonus = Number(bonus)
            const res = await axios.patch(`api/admin/users/${user_id}/bonus`, {
                bonus: newBonus,
            });
        }

        const handleBonus = (e) => {
            setBonus(e.target.value)
        }
        return (
            <StyleUserElement className="card border-0">
                <Card.Header className=" bg-dark d-flex justify-content-between align-items-center">
                    <h4 className="text-white fw-bold " style={{ margin: 0, padding: 0 }}>
                        User Profile
                    </h4>
                    <button className="btn btn-danger m-2" onClick={handleRemove}>
                        <FontAwesomeIcon icon={faBan} style={{ marginRight: 8 }}/>
                        Remove User
                    </button>
                </Card.Header>
                <Card.Body className="row gy-2 gx-2">
                    <Col lg={6} md={6} sm={12} className="bg-secondary p-3 rounded shadow">
                        <div className="d-flex flex-column align-items-center justify-content-between">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="64" 
                                height="64" 
                                fill="currentColor" 
                                className="bi bi-person-circle text-white mb-3" 
                                viewBox="0 0 16 16"
                            >
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                            </svg> 
                            <h5 className="m-1">Number: {phone_number}</h5>
                            <h5 className="m-1">Current Balance Kes: {userBalance?.data?.amount}</h5>
                            <h5 className="m-1">Bonus Balance Kes: {userBalance?.data?.bonus}</h5>
                            <h5 className="m-1">
                                Total Kes: {Number(data.total_donation).toLocaleString(undefined)}
                            </h5>
                        </div>
                    </Col>
                    <Col lg={6} md={6} sm={12} className="bg-light">
                    <div className="bg-dark p-3 rounded shadow d-flex flex-column">
                        <label htmlFor="bonus" className="text-white">Bonus: </label>
                            <div className="d-flex align-items-center mb-3">
                                <InputNumber 
                                    id="bonus" 
                                    className="form-control d-block w-100" 
                                    placeholder={0} 
                                    style={{ maxWidth: 120 }}
                                    onChange={handleBonus}
                                    value={bonus}
                                />                                 
                            </div>
                            <button className="btn btn-light" onClick={updateBonus}>
                                {isBalanceUpdated ?  
                                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 8 }}/> :
                                <FontAwesomeIcon icon={faRefresh} style={{ marginRight: 8 }}/>}
                               
                                {isBalanceUpdated ? 'Bonus Updated' : 'Update Bonus'}  
                            </button>  
                    <hr className="text-light"/>
                        <div className="text-dark d-flex flex-column align-items-center">
                            <label htmlFor="balance" className="text-white">Balance: </label>
                            <div className="d-flex align-items-center mb-3">
                                <InputNumber 
                                    id="balance" 
                                    className="form-control d-block w-100" 
                                    placeholder={0} 
                                    style={{ maxWidth: 120 }}
                                    onChange={changeBalance}
                                    value={newUserBalance}
                                />                                 
                            </div>
                            <button className="btn btn-light" onClick={updateBalance} disabled={isBalanceUpdated}>
                                {isBalanceUpdated ?  
                                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 8 }}/> :
                                <FontAwesomeIcon icon={faRefresh} style={{ marginRight: 8 }}/>}
                               
                                {isBalanceUpdated ? 'Balance Updated' : 'Update Balance'}  
                            </button>  
                            <label htmlFor="balance" className="text-white">Balance: </label>
                            <div className="d-flex align-items-center mb-3">
                                <InputNumber 
                                    id="balance" 
                                    className="form-control d-block w-100" 
                                    placeholder={0} 
                                    style={{ maxWidth: 120 }}
                                    onChange={changeBalance}
                                    value={newUserBalance}
                                />                                 
                            </div>
                            <button className="btn btn-light" onClick={updateBalanceDecrement} disabled={isBalanceUpdated}>
                                {isBalanceUpdated ?  
                                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 8 }}/> :
                                <FontAwesomeIcon icon={faRefresh} style={{ marginRight: 8 }}/>}
                               
                                {'Decrement'}  
                            </button>                     
                        </div>  
                     </div>
                    </Col>
                </Card.Body>
               
                <UserBetHistoryElement data={history_profile}/>                            
                
                <AlertModalElement
                    isModalOpen={isModalOpen}
                    closeModal={closeModal}
                    primaryMessage="Are you sure you want to delete this user"
                    secondaryMessage="This action CANNOT be undone!"
                    submitBtnText="Delete"
                    cancelBtnText="Cancel"
                    cartId={user_id}
                    action={removeUser}
                />
            </StyleUserElement>
        )
}

const FixturesComponent = ({ postFixtureIds, postFixtureOdds, fixtureIdLoading, fixtureLoaded, fixtureOddsLoaded, fixtureOddsLoading }) => {
    const [startUpdate, setStartUpdate] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [clicked, setClicked] = useState('')
    const [historyUpdated, setHistoryUpdated] = useState(false)
    const [primaryMessage, setPrimaryMessage] = useState('')
    const [secondaryMessage, setSecondaryMessage] = useState('')
    const [submitBtnText, setSubmitBtnText] = useState('')
    const [fixtureRemoved, setFixtureRemoved] = useState(false)
    const [gamesUpdated, setGamesUpdated] = useState(false)

    const closeModal = () => setIsModalOpen(false)

    const handleUpdate = (e) => {
        if(e.target.innerText === 'Start') {
            setStartUpdate(true)
        } 
        if(e.target.innerText === 'Close') {
            setStartUpdate(false)
        }
    }

    const handleLost = async () => {
        const res = await axios.patch('api/fixtures/carts')
        
        if(res.status === 200) {
            setHistoryUpdated(true)
            closeModal()
            setTimeout(() => {
                setHistoryUpdated(false)
            }, 1500)
        }
    }

    const removeFixtures = async (e) => {
      const res = await axios.delete('api/admin/fixtures/remove')

      if(res.status === 200) {
        setFixtureRemoved(true)
        closeModal()
        setTimeout(() => {
            setFixtureRemoved(false)
        }, 1500)
      }
    }

    const openModal = (i) => {
        if(i === 'history') {
            setPrimaryMessage('Are you sure you want to update all history to LOST')
            setSecondaryMessage('This action cannot be undone!')
            setIsModalOpen(true)
            setClicked(i)
            setSubmitBtnText('Update')
        }
        if(i === 'fixture') {
            setPrimaryMessage('Are you sure you want to remove all fixtures')
            setSecondaryMessage('This action cannot be undone!')
            setIsModalOpen(true)
            setClicked(i)
            setSubmitBtnText('Delete')
        }
        if(i === 'games') {
            setPrimaryMessage('Are you sure you want to update all fixtures')
            setSecondaryMessage('This action cannot be undone!')
            setIsModalOpen(true)
            setClicked(i)
            setSubmitBtnText('Update')
        }
    }

    const updateGame = async () => {
        const res = await axios.post('api/admin/update/fixtures/odds');
        
        if(res.status === 200) {
            setGamesUpdated(true)
            closeModal()
            setTimeout(() => {
                setGamesUpdated(false)
            }, 1500)
        }
    }

    return (
        <div className="p-3 card mt-2 bg-danger shadow-lg">
            <Card className="mb-2">
                <Card.Body>
                    <Col lg={12} md={12} sm={12}>
                        <h3>Post Games</h3>
                        <button className="btn btn-primary" onClick={() => openModal('games')}> 
                           {gamesUpdated ? 'Games Updated' : 'Update Games'} 
                        </button>
                    </Col>
                </Card.Body>
                <Card.Body className="row">
                    <Col lg={6} md={6} sm={12} className="text-center">
                        <p>This action will update all bet history to LOST status</p>
                        <button className="btn btn-danger" onClick={() => openModal('history')}>
                            {historyUpdated ? 'Update Complete' : 'Update Lost'}  
                        </button>
                    </Col>
                    <Col lg={6} md={6} sm={12} className="text-center">
                        <p>This action will Delete all current fixtures/games</p>
                        <Button variant="primary" type="submit" onClick={() => openModal('fixture')}>
                              {fixtureRemoved ? 'Fixtures Deleted!' : 'Remove All'} 
                        </Button>
                    </Col>
                    {clicked === 'history' && <AlertModalElement
                        primaryMessage={primaryMessage}
                        secondaryMessage={secondaryMessage}
                        isModalOpen={isModalOpen}
                        closeModal={closeModal}
                        submitBtnText={submitBtnText}
                        cancelBtnText="Cancel"
                        action={handleLost}
                    />}
                    {clicked === 'fixture' && <AlertModalElement
                        primaryMessage={primaryMessage}
                        secondaryMessage={secondaryMessage}
                        isModalOpen={isModalOpen}
                        closeModal={closeModal}
                        submitBtnText={submitBtnText}
                        cancelBtnText="Cancel"
                        action={removeFixtures}
                    />}
                    {clicked === 'games' && <AlertModalElement
                            primaryMessage={primaryMessage}
                            secondaryMessage={secondaryMessage}
                            isModalOpen={isModalOpen}
                            closeModal={closeModal}
                            submitBtnText={submitBtnText}
                            cancelBtnText="Cancel"
                            action={updateGame}
                        />
                    }
                        
                </Card.Body>
            </Card>
            <FixturesElement 
            postFixtureIds={postFixtureIds}
            postFixtureOdds={postFixtureOdds}
            fixtureIdLoading={fixtureIdLoading}
            fixtureOddsLoaded={fixtureOddsLoaded}
            fixtureOddsLoading={fixtureOddsLoading}
            />
            <CustomFixture/>
            <div className="card p-2 mt-4">
                <div className="d-flex justify-content-center m-2">
                    <button className="btn btn-primary btn-lg" onClick={handleUpdate}>
                        { startUpdate ? 'Close' : 'Start'}
                    </button>
                </div>
                {startUpdate ?  <FixtureOdds setStartUpdate={setStartUpdate}/> : '' }
            </div>
        
            <ConsoleOutPut 
            fixtureLoaded={fixtureLoaded}
            fixtureOddsLoaded={fixtureOddsLoaded}
            />
        </div>
    )
}

const FixturesElement = ({ postFixtureIds, postFixtureOdds, fixtureIdLoading, fixtureOddsLoaded, fixtureOddsLoading }) => {
   
    return (
            <Row>
                <Col sm="12" lg="6" md="6">
                    <Card className="border-0 shadow">
                        <Card.Header className="bg-primary">
                           <h3 className="text-light fw-bold"> Fixture IDs</h3>
                        </Card.Header>
                        <Card.Body className="bg-light text-center">
                            <h5 className="text-dark fw-bold">To Post Fixture IDS</h5>
                            <div className="btn btn-danger mt-2">
                                <Button variant="danger" onClick={postFixtureIds}>
                                    { fixtureIdLoading ? 'loading...'  :  'Click Here'}
                                </Button>
                                <i className="bi bi-caret-right-fill"></i>
                            </div>
                         
                        </Card.Body>
                    </Card>
                   
                </Col>
                <Col sm="12" lg="6" md="6">
                <Card className="border-0 shadow">
                    <Card.Header className="bg-primary">
                        <h3 className="text-light fw-bold"> Fixture Odds</h3>
                    </Card.Header>
                    <Card.Body className="bg-light text-center">
                        <h5 className="text-dark fw-bold">To post Fixture Odds</h5>
                        <div className="btn btn-danger mt-2">
                            <Button variant="danger" onClick={postFixtureOdds}>
                            { fixtureOddsLoading ? 'loading...'  :  'Click Here'}
                            </Button>
                            <i className="bi bi-caret-right-fill"></i>
                        </div>                     
                    </Card.Body>
                </Card>
                </Col>
            </Row>
    )
}
const CustomFixture = () => {
    const [isUpdated, setIsUpdated] = useState(false);
    const [fixtureDetails, setFixtureDetails] = useState({
        home: '',
        away: '',
        country: '',
        league_name: '',
        fixture_id: '',
    })

    const { 
        home, 
        away, 
        league_name,
        fixture_id,
        country,
    } = fixtureDetails
    const { data, isLoading } = useGetAllFixturesIdsQuery()
   
    if(isLoading) {
        return <Spinner animation="grow"/>
    }

    const options = data?.data?.map(d => {
        return {
            value: d.fixture_id,
            label: d.fixture_id
        }
    })

    const submitFixture = async (e) => {
        e.preventDefault()
        const res = await axios.patch('api/admin/fixture', {
            fixture_id,
            league_name,
            home,
            away,
            country,
        })

        if(res.status === 200) {
            setIsUpdated(true)
        }
    }

    const onchange = (e) => setFixtureDetails(prev => ({...prev, [e.target.name] : e.target.value}))

    const onselect = (e) => setFixtureDetails(prev => ({...prev, fixture_id: e.value})) 

   
    return (
        <Card className="mt-4 border-0 bg-danger shadow">
            <Card.Header className="bg-primary">
                <h3 className="text-light fw-bold">Custom Fixture</h3>
            </Card.Header>
            <Card.Body className="bg-light ">
            <Form>
                <Row>
                        <Col lg="2" md="2" sm="2">
                            <Form.Group className="mb-3" controlId="formBasicHome">
                                <Form.Label className="text-dark">Fixture ID</Form.Label>
                                <Select className="text-dark" options={options} onChange={onselect}/>
                            </Form.Group>
                        </Col>
                        <Col lg="2" md="2" sm="2">
                            <Form.Group className="mb-3" controlId="formBasicHome">
                                <Form.Label className="text-dark">Home Team</Form.Label>
                                <Form.Control 
                                type="text" 
                                name="home" 
                                placeholder="Enter Home Team" 
                                onChange={onchange} 
                                />
                            </Form.Group>
                        </Col>
                        <Col lg="2" md="2" sm="2">
                            <Form.Group className="mb-3" controlId="formBasicAway">
                                <Form.Label className="text-dark">Away Team</Form.Label>
                                <Form.Control 
                                type="text" 
                                name="away" 
                                placeholder="Enter Away Team" 
                                onChange={onchange} 
                                />
                            </Form.Group>
                        </Col>
                        <Col lg="2" md="2" sm="2">
                            <Form.Group className="mb-3" controlId="formBasicAway">
                                <Form.Label className="text-dark">Country</Form.Label>
                                <Form.Control 
                                type="text" 
                                name="country" 
                                placeholder="Enter Country" 
                                onChange={onchange} 
                                />
                            </Form.Group>
                        </Col>
                        <Col lg="2" md="2" sm="2">
                            <Form.Group className="mb-3" controlId="formBasicAway">
                                <Form.Label className="text-dark">League</Form.Label>
                                <Form.Control 
                                type="text" 
                                name="league_name" 
                                placeholder="Enter League Name" 
                                onChange={onchange} 
                                />
                            </Form.Group>
                        </Col>
                        <Col lg="2" md="2" sm="2">
                            <Form.Group className="mb-3" controlId="formBasicAway">
                                <Form.Label className="text-dark">Date</Form.Label>
                                <Form.Control 
                                type="date" 
                                name="fixture_date" 
                                placeholder="Enter Date" 
                                onChange={onchange} 
                                />
                            </Form.Group>
                        </Col>
                      
                        <div className="d-flex justify-content-center">
                           
                            <Button variant="primary" type="submit" onClick={submitFixture}>
                              {isUpdated  ? 'Added' : ' Add Fixture'} 
                            </Button>
                         
                        </div>
                </Row>
           
                </Form>
             
            </Card.Body>
            
        </Card>
    )
}

const FixtureOdds = ({ setStartUpdate }) => {    

    const { data, isLoading, error, refetch } = useGetFixtureIdsWhereOddsNullQuery()
    const [ids, setIds] = useState(0)
    const [updated, setUpdated] = useState(false)
    const [fixtureId, setFixtureId] = useState(0)
    const [maxLength, setMaxLength] = useState(null)
    const [progress, setProgress] = useState(0)
    const [isUpdateComplete, setIsUpdateComplete] = useState(false)

    const [homeValues, setHomeValues] = useState({
        value: '',
        odd: ''
    }) 
    const [drawValues, setDrawValues] = useState({
        value: '',
        odd: ''
    }) 
    const [awayValues, setAwayValues] = useState({
        value: '',
        odd: ''
    })

    if(error) {
        return <span>Error</span>
    }
    const handleChange = () =>  {
        let home = Number((Math.random() * 5).toFixed(2))
        let draw = Number((Math.random() * 4).toFixed(2))
        let away = Number((Math.random() * 6).toFixed(2))
        
        if(draw < 1 ) {
            draw += 1
        }
        if(home < 1) {
            home += 1
        }
        if(away < 1) {
            away += 1
        }

        setHomeValues({
            value: 'Home',
            odd: Number(home).toFixed(2)
        })

        setDrawValues({
            value: 'Home',
            odd: Number(draw).toFixed(2)
        })

        setAwayValues({
            value: 'Home',
            odd: Number(away).toFixed(2)
        })
    }
  
    const updateFixture = async (sessionFixtureId, home, draw ,away) => {       

         if(sessionFixtureId === 'undefined') {
            return
         }
        const odds = [{ id: 1, 
            name: 'Match Winner', 
            values: [ {value: 'Home', odd: home}, {value: 'Draw', odd: draw}, {value: 'Away', odd: away} ] }]
  
    
        const { status } = await axios.patch(`api/fixtures/custom_odds/${sessionFixtureId}`, {
            odds
        })  

        if(status === 200) {
            setProgress(prev => prev += 1)
            setUpdated(prev => !prev)   
            refetch()
        }
    }
 
    function update(sessionFixtureId, homeOdds, drawOdds, awayOdds) {

        if(Boolean(sessionFixtureId) === false) {
            alert('Update complete')
            setStartUpdate(false)
        }

        handleChange()  
        updateFixture(sessionFixtureId, homeOdds, drawOdds, awayOdds)
    }

    useEffect(() => {
        const dataLength = sessionStorage.getItem('data_length')
        setMaxLength(dataLength)
        const sessionFixtureId = sessionStorage.getItem('update_id')
        setFixtureId(sessionFixtureId)
        const homeOdds = sessionStorage.getItem('update_home')
        const drawOdds = sessionStorage.getItem('update_draw')
        const awayOdds = sessionStorage.getItem('update_away')

        update(sessionFixtureId, homeOdds, drawOdds, awayOdds)

    }, [updated])

    if(isLoading) {
        return <span>Loading</span>
    }
    
    sessionStorage.setItem('update_home', homeValues.odd)
    sessionStorage.setItem('update_draw', drawValues.odd)
    sessionStorage.setItem('update_away', awayValues.odd)   
    sessionStorage.setItem('update_id',(data[ids]?.fixture_id))    
    sessionStorage.setItem('progress', progress)

    if(Boolean(maxLength) === false) {
         sessionStorage.setItem('data_length', data?.length)
    }  

    return (
        <Card>    
            <Card.Body className="bg-dark text-center">
                <h1>
                    {updated ? 
                        <i className="bi bi-eye-slash text-danger"></i> : 
                        <i className="bi bi-eye-fill text-warning"></i>
                    }
                </h1>
            </Card.Body>
        </Card>
    )
}

const ConsoleOutPut = ({ fixtureLoaded, fixtureOddsLoaded }) => {
    const date = new Date()
  
    const NoActivity = () =>  <small className="fw-bold">No activity...</small>

    const YesActivity = () => {
        return (
            <>
                <small className="text-light d-block mt-2">
                    Fixture IDs {fixtureLoaded ? 'loaded' : 'loading'} : {fixtureLoaded.toString()}
                    {fixtureLoaded && <i className="bi bi-check2-circle text-warning" style={{ marginLeft: 10 }}></i>} 
                </small>
                <small className="text-light d-block mt-2">
                    Fixture Odds {fixtureOddsLoaded ? 'loaded' : 'loading'} : {fixtureOddsLoaded.toString()}
                    {fixtureOddsLoaded && <i className="bi bi-check2-circle text-warning" style={{ marginLeft: 10 }}></i>} 
                </small>
            </>
        )
    }
    return (
        <Card className="mt-3 shadow bg-dark">
            <Card.Header>
                <h2 className="fw-bold pt-2">Console OutPut</h2>
            </Card.Header>
            <hr/>
            <Card.Body className="p-2 mb-5">
                <Row>
                    <Col lg="2" md="2" sm="2" className="text-end">
                        <small>
                            {date.getMonth()}/
                            {date.getDay()}/
                            {date.getFullYear() + ' '} 
                            {date.getHours()}:
                            {date.getMinutes()}
                        </small>
                    </Col>
                    <Col lg="10" md="10" sm="10">
                        <NoActivity/>
                        <YesActivity/>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
      
    )
}