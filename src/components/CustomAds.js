import React from "react";
import { Card, Carousel } from "react-bootstrap";
import styled from "styled-components";

const StyleCustomAds = styled.div`
    background-color: #edebeb;
    padding: .5rem;
    h4 {
        padding: 0;
        margin: 0;
        color:  #191970;
        letter-spacing: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

`
export default function CustomAds() {
    return (
        <StyleCustomAds className="d-flex">
            <Card className="w-100 border-0 shadow p-1 pt-3 pb-3 bg-info">
                <Card.Body style={{ paddingBottom: 0, paddingTop: 0 }}>
                   <CarouselComponent/>
                </Card.Body>
            </Card>
        </StyleCustomAds>
    )
}

const CarouselComponent = () => {

    return (
         <Carousel controls={false} indicators={false}>
            <Carousel.Item 
                interval={2000} 
                className="card border-0 p-4 shadow" 
                style={{ backgroundImage: 'radial-gradient(#1affff,#0dcaf0)' }}
            >
                <h4 className="text-center fw-bold">MPESA PAYBILL:</h4>
                <h4 className="text-center fw-bold pt-2">4075207</h4>
            </Carousel.Item>    
            <Carousel.Item 
                interval={1500} 
                className="card border-0 p-4 shadow" 
                style={{  backgroundImage: 'radial-gradient(#1affff,#0dcaf0)' }}
            >
                <h4 className="text-center fw-bold">ACCOUNT NO: </h4>
                <h4 className="text-center fw-bold pt-2"> 07-XXX-XXX</h4>
            </Carousel.Item>
         </Carousel>
    )
}