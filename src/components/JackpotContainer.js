import { faSoccerBall, faTrophy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Row, Spinner } from 'react-bootstrap'
import { useGetJackpotFixturesQuery } from '../hooks/admin'
import { useGetJackpotPrizeWinsQuery } from '../hooks/jackpot'
import BetslipContainer from './BetslipContainer'

export default function JackpotContainer() {
    const [megaJackpotId, setMegaJackpotId] = useState([])
    const [fiveJackpotId, setFiveJackpotId] = useState([])

    const [market, setMarket] = useState('')

    const megaJackpotData = useGetJackpotFixturesQuery('Mega Jackpot')
    const fiveJackpotData = useGetJackpotFixturesQuery('Five Jackpot')
    const jackpotPrize = useGetJackpotPrizeWinsQuery()
 
    const fetchJackpotGames = () => {
        const megaJackpotIds = JSON.parse(sessionStorage.getItem('Mega Jackpot'))
        const fiveJackpotIds = JSON.parse(sessionStorage.getItem('Five Jackpot'))

        if(megaJackpotIds) {
            setMegaJackpotId(megaJackpotIds)
        }   
        if(fiveJackpotIds) {
            setFiveJackpotId(fiveJackpotIds)
        }
    }

    useEffect(() => {

        fetchJackpotGames()

    }, [])

    if (
        megaJackpotData.isLoading || 
        fiveJackpotData.isLoading || 
        jackpotPrize.isLoading
        ) {
       return <Spinner animation="grow"/>
    }

    if  (
        megaJackpotData.error || 
        fiveJackpotData.error || 
        jackpotPrize.error
        ) {
       return <span>Try again later!</span>
    }

    const { data, MegaCount, FiveCount } = jackpotPrize.data
    const [ megaMarket, fiveMarket ] = data

    return (
        <div className='bg-dark'>
            {megaJackpotData.length > 0 && 
              <div >
              <h1 className='text-dark text-center'>Mega Jackpot</h1>
              <JackpotElements
                  data={megaJackpotData.data}
                  setMegaJackpotId={setMegaJackpotId}
                  setMarket={setMarket}
                  jackpot={megaMarket?.market}
                  jackpot_prize={megaMarket?.jackpot_prize}
                  games_count={MegaCount}
              />
          </div>
            }
          {fiveJackpotData.length > 0 && 
           <div>
            <h1 className='text-dark text-center'>Five Jackpot</h1>
            <JackpotElements
                data={fiveJackpotData.data}
                setMegaJackpotId={setMegaJackpotId}
                setMarket={setMarket}
                jackpot={megaMarket?.market}
                jackpot_prize={megaMarket?.jackpot_prize}
                games_count={MegaCount}
            />
            </div>
          }
           
               <BetslipContainer 
                    megaJackpotId={megaJackpotId} 
                    fiveJackpotId={fiveJackpotId}
                    setMegaJackpotId={setMegaJackpotId}
                    setFiveJackpotId={setFiveJackpotId}
                    market={market}
                /> 
        </div>
    )
}

const JackpotElements = ({ data, setMegaJackpotId, setFiveJackpotId, jackpot, games_count, jackpot_prize, setMarket }) => {
    const JackpotItems = (n, i) => {

        const handleData = (e, btnIndex) => {
            const id = e.target.getAttribute('id')
            const home = e.target.getAttribute('home')
            const away = e.target.getAttribute('away')
            const picked = e.target.getAttribute('picked')
            const market = e.target.getAttribute('market')
            const divs = document.getElementsByClassName('mjp_btn_div')[i]
            const btn = divs.getElementsByClassName('jp_btn')
 
            for(let i = 0; i < btn.length; i++) {
                btn[i].classList.remove('active')
            }
    
            btn[btnIndex].classList.add('active')

            const jData = {
                home,
                away,
                picked,
                market,
                id: i+1,
                sessionId: i
            }
 
            sessionStorage.setItem(id+market, JSON.stringify(jData))

            if(market === 'Mega Jackpot') {
                setMegaJackpotId(prev => prev.concat(id))
                setMarket(market)

            }

            if(market === 'Five Jackpot') {
                setFiveJackpotId(prev => prev.concat(id))
                setMarket(market)
            }
        
        }
 
        return (
            <div key={i} className="d-flex justify-content-between shadow-sm mb-3">
                <div className="col-lg-9 col-md-9 col-sm-9 d-flex align-items-center text-dark">
                    <span className="text-dark">{i+1}</span>
                    <div style={{ marginLeft: 20 }}>
                        <small className="text-dark">{n.jp_time}</small>
                        <span className="text-dark">{n.jp_home}</span>
                        <span className="text-dark">{n.jp_away}</span>
                    </div>
                </div>
                <div 
                    className={`col-lg-3 col-md-3 col-sm-3 d-flex mjp_btn_div`}
                >
                    <button 
                        className={`btn btn-success m-1 w-100 ${n.jp_market === 'Mega Jackpot' ? 'jp_btn' : 'fjp_btn'} `}
                        style={{ width: '80px' }}
                        home={n.jp_home}
                        away={n.jp_away}
                        id={i}
                        market={n.jp_market}
                        j_click="jp"
                        picked={n.jp_home}
                        onClick={(e) => handleData(e,0)}
                        disabled={!n.jp_active}
                    >
                        {!n.jp_active ?  <i className="bi bi-exclamation-circle"></i> : n.jp_home_odds}                       
                    </button>
                    <button 
                        className="btn btn-success m-1 w-100 jp_btn" 
                        style={{ width: '80px' }}
                        home={n.jp_home}
                        j_click="jp"
                        away={n.jp_away}
                        id={i}
                        market={n.jp_market}
                        picked="Draw"
                        onClick={(e) => handleData(e,1)}
                        disabled={!n.jp_active}
                    >
                        {!n.jp_active ?  <i className="bi bi-exclamation-circle"></i> : n.jp_draw_odds}
                    </button>
                    <button 
                        className="btn btn-success m-1 w-100 jp_btn" 
                        style={{ width: '80px' }}
                        j_click="jp"
                        home={n.jp_home}
                        away={n.jp_away}
                        id={i}
                        market={n.jp_market}
                        picked={n.jp_away}
                        onClick={(e) => handleData(e,2)}
                        disabled={!n.jp_active}
                    >
                        {!n.jp_active ?  <i className="bi bi-exclamation-circle"></i> : n.jp_away_odds}
                    </button>
                </div>
            </div>
        )
    }
    return (
        <>
          {data.length > 0 ? 
            <Row className="p-3" style={{ padding: 0, margin: 0 }}>              
            <div 
            className="d-flex align-items-center justify-content-between text-dark p-3 bg-dark rounded shadow-sm mb-3"
            >
                <button style={{ margin: 0, padding: 0, background: 'none', border: 'none' }}>
                    <FontAwesomeIcon icon={faSoccerBall} className="text-dark"/>
                </button>
                <div className="d-flex align-items-center">
                    <span className="fw-bold" >{jackpot}</span>
                    <span className="text-warning" style={{ marginRight: 10, marginLeft: 10 }}>
                        KSH {(Number(jackpot_prize)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                    <span>{games_count} Games</span>
                </div>
                <button style={{ margin: 0, padding: 0, background: 'none', border: 'none' }}>
                    <i className="bi bi-printer"  style={{ color: '#ffffff' }}></i>                
                </button>
            </div>
            <div className="col-lg-9 col-md-9 col-sm-9"></div>
            <div className="col-lg-3 col-md-3 col-sm-3">
                <div className="d-flex justify-content-between text-dark text-center">
                    <span className=" w-100" style={{ width: '80px' }}>Home</span>
                    <span className=" w-100" style={{ width: '80px' }}>Draw</span>
                    <span className=" w-100" style={{ width: '80px' }}>Away</span>
                </div>
            </div>
            {data.map(JackpotItems)}
        </Row>
          : <NoJackpotAvailable/>}
    
        </>          
    )
}

const NoJackpotAvailable = () => {
    return (
        <div className="text-center mt-5 text-dark p-5 ">
            <FontAwesomeIcon icon={faTrophy} size="10x" className="text-success"/>
            <h4 className="mt-3">Coming Soon!</h4>
        </div>
    )
}