import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Small } from "./Html";
import axios from '../lib/axios';
import useAuth from "../hooks/auth";
import styled from "styled-components";

const StyleFavorites = styled.i`
  i {
    opacity: .8;
    padding-top: 6px;
    padding-bottom: 6px;
    transition: .3s;
  }
  i:hover {
    cursor: pointer;
    opacity: 1;
  }
`

export default function GameComponent({ data, refetch }) {
    const [id, setId] = useState([])
    const fixIds = [...new Set(id)]
    const { user } = useAuth({ middleware: 'guest' })

    const sendBetslip = (e)  => {
  
      const homeTeam = e.target.getAttribute('home_team') || localStorage.getItem('home_team');
      const awayTeam =  e.target.getAttribute('away_team') || localStorage.getItem('away_team');
      const odds = e.target.getAttribute('odds');
      const picked = e.target.getAttribute('picked');
      const fixtureId = Number(e.target.getAttribute('fixtureid')) || Number(localStorage.getItem('fixture_id'));
      const session_id = sessionStorage.getItem('session_id')
      const market_id = e.target.getAttribute('market_id')
      
      if(market_id) {
        const fixture = data.filter(g => g.fixture_id == fixtureId)
        let more_market = JSON.parse(fixture[0].odds)[market_id].name
        localStorage.setItem('more_market', more_market)
      }   

      const market = e.target.getAttribute('market') || localStorage.getItem('more_market'); 

      const cart = {
        fixture_id: fixtureId,
        session_id: session_id,
        betslip_teams: homeTeam + ' v ' + awayTeam,
        betslip_market: market,
        betslip_picked: picked,
        betslip_odds: odds 
      }
      
      sessionStorage.setItem(fixtureId, JSON.stringify(cart))

      setId(prev => prev.concat(fixtureId))

    }
    
    const updateFixtureIds = () => {   
      const fixtureIds = JSON.parse(sessionStorage.getItem('fixture_ids'))
      if(fixtureIds?.length > 0) {   
        setId(prev => prev.concat(fixtureIds))
      } else {
        sessionStorage.setItem('fixture_ids', JSON.stringify(fixIds))
      }
  
    }
    
    if(fixIds?.length > 0) {
      sessionStorage.setItem('fixture_ids', JSON.stringify(fixIds))
    }

    const displayMoreMarkets = (index, home, away, fixture_id) => {

      localStorage.setItem('home_team', home)
      localStorage.setItem('away_team', away)
      localStorage.setItem('fixture_id', fixture_id)
  
      const elements = document.getElementsByClassName('more-market')[index]
 
       if( elements.style.display === 'none') {
        elements.style.display = 'block'

      } else {
        elements.style.display = 'none'

      }

    }
 
    const MoreFixtureMarket = (name, i) => {

      const OddsMarket = (odds, ii) => {        
        return (
          <React.Fragment key={ii+i+odds.odd}>         
                <div className='d-sm-flex m-1 btn btn-success btn-sm' style={{ width: '30%', padding: 0, margin: 0}}>               
                  <button 
                    className=' text-white w-100 flex-wrap p-2'   
                    id="fix-btn"
                    odds={odds.odd} 
                    market_id={i} 
                    picked={odds.value}
                    onClick={(e) => sendBetslip(e,odds.odd,i,odds.value)}  
                    style={{ background: 'none', border: 'none' }}
                  >
                    {odds.value}                 
                  </button>
                  <button 
                     className=' text-white w-100 flex-wrap p-2'   
                     id="fix-btn"
                     odds={odds.odd} 
                     market_id={i} 
                     picked={odds.value}
                     onClick={(e) => sendBetslip(e,odds.odd,i,odds.value)}  
                     style={{ background: 'none', border: 'none' }}
                  >
                    {odds.odd} 
                  </button>
                </div>   
          </React.Fragment>
        )
      }

      return ( 
        <React.Fragment key={i+name.name}>
              <div 
                className='text-light w-100 p-2 fw-bold d-flex flex-row align-items-center'
                style={{ lineHeight: '30px', backgroundColor: '#424242' }}
              >
                <i className="bi bi-star-fill"></i>
                <small className='text-white mt-1' style={{ marginLeft: 10, letterSpacing: 2 }}>{name.name}</small>
              </div>
              <div className='d-flex justify-content-between flex-wrap'>
                {name.values.map(OddsMarket)}
              </div>   
        </React.Fragment>
      )
    }


    const removeSingleFavorite = async (fixture_id) => {
      const { status } = await axios.delete(`api/users/${user.data.id}/favorites/${fixture_id}/remove`)
      
      if(status === 200) {
          refetch()
      }
    }


    const updateFavorite = async (fixture_id, favorite_active) => {
      if(Boolean(user.data) === false) {
        alert("Log in to add favorites")
      }
      
      if(favorite_active) {
       return removeSingleFavorite(fixture_id)
      }

      const { status } = await axios.post('api/favorites', {
        user_id: user.data.id,
        fixture_id
      });
     
      if(status === 201) {
         refetch()
      }

    }  

    const activatBtn = (index,i) => {

      const clickedBtn = document.getElementsByClassName('active-btn')[index]

      const btn = clickedBtn.getElementsByClassName('active-btn-btn')

      for(let i = 0; i < btn.length; i++) {
            btn[i].classList.remove('active')
      }

      btn[i].classList.add('active')
    }

    useEffect(() => {
      updateFixtureIds()
    }, [])
 
    return (
      <Row  className="custom-grid p-2">  
        {data.map((innerData,index) => {
          const oddsData = JSON.parse(innerData.odds)
 
          return (
            <React.Fragment key={index + innerData.fixture_date}>
            <Col 
            lg={8} 
            sm={8} 
            className="card custom-grid-box-main p-2 text-white" 
            style={{ borderRight: '0px', border: 'none', background: 'none' }}
            >  
      
              <Row style={{ marginLeft: 2 }}>
              <h6 className='header text-mute' style={{ letterSpacing: '1px' }}> 
                {innerData.flag ?
                    <img 
                    src={innerData.flag} 
                    className="img-fluid"                 
                    style={{ width : 16, marginRight: 5}}
                  /> 
                : ''}
               
                  {innerData.country} | {innerData.league_name}
              </h6>
              <div>
              <small style={{ marginRight: 5, lineHeight: '30px', letterSpacing: '1px' }}>
                Bet ID: B360{innerData.fixture_id} 
              </small>
           
              </div>

                  <Row>
                    <Col className='d-inline-flex'>
                      <StyleFavorites>
                        <i 
                          className={`bi bi-star-fill ${innerData.favorite_active ? 'text-warning' : 'text-white'}`}
                          onClick={() => updateFavorite(innerData.fixture_id, innerData.favorite_active)}                      
                        ></i>
                      </StyleFavorites>
                    
                      <div style={{ marginTop: 2.5, marginLeft: 10 }}>
                        <span style={{ letterSpacing : '1px', color: '#ffffff', fontWeight: 500  }}>{innerData.home}</span>
                        <i className="bi bi-dash"></i>
                        <span style={{ letterSpacing : '1px', color: '#ffffff', fontWeight: 500  }}>{innerData.away}</span>
                      </div>                    
                    </Col>
                  </Row>
                 
              </Row>
                     
            </Col>
            <Col lg={4} sm={4} className="card d-flex flex-row  active-btn" style={{ background: '#424242', borderLeft: '0px', border: 'none' }}>
          
              {oddsData.map((odd) => {             
                return odd.id === 1 && odd.values.map((val, i) => {
                  return (
                     <div key={i} className='text-center mb-3 w-100 m-1'>
                        <small className='header text-center text-white'>{val.value}</small>  
                        <div onClick={() => activatBtn(index,i)}>                        
                          <button 
                            odds={val.odd} 
                            className='btn btn-success btn-sm w-100 text-white active-btn-btn p-2'
                            id="fix-btn"
                            btn_id={i}
                            home_team={innerData.home} 
                            market={odd.name} 
                            away_team={innerData.away} 
                            picked={val.value}
                            fixtureid={innerData.fixture_id}
                            onClick={sendBetslip}  
                          >
                            {val.odd}
                          </button>   
                        </div>                     
                     </div>
                   )
                 })
              })}

              <div className='text-center'>

                <Small 
                  onClick={() => displayMoreMarkets(index, innerData.home, innerData.away, innerData.fixture_id)}
                  className="text-warning fw-bold d-flex flex-column mt-3 p-2" 
                   
                >
                    <i className="bi bi-plus d-flex align-items-center" style={{ height: 20, marginTop: '2px' }}>
                    {oddsData.length} 
                    </i>    
                    <i className="bi bi-caret-down-fill" style={{ marginTop: '-7px' }}></i>    
                     
                </Small>
               
              </div>
               
            </Col>
            <div className='more-market' style={{ display: 'none' }}>
              <hr className='text-secondary'/>
              <div className='fw-bold text-center text-white bg-success p-2 rounded' style={{ letterSpacing: 2 }}>
                <span >More Markets</span>
              </div>
              {oddsData.map(MoreFixtureMarket)}
            </div>

            <hr className='text-secondary'/>
            
          </React.Fragment>
          )
          
        })}

      </Row>
    )
}