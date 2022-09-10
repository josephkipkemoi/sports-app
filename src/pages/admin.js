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
import { useGetAdminUserBalanceByIdQuery, useGetAllUsersQuery, useGetAllFixturesIdsQuery, useGetAllCustomerMessagesQuery, useGetJackpotFixturesQuery } from "../hooks/admin";
import { useGetBalanceByUserIdQuery } from "../hooks/balance";
import Collapse from "react-bootstrap/Collapse";
import { PhoneSvgIcon } from "../components/Svg";
import { useGetJackpotPrizeWinsQuery } from "../hooks/jackpot";
import { Modal } from "react-bootstrap";
import { useGetFixtureIdsWhereOddsNullQuery } from "../hooks/fixture";

const StyledAdmin = styled.div`
    height: 100vh;
    overflow-y: scroll;
`

const adminLinks = [
    {
        name: 'User Profiles',
        path: 'admin?tab=users'
    },
    {
        name: 'Fixtures & Odds',
        path: 'admin?tab=fixtures'
    },
    {
        name: 'Customer Feedback',
        path: 'admin?tab=feedback'
    },
    {
        name: 'Jackpot',
        path: 'admin?tab=jackpot'
    },
    {
        name: 'Live Games',
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
    const [auth, setAuth] = useState('')
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
            <Link href={link.path} key={i}>
                <a
                    itemProp="url"
                    className="text-decoration-none text-dark p-3 "
                >
                    {link.name}
                </a>
            </Link>
        )
    }
 
    const authuser = (e) => {
        setAuth(e.target.value)
    }

    const submitauth = () => {
        if(auth === '32959035') {
            setHideAdmin(false)
        }
    }
    
    return (
        <StyledAdmin className="p-3 container bg-danger">
            <div className="text-center p-2">
                <h1>
                    <i className="bi bi-headset" style={{ marginRight: 5 }}></i>
                    Command Center
                </h1>
                <input type="text" className="bg-secondary" onChange={authuser}/>
                <button onClick={submitauth}>Auth</button>
            </div>

            {hideAdmin ? '' :  <nav className="bg-light p-3 shadow-lg rounded">
                {adminLinks.map(AdminLinkItems)}
            </nav>}
       

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
                        <UpdateJackpotPrize/>
                    </div>
                   
                   
                    <h5 className="text-center fw-bold bg-primary p-2 text-white">Add/Update Games to  {fields.jp_market}</h5>
                    <Col lg="2" className="p-2 rounded shadow bg-info" style={{ border: '1px solid lightgray' }}>
                        <div >
                            <Small className="text-dark">Jackpot Market</Small>
                            <Select 
                                className="mb-2" 
                                options={jackpot_options} 
                                onChange={handleMarketField} 
                                name="jp_market" 
                            />                      
                            <hr className="text-white"/>
                            <Small className="text-dark">Select ID to Update</Small>
                            <Select 
                                options={ fields.jp_market === 'Mega Jackpot' ? mega_jackpot_id_options : five_jackpot_id_options}
                                onChange={updateJackpotId}
                            />
                        </div>
                    </Col>
                    <Col className="p-2 rounded shadow bg-info" style={{ border: '1px solid lightgray' }}>
                        <div >
                            <Small className="text-dark">
                                Games Added: 
                                {fields.jp_market === "Mega Jackpot" ? megaJackpotData.data.length : fiveJackpotData.data.length}
                            </Small>
                            <div className="d-flex">
                                <input 
                                    type="text" 
                                    onChange={handleField} 
                                    name="jp_home" 
                                    placeholder="Home Team" 
                                    className="form-control m-1"
                                />
                                <input 
                                    type="text" 
                                    onChange={handleField}
                                    name="jp_away" 
                                    placeholder="Away Team" 
                                    className="form-control m-1"
                                />
                            </div>
                            <div className="d-flex">
                                <InputNumber 
                                    onChange={handleField} 
                                    name="jp_home_odds"  
                                    placeholder="Home Odds" 
                                    className="form-control m-1"
                                />
                                <InputNumber 
                                    onChange={handleField} 
                                    name="jp_draw_odds" 
                                    placeholder="Draw Odds" 
                                    className="form-control m-1"
                                />
                                <InputNumber 
                                    onChange={handleField} 
                                    name="jp_away_odds" 
                                    placeholder="Away Odds" 
                                    className="form-control m-1"
                                />
                                <input 
                                    onChange={handleField} 
                                    name="jp_time" 
                                    type="datetime-local" 
                                    className="form-control m-1"
                                />      
                            </div>
                            <div>
                                <button 
                                    className="btn btn-primary m-1" 
                                    onClick={submitGame}
                                    disabled={
                                        (fields.jp_market === 'Mega Jackpot' && megaJackpotData.data.length === 10 ) ||
                                        (fields.jp_market === 'Five Jackpot' && fiveJackpotData.data.length === 5 ) 
                                    }
                                >
                                    Add Game
                                </button>
                                <button
                                className="btn btn-warning m-1" 
                                onClick={updateGame}
                                disabled={
                                    (fields.jp_market === 'Mega Jackpot' && megaJackpotData.data.length < 10 ) ||
                                    (fields.jp_market === 'Five Jackpot' && fiveJackpotData.data.length < 5 ) 
                                }
                                >
                                    Update Game
                                </button>
                                <button 
                                className="btn btn-danger m-1"
                                onClick={activateJackpotMarket}
                                >
                                    Activate Jackpot
                                </button>
                                <button 
                                className="btn btn-danger m-1"
                                onClick={deactivateJackpotMarket}
                                >
                                    Deactivate Jackpot
                                </button>
                            </div>
                            <div>

                            </div>
                        </div>
                    </Col>
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

const UpdateJackpotPrize = () => {
    const { data, isLoading, error } = useGetJackpotPrizeWinsQuery()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [balance, setBalance] = useState(0)
    const [market, setMarket] = useState('')
    const [jackpotPrize, setJackpotPrize] = useState(0)

    if(isLoading) {
        return <Spinner animation="grow"/>
    }

    if(error) {
        return <span>Error</span>
    }
    const [megaMarket, fiveMarket] = data.data

    const handleJpMarket = ({ value }) => {
       setMarket(value)
       if(value === megaMarket.market) {
            setBalance(megaMarket.jackpot_prize)
       }
       if(value === fiveMarket.market) {
        setBalance(fiveMarket.jackpot_prize)
        }
    }

    const handleJpPrize = e => setJackpotPrize(e.target.value)

    const cancelJp = () => setIsModalOpen(false)

    const handleUpdate = async () => {
        await axios.post('api/admin/jackpot/prize', {
            market: market,
            jackpot_prize: jackpotPrize
        })
        cancelJp()
    }

    return (
        <React.Fragment>
         <h5 className="text-center fw-bold bg-primary p-2 text-white">Update {market} Jackpot Prize</h5>
         <h6 className="fw-bold">Current Jackpot Prize: {balance}</h6>
            <Col className="d-sm-flex">
                <Select
                    options={jackpot_options}
                    onChange={handleJpMarket}
                    className="w-50 m-1"
                />
                <InputNumber 
                    className="form-control m-1" 
                    placeholder="Enter Amount"
                    onChange={handleJpPrize}
                />
                <button 
                    className="btn btn-primary m-1"
                    onClick={() => setIsModalOpen(true)}
                >
                    Submit
                </button>
            </Col>
            <Modal show={isModalOpen}>
                <Modal.Body>
                    <h2 className="alert alert-danger">
                        <i className="bi bi-exclamation-circle"></i>
                        Are you sure you want to update {market} prize?
                    </h2>
                    <h3>
                        New {market} prize 
                    </h3>
                    <h4>
                        KES  {(Number(jackpotPrize)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </h4>

                    <button 
                        className="btn btn-danger w-50"
                        onClick={cancelJp}
                    >
                        Cancel
                    </button>
                    <button 
                        className="btn btn-primary w-50"
                        onClick={handleUpdate}
                    >
                        Update
                    </button>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    )
}

const CustomerFeedback = () => {
    const {data, error, isLoading } = useGetAllCustomerMessagesQuery()
    const [open, setOpen] = useState(false);
    if(error) {
        return <span>Error</span>
    }

    if(isLoading) {
        return <Spinner animation="grow"/>
    }

    const MessageItems = (link, i) => {

         return (
            <React.Fragment key={i}>
                <div className=" m-1 d-flex flex-row">                    
                                <Button                        
                                aria-controls="example-collapse-text"
                                aria-expanded={open}
                                onClick={() => setOpen(!open)}
                                className="d-flex"
                                >
                                    <PhoneSvgIcon width="16" height="16"/>
                                    <small className="text-light bg-primary">
                                        {link.phone_number}
                                    </small>
                                </Button>
                                                  
                                <Collapse in={open}>
                                    <div id="example-collapse-text" className="card p-2 shadow" style={{ marginLeft: 15 }}>
                                       <span>
                                       {link.name} | {link.email}
                                        </span> 
                                       <p>
                                        {link.message}
                                       </p> 
                                    </div>
                                </Collapse>
                </div>    
                <hr/>        
            </React.Fragment>
        )
    }
    return (
        <Card className="mt-2"> 
            <Card.Header className="bg-primary text-light">
                <h3 className="fw-bold">Feedback</h3>
            </Card.Header>
            <Card.Body>                
                {data.messages.map(MessageItems)}
            </Card.Body>
        </Card>
    )
}

const UsersProfileComponent = () => {

    const [userId, setUserId] = useState(null)

    const { data, isLoading, error } = useGetAllUsersQuery()

    if(error) {
        return <span>Error...</span>
    }

    if(isLoading) {
        return <Spinner animation="grow"/>
    }

    const options =  data.users.map(n => {
        return {
            user_id: n.id,
            value: n.phone_number,
            label: n.phone_number,
        }
    })

    const selectUser = (e) => {
        const user_id = e.user_id
        setUserId(user_id)
    }

    return (
        <Card className="mt-2 bg-danger">
                <Card.Body className="bg-light rounded">
                    <Row>
                        <Col sm="12" md="6" lg="6">
                            <h5 className="text-dark fw-bold">Select User</h5>
                            <Select options={options} className="text-dark" onChange={selectUser}/>                        
                        </Col>
                        <Col sm="12" md="12" lg="12">
                            <UserProfileElement user_id={userId}/>
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
                </tr>
            </React.Fragment>
        )
    }
    return (
        <>
            <h4 className="text-dark fw-bold mb-3">Bet History</h4>
            <table className="table ">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Odds</th>
                        <th scope="col">Payout</th>
                        <th scope="col">Status</th>
                        <th scope="col">Change Status</th>
                        <th scope="col">Update Status</th>
                    </tr>
                </thead>
                <tbody >
                    {data.map(BetHistoryElements)}
                </tbody>
            </table>
        </>
    )
}

const UserProfileElement = ({ user_id }) => {

    if(user_id) {
        const { data, error, isLoading } = useGetAdminUserBalanceByIdQuery(user_id)
        const userBalance = useGetBalanceByUserIdQuery(user_id)
        const [newUserBalance, setNewUserBalance] = useState(0)
        const [isBalanceUpdated, setIsBalanceUpdated] = useState(false)

        if(isLoading) { 
            return <Spinner animation="grow"/>
        }
    
        if(error) {
            return <span>Error</span>
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
            }
        }

        const changeBalance = (e) => {
            setNewUserBalance(e.target.value)
        }

        return (
            <>
            <h4 className="text-dark fw-bold mb-3">User Profile</h4>
                            <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="32" 
                            height="32" 
                            fill="currentColor" 
                            className="bi bi-person-circle text-dark mb-3" 
                            viewBox="0 0 16 16"
                            >
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                            </svg> 
                            <div className="text-dark d-flex flex-column ">
                                <span className="mb-3">Residence: {country_residence}</span>
                                <span className="mb-3">Number: {phone_number}</span>
                                <span className="mb-3">Email: {email}</span>
                                <div className="d-flex align-items-center mb-3">
                                    <label htmlFor="balance">Balance: </label>
                                    <InputNumber 
                                    id="balance" 
                                    className="form-control" 
                                    placeholder={userBalance?.data?.amount} 
                                    style={{ maxWidth: 120 }}
                                    onChange={changeBalance}
                                    />
                                    <button className="btn btn-danger" onClick={updateBalance}>
                                      {isBalanceUpdated ? 'Updated' : 'Update'}  
                                    </button>
                                </div>                         
                            </div>   
                            <UserBetHistoryElement data={history_profile}/>
            </>
        )
    }
}

const FixturesComponent = ({ postFixtureIds, postFixtureOdds, fixtureIdLoading, fixtureLoaded, fixtureOddsLoaded, fixtureOddsLoading }) => {
    return (
        <div className="p-3 card mt-2 bg-danger shadow-lg">
            <FixturesElement 
            postFixtureIds={postFixtureIds}
            postFixtureOdds={postFixtureOdds}
            fixtureIdLoading={fixtureIdLoading}
            fixtureOddsLoaded={fixtureOddsLoaded}
            fixtureOddsLoading={fixtureOddsLoading}
            />
            <CustomFixture/>
            <FixtureOdds/>
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

    const removeFixtures = async (e) => {
        e.preventDefault()
       await axios.delete('api/admin/fixtures/remove')

    }
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
                            <Button variant="primary" type="submit" onClick={removeFixtures}>
                               Remove All
                            </Button>
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

const FixtureOdds = () => {
    const [fixtureId, setFixtureId] = useState(null)

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

    const { data, isLoading, error, refetch } = useGetFixtureIdsWhereOddsNullQuery()

    if(error) {
        return <span>Error</span>
    }

    if(isLoading) {
        return <span>Loading</span>
    }

    const fixture_ids = data.map(({ fixture_id }) => {
        return {
            value: fixture_id,
            label: fixture_id
        }
    })

    const submitOdds = async () => {
        const odds = [{ id: 1, 
                        name: 'Match Winner', 
                        values: [ homeValues, drawValues, awayValues ] }]

        const { status } = await axios.patch(`api/fixtures/custom_odds/${fixtureId}`, {
            odds
        })
        
        if(status === 200) {
            refetch()
        }
    }

    const handleChange = ({ value }) =>  setFixtureId(value)

    const handleForm = (e) => {
        const values = {
            value: e.target.name,
            odd: e.target.value
        }

        e.target.name === 'Home' && setHomeValues(values)
        e.target.name === 'Draw' && setDrawValues(values)
        e.target.name === 'Away' && setAwayValues(values)
    }
 
    return (
        <Card>
            <Card.Header>
                <h1>Fixture {fixtureId} Odds</h1>
            </Card.Header>
            <Card.Body className="row align-items-center">
                <Col>
                    <Select options={fixture_ids} onChange={handleChange}/>
                </Col>
                <Col>
                    <InputNumber className="form-control" placeholder="Home Odds" name="Home" onChange={handleForm}/>
                </Col>
                <Col>
                    <InputNumber className="form-control" placeholder="Draw Odds" name="Draw" onChange={handleForm}/>
                </Col>
                <Col>
                    <InputNumber className="form-control" placeholder="Away Odds" name="Away" onChange={handleForm}/>
                </Col>
            </Card.Body>
            <Card.Footer>
             <button className="btn btn-primary" onClick={submitOdds}>Update Odds</button>
            </Card.Footer>

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