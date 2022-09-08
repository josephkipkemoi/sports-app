import React from "react";
import { Card, Carousel } from "react-bootstrap";
import styled from "styled-components";

const StyleCustomAds = styled.div`
    background-color: #edebeb;
    padding: .5rem;
    h4 {
        padding: 0;
        margin: 0;
        color: #191970;
        letter-spacing: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`
export default function CustomAds() {
    return (
        <StyleCustomAds className="d-flex">
            <Card className="w-100 border-0 shadow-sm p-3" style={{ backgroundImage: 'linear-gradient(to bottom right,#1affff, #fff)' }}>
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
            <Carousel.Item interval={1500}>
                <h4 className="text-center">MPESA PAYBILL: 4075207</h4>
            </Carousel.Item>    
            <Carousel.Item interval={1500}>
                <h4 className="text-center">ACCOUNT NO: 07-XXX-XXX</h4>
            </Carousel.Item>
         </Carousel>
    )
}