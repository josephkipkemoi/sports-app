import React from "react";
import { Card, Carousel } from "react-bootstrap";
import styled from "styled-components";
import Image from "next/image";

const StyleCustomAds = styled.div`
    background-color: #edebeb;
    h4 {
        padding: 0;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

`
export default function CustomAds() {
    return (
        <StyleCustomAds className="d-flex bg-light">
            <Card className="w-100 border-0 bg-light m-1 rounded">
                <Card.Body className="rounded" style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
                   <CarouselComponent/>
                </Card.Body>
            </Card>
        </StyleCustomAds>
    )
}

const CarouselComponent = () => {

    return (
         <Carousel controls={false} indicators={false} className="m-2 rounded">
            <Carousel.Item 
                interval={2000} 
                className="card border-0 shadow p-1 d-flex align-items-center rounded" 
                style={{ backgroundColor: '#fff' }}
            >
                <Image width={75} height={75} src="https://www.pinaclebet.com/mpesa.jpeg" />
                {/* <h4 className="text-center fw-bold" style={{ fontSize: '24px', color: '#fff' }}>
                    MPESA PAYBILL
                </h4> */}
                <h4 className="text-center fw-bold p-2 m-1 w-100 rounded" style={{ fontSize: '16px', color: '#fff', backgroundColor: 'green' }}>
                   Account No 07-XXX-XXX
                </h4>
            </Carousel.Item>    
            <Carousel.Item 
                interval={1500} 
                className="card border-0 shadow p-1 d-flex align-items-center rounded" 
            >
                <Image width={75} height={75} src="https://www.pinaclebet.com/mpesa.jpeg" />
                <h4 className="text-center fw-bold p-2 m-1 w-100 rounded" style={{ fontSize: '16px', color: '#fff', backgroundColor: 'green' }}>                  
                   Paybill 4075207
                </h4>
            </Carousel.Item>
         </Carousel>
    )
}