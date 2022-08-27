import React from "react";
import  Card  from "react-bootstrap/Card";
import styled from "styled-components";
import { Span, Small } from "./Html";
import Pagination from "./Pagination";

const StyleJackpotContainer = styled.div`
    overflow: hidden;
`
export default function JackpotComponent({ data }) {
    const openJackpotGames = (index) => {
        const jackpotDivs = document.getElementsByClassName('jp')[index]
        const cards = jackpotDivs.getElementsByClassName('jp-container')[0]

        if(cards.style.height === 'auto') {
            cards.style.height = 0
        } else {
            cards.style.height = 'auto'
        }
    }

    const JackpotElements = (n, i) => {
        const jData = JSON.parse(n.jp_picked)
       
        const JackpotElementContainer = (d, ii) => {
            const el =JSON.parse(d)     
            return (
                <React.Fragment key={ii}>
                <span className='d-block'>{ii+1}. Teams: {el.home} - {el.away}</span>
                <div className='d-flex justify-content-between'>
                    <span>Picked: {el.picked}</span>
                    <span>Status: pending</span>
                </div>
                <hr/>
                </React.Fragment>
            )
        }
        return (
            <Card key={i} className="mb-3 border-0 jp shadow">
                <Card.Header className='bg-success d-flex justify-content-between'>
                    <div className='d-flex flex-column'>
                        <Span className='text-white'>{n.jp_market}</Span>
                        <Span className='text-white'>No. of Games: <b className='fw-bold'>{jData.length}</b> </Span>
                    </div>
                    <Span className='text-white'>Outcome: Pending</Span>
                </Card.Header>
                <Card.Body>
                    <div className='d-flex justify-content-between'>
                        <button 
                            className='d-flex align-items-center btn btn-success btn-sm'
                            onClick={() => openJackpotGames(i)}
                        >
                            <i className={`bi bi-eye jp-eye`} style={{ marginRight: 6 }}></i>
                            <Small>View Games</Small> 
                        </button>
                        <button className='d-flex align-items-center btn  btn-sm'>
                            <i className="bi bi-trash" style={{ marginRight: 6 }}></i>
                            <Small className='text-dark'>Delete</Small>
                        </button>
                    </div>
                    
                    <StyleJackpotContainer className='jp-container' style={{ height: "0" }}>
                        <hr className='text-secondary'/>
                        {jData.map(JackpotElementContainer)}
                    </StyleJackpotContainer>
                </Card.Body>
            </Card>
        )
    }
    return (
        <>
          {data.data.map(JackpotElements)}
          <Pagination data={data}/>
        </>
    )
}