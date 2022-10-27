import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Small } from "./Html";
import axios from '../lib/axios';
import styled from "styled-components";
import AuthUser from "../hooks/AuthUser";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import  Spinner  from "react-bootstrap/Spinner";
import { useGetV1CustomFixtureQuery } from "../hooks/fixture";
import { CustomSpinner } from "./HtmlElements";
import Pagination from '../components/Pagination';

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
const StyleGameComponent = styled.div`
  small {
    // color: #001041;
    font-weight: 700;
    opacity: .8;
  }
  span {
    // color: #001041;
  }
  button {
    align-items: center;
    background: linear-gradient(-45deg, #00FFFF, #F0F8FF);
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.15),
    -2px -2px 3px 0 rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    border: 0;
    display: flex;  
    justify-content: center; 
    letter-spacing: 1px;
  }
`
export default function GameComponent({ displayMode }) {
    const [id, setId] = useState([])
    const fixIds = [...new Set(id)]
    const { uu_id } = AuthUser()
    const router = useRouter()
   
   

    const fetchSharedFixtureIds =  () => {
      const shareCode = sessionStorage.getItem('share_code')
    
      const loadIds = async () => {
        if(shareCode) {
          const data = await axios.get(`api/social-share/codes/show?share_code=${shareCode}`)
            
        if(data?.data ) {
            const sharedIds = data.data.codes.map((c,i) => {
              const betslips =  JSON.parse(data.data.betslips)
              sessionStorage.setItem(JSON.parse(betslips[i]).fixture_id, betslips[i])
              return c
            })

            setId(prev => prev.concat(sharedIds))
            router.push('?sp=act')
        }
          
        }
      }
      setTimeout( loadIds, 500)
      clearTimeout(loadIds)
    }
    
    const updateFixtureIds =  () => {   
      const fixtureIds = JSON.parse(sessionStorage.getItem('fixture_ids'))
    
      if(fixtureIds?.length > 0) {   
        setId(prev => prev.concat(fixtureIds))
      } else {
        fetchSharedFixtureIds()
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
                <div className='d-sm-flex m-1 mt-3 mb-3 btn-sm text-white text-center' style={{ width: '30%', padding: 0, margin: 0}}>               
                  <span 
                    className={`w-100 flex-wrap p-2 ${displayMode === 'light-mode' && 'text-dark'} `}
                    id="fix-btn"
                    odds={odds.odd} 
                    market_id={i} 
                    picked={odds.value}
                    onClick={(e) => sendBetslip(e,odds.odd,i,odds.value)}  
                    style={{ background: 'none', border: 'none' }}
                  >
                    {odds.value}                 
                  </span>
                  <button 
                     className={`w-100 flex-wrap p-2 ${displayMode === 'light-mode' && 'text-dark'} `} 
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
                className
                ={`w-100 p-2 fw-bold d-flex flex-row align-items-center rounded
                 ${displayMode === 'dark-mode' && 'bg-secondary'}
                `}
                style={{ lineHeight: '30px', backgroundColor: '#fff' }}
              >
                <i className="bi bi-star-fill"></i>
                <small className=' mt-1' style={{ marginLeft: 10, letterSpacing: 2 }}>{name.name}</small>
              </div>
              <div className='d-flex justify-content-between flex-wrap'>
                {name.values.map(OddsMarket)}   
                {name.values.length % 3 !== 0 &&  
                <button disabled className="btn btn-light m-1" style={{ width: '30%', padding: 0, margin: 0}}>
                  <FontAwesomeIcon icon={faLock} />
                </button>}            
              </div>   
        </React.Fragment> 
      )
    }


    const removeSingleFavorite = async (fixture_id) => {
      const { status } = await axios.delete(`api/users/${uu_id.id}/favorites/${fixture_id}/remove`)
      
     
    }


    const updateFavorite = async (fixture_id, favorite_active) => {
      if(Boolean(uu_id) === false) {
        alert("Log in to add favorites")
      }
      
      if(favorite_active) {
       return removeSingleFavorite(fixture_id)
      }

      const { status } = await axios.post('api/favorites', {
        user_id: uu_id.id,
        fixture_id
      });
     

    }  

    const activatBtn = (index,i) => {

      const clickedBtn = document.getElementsByClassName('active-btn')[index]

      const btn = clickedBtn.getElementsByClassName('active-btn-btn')

      for(let i = 0; i < btn.length; i++) {
            btn[i].classList.remove('active')
      }

      btn[i].classList.add('active')
    }

    const [pageNumber, setPageNumber] = useState(1)
    const { data, isLoading, error } = useGetV1CustomFixtureQuery(pageNumber)

    if(error) {
      return <span>Error</span>
    }
    
    useEffect(() => {
      updateFixtureIds()
    }, [])

    if(isLoading) {       
      return <div className="d-flex justify-content-center mt-5 pt-5 mb-5 pb-5">
        <CustomSpinner/>
      </div> 
    }
 
    const sendBetslip = (e)  => {
  
      const homeTeam = e.target.getAttribute('home_team') || localStorage.getItem('home_team');
      const awayTeam =  e.target.getAttribute('away_team') || localStorage.getItem('away_team');
      const odds = e.target.getAttribute('odds');
      const picked = e.target.getAttribute('picked');
      const fixtureId = Number(e.target.getAttribute('fixtureid')) || Number(localStorage.getItem('fixture_id'));
      const session_id = sessionStorage.getItem('session_id')
      const market_id = e.target.getAttribute('market_id')
      
      if(market_id) {
        const fixture = data.data.filter(g => g.fixture_id == fixtureId)
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

    return (
      <StyleGameComponent className={`${displayMode === 'dark-mode' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
         <Row className="custom-grid" style={{ margin: 0 }}>   
        {data.data.map((innerData,index) => {
          const oddsData = JSON.parse(innerData.odds) 
          return (
            <React.Fragment key={index + innerData.fixture_date}>
            <Col 
            lg={8} 
            sm={8} 
            className={`card p-2 ${displayMode === 'dark-mode' ? 'bg-dark text-white' : 'bg-white text-dark'}`}
            style={{ borderRight: '0px', border: 'none', marginTop: 0, paddingTop: 0, marginBottom: 0 }}
            >  
      
              <Row style={{ marginLeft: 2, margin: 0   }} className="d-flex align-items-center">
              <h6 className=' text-mute' style={{ letterSpacing: '1px' }}> 
                {innerData.flag ?
                    <img 
                    src={innerData.flag} 
                    className="img-fluid"                 
                    style={{ width : 16, marginRight: 5}}
                  /> 
                : ''}               
                 <span className="header-span">{innerData.country} | {innerData.league_name}</span> 
              </h6>
              <div>
              <small style={{ marginRight: 5, lineHeight: '30px', letterSpacing: '1px' }}>
                Bet ID: P3{innerData.fixture_id} 
              </small>
           
              </div>
                  <Row>
                    <Col className='d-inline-flex'>
                      <StyleFavorites>
                        <i 
                          className={`bi bi-star-fill ${innerData.favorite_active ? 'text-warning' : 'text-secondary'}`}
                          onClick={() => updateFavorite(innerData.fixture_id, innerData.favorite_active)}                      
                        ></i>
                      </StyleFavorites>
                    
                      <div style={{ marginTop: 2.5, marginLeft: 10 }}>
                        <span style={{ letterSpacing : '1px', fontWeight: 500  }}>{innerData.home}</span>
                        <i className="bi bi-dash"></i>
                        <span style={{ letterSpacing : '1px', fontWeight: 500  }}>{innerData.away}</span>
                      </div>                    
                    </Col>
                  </Row>                 
              </Row>                     
            </Col>
            <Col 
              lg={4} 
              sm={4} 
              className=
              {`card d-flex flex-row active-btn 
              ${displayMode === 'dark-mode' ? 'bg-dark text-white' : 'bg-light text-dark'}`}
              style={{ background: '#F0F8FF', borderLeft: '0px', border: 'none' }}
            >
               
              {oddsData?.map((odd) => {         
   
                return odd.id === 1 && odd.values.map((val, i) => {
                  return (
                     <div key={i} className='text-center mb-3 w-100 m-1 '>
                        <small className=' text-center'>{val.value}</small>  
                        <div onClick={() => activatBtn(index,i)}>                        
                          <button 
                            odds={val.odd} 
                            className='btn btn-sm w-100 active-btn-btn p-2 text-dark '
                            id="fix-btn"
                            btn_id={i}
                            home_team={innerData.home} 
                            market={odd.name} 
                            away_team={innerData.away} 
                            picked={val.value}
                            fixtureid={innerData.fixture_id}
                            onClick={sendBetslip}  
                            disabled={!innerData.fixture_active}
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
                  className="text-secondary fw-bold d-flex flex-column mt-3 p-2"                    
                >
                    <i className="bi bi-plus d-flex align-items-center" style={{ height: 20, marginTop: '2px' }}>
                    {oddsData?.length || 42} 
                    </i>    
                    <i className="bi bi-caret-down-fill" style={{ marginTop: '-7px' }}></i>    
                     
                </Small>
               
              </div>
               
            </Col>
            <div className='more-market ' style={{ display: 'none' }}>
              <hr className='text-light'/>
              <div 
              className=
              {`fw-bold text-center p-2 rounded
              ${displayMode === 'dark-mode' ? 'bg-dark text-white' : 'bg-light text-dark'}
              `} 
              style={{ letterSpacing: 2 }}
              >
                <span>More Markets</span>
              </div>
              {oddsData?.map(MoreFixtureMarket)}
            </div>            
          </React.Fragment>
          )
          
        })}
        
        <Pagination 
          data={data}
          setPageNumber={setPageNumber}
         />

      </Row>
      </StyleGameComponent>     
    )
}

 