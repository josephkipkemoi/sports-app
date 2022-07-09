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
import { InputNumber } from "../components/Html";
import { useGetAdminUserBalanceByIdQuery, useGetAllUsersQuery } from "../hooks/admin";
import { useGetBalanceByUserIdQuery } from "../hooks/balance";
import config from '../../config.json';

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
    }
]
 
export default function Admin() {
    const router = useRouter();
    const { tab } = router.query;
    const [fixtureIdLoading, setFixtureIdLoading] = useState(false)
    const [fixtureLoaded, setFixtureLoaded] = useState(false)
    const [fixtureOddsLoading, setFixtureOddsLoading] = useState(false)
    const [fixtureOddsLoaded, setFixtureOddsLoaded] = useState(false)
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

    return (
        <StyledAdmin className="p-3 container bg-danger">
            <div className="text-center p-2">
                <h1>
                    <i className="bi bi-headset" style={{ marginRight: 5 }}></i>
                    Command Center
                </h1>
            </div>
            <nav className="bg-light p-3 shadow-lg rounded">
                {adminLinks.map(AdminLinkItems)}
            </nav>

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
        </StyledAdmin>
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
                    <td>{link.stake_amount}</td>
                    <td>{link.total_odds}</td>
                    <td>{link.final_payout}</td>
                    <td>{link.betslip_status}</td>
                    <td>
                        <Select className="text-dark" options={options} onChange={setBetOption}/>
                    </td>
                    <td>
                        <button 
                        className="btn btn-danger btn-sm"  
                        onClick={() => changeStatus(link.user_id, link.session_id)}>
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
        home_team: '',
        away_team: '',
        home_odds: '',
        draw_odds: '',
        away_odds: '',
        league_name: '',
        country: '',
        fixture_date: '',
    })

    const { 
        home_team, 
        away_team, 
        home_odds, 
        draw_odds, 
        away_odds,
        league_name,
        country,
        fixture_date 
    } = fixtureDetails

    const submitFixture = async (e) => {
        e.preventDefault()
        const res = await axios.post('api/admin/fixture', {
            fixture_id: config.CUSTOM_FIXTURE_ID,
            league_name,
            country,
            fixture_date,
            home_team,
            away_team,
            home_odds,
            draw_odds,
            away_odds,
        })

        if(res.status === 200) {
            setIsUpdated(true)
        }
    }

    const onchange = (e) => setFixtureDetails(prev => ({...prev, [e.target.name] : e.target.value}))

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
                                <Form.Label className="text-dark">Home Team</Form.Label>
                                <Form.Control 
                                type="text" 
                                name="home_team" 
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
                                name="away_team" 
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
                        <Col lg="4" md="4" sm="4">
                            <Form.Group className="mb-3" controlId="formBasicHomeOdds">
                                <Form.Label className="text-dark">Home Odds</Form.Label>
                                <Form.Control 
                                type="number" 
                                name="home_odds" 
                                placeholder="Home Odds" 
                                onChange={onchange} 
                                />
                            </Form.Group>                     
                        </Col>
                        <Col lg="4" md="4" sm="4">
                            <Form.Group className="mb-3" controlId="formBasicDrawOdds">
                                <Form.Label className="text-dark">Draw Odds</Form.Label>
                                <Form.Control 
                                type="number" 
                                name="draw_odds" 
                                placeholder="Draw Odds" 
                                onChange={onchange} 
                                />
                            </Form.Group>
                        </Col>
                        <Col lg="4" md="4" sm="4">   
                            <Form.Group className="mb-3" controlId="formBasicAwayOdds">
                                <Form.Label className="text-dark">Away Odds</Form.Label>
                                <Form.Control 
                                type="number" 
                                name="away_odds" 
                                placeholder="Away Odds" 
                                onChange={onchange} 
                                />
                            </Form.Group>
                        </Col>
                        <div className="text-center">
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