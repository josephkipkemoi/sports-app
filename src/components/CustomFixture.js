import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import useCustomBetslip from "../hooks/customBetslip";
import { Small } from "./Html";
export default function CustomFixture({ data }) {
    const date = new Date(data.fixture_date)
    const [clicked, setClicked] = useState(false)
    const { postBetslip } = useCustomBetslip()

    const sendBetslip = async (e)  => {
        const homeTeam = e.target.getAttribute('home_team');
        const awayTeam =  e.target.getAttribute('away_team');
        const odds = e.target.getAttribute('odds');
        const market = e.target.getAttribute('market'); 
        const picked = e.target.getAttribute('picked');
        const fixtureId = e.target.getAttribute('fixtureid');
        const session_id = sessionStorage.getItem('session_id')
      
         postBetslip({
          fixture_id: fixtureId+session_id,
          session_id: session_id,
          betslip_teams: homeTeam + ' v ' + awayTeam,
          betslip_market: market,
          betslip_picked: picked,
          betslip_odds: odds 
        })
   
        setClicked(prev => !prev)
      }
    const displayMoreMarkets = (index) => {
        const elements = document.getElementsByClassName('more-market-cstm')[0]
        
         if( elements.style.display === 'none') {
          elements.style.display = 'block'
         } else {
        elements.style.display = 'none'
         }
      }
    
      useEffect(() => {

      }, [clicked])
    return (
        <React.Fragment>
        <Col lg={8} sm={8} className="custom-grid-box-main p-2">  
        
        <Row style={{ marginLeft: 2 }}>
        <h5 className='header'> <img src={data.flag} className="img-fluid" style={{ width : 16 }}/> {data.country} | {data.league_name}</h5>
        <div>
        <small style={{ marginRight: 5 }}>
          Bet ID: B360{data.fixture_id} |
        </small>
        <small style={{ marginRight: 5 }}>
          {date.toLocaleDateString('en-GB')}
        </small>
        <small>
          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </small>
        </div>
       
          <Col lg={1} md={1} sm={1} className="d-flex flex-column justify-content-between">
            
              <i className="bi bi-star" ></i>
              
              <Small onClick={() => displayMoreMarkets(data.id)}>
                {/* {data.unserialized_odds.bookmakers[0].bets.length} */}
                <i className="bi bi-arrow-right-short"></i>
              </Small>
              
          </Col>
          <Col>
            <span className='d-block'>{data.home} - </span>
            <span className='d-block'>{data.away}</span>
          </Col>
          <Col></Col>
        </Row>
               
      </Col>
      <Col lg={4} sm={4} className="d-flex">
               <div className='text-center mb-3 w-100'>
                 <span className='header text-center'>Home</span>  
                 <button 
                  odds={data.home_odds} 
                  className='btn-custom'
                  btn_id={'i'}
                  home_team={data.home} 
                  market={'odd.name'} 
                  away_team={data.away} 
                  picked={'val.value'}
                  fixtureid={data.fixture_id}
                  onClick={sendBetslip}  
                  >{data.home_odds}</button>                                     
               </div>
               <div className='text-center mb-3 w-100'>
                 <span className='header text-center'>Draw</span>  
                 <button 
                  odds={data.draw_odds} 
                  className='btn-custom'
                  btn_id={'i'}
                  home_team={data.home} 
                  market={'odd.name'} 
                  away_team={data.away} 
                  picked={'val.value'}
                  fixtureid={data.fixture_id}
                  onClick={sendBetslip}  
                  >{data.draw_odds}</button>                                     
               </div>
               <div className='text-center mb-3 w-100'>
                 <span className='header text-center'>Away</span>  
                 <button 
                  odds={data.away_odds} 
                  className='btn-custom'
                  btn_id={'i'}
                  home_team={data.home} 
                  market={'odd.name'} 
                  away_team={data.away} 
                  picked={'val.value'}
                  fixtureid={data.fixture_id}
                  onClick={sendBetslip}  
                  >{data.away_odds}</button>                                     
               </div>
  
      </Col>
      <div className='more-market-cstm' style={{ display: 'none' }}>
        <h1>More</h1>
        {/* {data.unserialized_odds.bookmakers[0].bets.map(MoreFixtureMarket)} */}
      </div>
        <hr/>
      
    </React.Fragment>
    )
}