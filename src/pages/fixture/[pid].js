import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Row  from "react-bootstrap/Row";
import Col  from "react-bootstrap/Col";
import { Betslip } from "..";
import styled from "styled-components";
import Link from "next/link";
import { useGetV1CustomFixtureByIdQuery } from "../../hooks/fixture";

import  Spinner  from "react-bootstrap/Spinner";
import useCustomBetslip from "../../hooks/customBetslip";

const StlyedFixture = styled.div`
background-color: #404040;
height: 100vh;
`
const Fixture = () => {
    const router = useRouter();
    const { pid, home, away } = router.query
    const homeTeam = home
    const awayTeam = away
    const { postBetslip } = useCustomBetslip()
    const { data , error, isLoading} = useGetV1CustomFixtureByIdQuery(pid)
 
    if(error) {
        return <span>Error</span>
    }

    if(isLoading) {
        return <Spinner animation="grow" size="lg"></Spinner>
    }

    const sendBetslip = async (e) => {
      const odds = e.target.getAttribute('odds');
      const market = e.target.getAttribute('market'); 
      const picked = e.target.getAttribute('picked');
      const session_id = sessionStorage.getItem('session_id')
 
      const res = await  postBetslip({
            fixture_id: pid+session_id,
            session_id: session_id,
            betslip_teams: homeTeam + ' v ' + awayTeam,
            betslip_market: market,
            betslip_picked: picked,
            betslip_odds: odds
          })
         if(res === 200)
         {
            window.location.reload()
         }
    }
    const OddsMarket = (link, i) => {
     
        const Bets = (links, ii) => {
            const Values = (d,e) => {
               return <React.Fragment key={e}>    
                <button 
               className="d-sm-flex justify-content-between btn btn-secondary btn-sm p-3"
               style={{ width: '33%', marginBottom: '2px' }}
               market={links.name}
               picked={d.value}
               odds={d.odd} 
               onClick={sendBetslip}
               >     
          
                   <span 
                   className="d-block"   
                   market={links.name}  
                   odds={d.odd} 
                   picked={d.value}
                   onClick={sendBetslip}>{d.value}</span>
                   <span 
                   className="d-block"   
                   market={links.name}  
                   odds={d.odd} 
                   picked={d.value}
                   onClick={sendBetslip}> {d.odd}</span>        
               </button>   

                </React.Fragment>
            }
            return (
                <React.Fragment key={ii}>                                 
                    <h6 className="text-light ">{links.name}</h6>
                    <div className="d-flex flex-wrap justify-content-between ">
                        {links.values.map(Values)}                        
                    </div>                   
                </React.Fragment>
            )
        }

        return (
            <React.Fragment key={i} > 
                {link.bookmakers[0].bets.map(Bets)}
            </React.Fragment>
        )
    }

    return (
        <StlyedFixture>
            <Row>
                <Col style={{ maxHeight: '100vh', overflowY: 'scroll' }}>
                    <div className="p-4">
                    <Link href="/">
                        <a
                            itemProp="url"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-left-circle text-light fw-bold" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                            </svg>
                        </a>
                    </Link>
                    </div>
                    <div className="p-4">
                        <h4 className="text-light fw-bold p-2 text-center">{homeTeam} - {awayTeam}</h4> 
                        {console.log((data.data))}
                        {/* {data.response.map(OddsMarket)}      */}
                    </div>
                         
                </Col>
                <Col lg={4} sm={4}>
                    <Betslip/>
                </Col>
            
            </Row>
        </StlyedFixture>      
    )
}

export default Fixture;