import React from "react";
import styled from "styled-components";
import Support from '../components/Support';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CustomerInfo from "../components/CustomerInfo";
import TopNavBar from "../components/TopNavBar";
import { useGetAllLiveFixturesQuery } from '../hooks/liveFixtures';
import Spinner from "react-bootstrap/Spinner";
import Link from "next/link";
import { useRouter } from "next/router";
import Container from "react-bootstrap/Container";
import Image from "next/image";
import { Small, Span } from "../components/Html";


const StyleLivePage = styled.div`
    height: 100vh;
    overflow-x: hidden;
    overflow-y: scroll;
    background-color: #505050;
    h5 {
        letter-spacing: 1px;
    }
    span {
        letter-spacing: 1px;
    }
    .card-bb {
        min-height: 25vh;
    }
    .card-container {
        margin: 15vh auto;
    }
`
export default function Live() {
    const router = useRouter()
    const { query: { fixture } } = router
   
    return (
        <StyleLivePage>
            <Row className="px-2">
                <Col lg="9" md="9" sm="12" style={{ padding: 0 }}>
                    <TopNavBar/>
                    <JackpotAdvert/>
                    <LiveGamesNavBar/>
                    {fixture === 'all' && <AllFixturesComponent/>}
                    {fixture === 'live' && <LiveFixturesComponent/>}
                    {fixture === 'finished' && <FinishedFixturesComponent/>} 
                    {fixture === 'scheduled' && <ScheduledFixturesComponent/>}
                </Col>
                <Col lg="3" md="3" sm="12" style={{ paddingLeft: 0 }}>
                    <CustomerInfo/>
                </Col>
            </Row>
           
            <Support/>

        </StyleLivePage>
    )
}

const ScheduledFixturesComponent = () => {
    return (
        <div>
           <NoLiveGamesComponent/>
        </div>
    )
}

const FinishedFixturesComponent = () => {
  return (
        <div>
           <NoLiveGamesComponent/>
        </div>
    )
}

const AllFixturesComponent = () => {
    return (
        <div>
           <NoLiveGamesComponent/>
        </div>
    )
}

const StyleLiveFixturesComponent = styled.div`
    padding: .25rem;
    margin: .25rem;
    .live-star {
        width: 18px;
        height: 24px;
    }
    .live-img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
    }
    .live-img , img {
        margin-top: 5px;
    }
    .span-round {
        margin-left: 5px;
    }
    .elapsed-el {
        width: 72px;
    }
    .teams-ct {
        margin-left: 10px;
    }
    .teams {
        width: 60vw;
    }
`

const StyleLiveIcon = styled.div`
    margin-left: 6px;
`

const LiveFixturesComponent = () => {
    const { data, isLoading, error } = useGetAllLiveFixturesQuery('all')

    if(isLoading) {
        return <Spinner animation="grow"/>
    }

    if(error) {
        return <span>Error</span>
    }

    const { live_fixtures } = data

    const LiveGamesElements = (d,i) => {
        const { league, 
                goals, 
                fixture: { status: { elapsed } }, 
                teams: { home, away },
                score: { fulltime }
             } = d;

        return (
            <React.Fragment key={i}>
                <div className="d-flex align-items-center justify-content-between p-2 bg-secondary mb-1"> 
                <div className="d-flex align-items-center">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-star text-light live-star"></i>
                        <div className="live-img">
                            <Image
                                width={18}
                                height={20}
                                src={league.logo}                               
                            />
                        </div>
                       
                    </div>
                    <div className="d-sm-flex align-items-center country-spn">
                        <Span className="text-white">{league.country}: </Span>
                        <Span className="text-white">{league.name}</Span>
                    </div>
                </div>         

                <i className="bi bi-chevron-up text-white text-right"></i>

                </div>

                <div className="p-2 d-flex justify-content-between align-items-center">
                    <div className="d-flex justify-content-center ">
                        <div className="d-flex align-items-center ">
                            <i className="bi bi-star text-light live-star"></i>
                        </div> 
                        <div className="elapsed-el text-center"> 
                            <Span className="text-danger fw-bold">{elapsed}</Span>  
                        </div>
                    </div>
                                 
                    <div className="d-flex align-items-center teams">
                        <div className="d-flex flex-column align-items-start ">
                            <div>
                            <Image
                                width={16}
                                height={16}
                                src={home.logo}
                                />
                            </div>
                            <div>
                            <Image
                                width={16}
                                height={16}
                                src={away.logo}
                                />
                            </div>
                        </div>
                        <div className="d-flex flex-column align-items-start teams-ct">
                            <Span className="text-light">Home Team</Span>
                            <Span className="text-light">Away Team</Span>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="d-flex flex-column align-items-start teams-ct">
                            <Span className="text-danger fw-bold">{goals.home}</Span>
                            <Span className="text-danger fw-bold">{goals.away}</Span>
                        </div>
                        <div className="d-flex flex-column align-items-start teams-ct">
                            <Span className="text-secondary fw-bold">({fulltime.home ?? goals.home})</Span>
                            <Span className="text-secondary fw-bold">({fulltime.away ?? goals.away})</Span>
                        </div>
                    </div>
                   
                    <StyleLiveIcon>
                        <Small className="bg-danger p-1 rounded">Live</Small>
                    </StyleLiveIcon>
                </div>
            </React.Fragment>
        )
    }
    return (
    <StyleLiveFixturesComponent>
        {live_fixtures?.length > 0 ? live_fixtures.map(LiveGamesElements) : <NoLiveGamesComponent/>}
    </StyleLiveFixturesComponent>
  
    )
}

const LiveGamesNavBar = () => {
    return (
        <nav className="p-3">
            <Link href="/live?fixture=all">
                <a
                    itemProp="url"
                    className="btn btn-secondary m-1"
                >   
                    All
                </a>
            </Link>
            <Link href="/live?fixture=live">
                <a
                    itemProp="url"
                    className="btn btn-secondary m-1"
                >   
                    Live
                </a>
            </Link>
            <Link href="/live?fixture=finished">
                <a
                    itemProp="url"
                    className="btn btn-secondary m-1"
                >   
                    Finished
                </a>
            </Link>
            <Link href="/live?fixture=scheduled">
                <a
                    itemProp="url"
                    className="btn btn-secondary m-1"
                >   
                    Schedule
                </a>
            </Link>
        </nav>
    )
}

const StlyeJackpotAdvert = styled.div`
`
const JackpotAdvert = () => {
    return (
        <StlyeJackpotAdvert className="card m-2 p-4 bg-info shadow ">
            <h1 className="text-white d-flex fw-bold mx-auto">
                Win upto KES 10,909,890.40 weekly on Mega Jackpot
            </h1>
        </StlyeJackpotAdvert>
    )
}

const NoLiveGamesComponent = () => {
    return (
        <div className="text-center mt-3">
            <span className="text-white">Please refresh or check again later!</span>
        </div>
    )
}