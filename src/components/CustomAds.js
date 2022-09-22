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
        <StyleCustomAds className="d-flex">
            <Card className="w-100 border-0 bg-info">
                <Card.Body style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0 }}>
                   <CarouselComponent/>
                </Card.Body>
            </Card>
        </StyleCustomAds>
    )
}

const CarouselComponent = () => {

    return (
         <Carousel controls={false} indicators={false}  >
            <Carousel.Item 
                interval={2000} 
                className="card border-0 shadow p-3" 
                style={{ backgroundColor: '#3aa335' }}
            >
                {/* <Image width={220} height={40} src="https://www.pinaclebet.com/mpesa.svg" /> */}
                <h4 className="text-center fw-bold" style={{ fontSize: '24px', color: '#fff' }}>
                    MPESA PAYBILL
                </h4>
                <h4 className="text-center fw-bold pt-2" style={{ fontSize: '32px', color: '#fff' }}>
                    4075207
                </h4>
            </Carousel.Item>    
            <Carousel.Item 
                interval={1500} 
                className="card border-0 shadow p-3" 
                style={{ backgroundImage: 'linear-gradient(#3aa335,#3aa335)'  }}
            >
                <h4 className="text-center fw-bold" style={{ fontSize: '24px', color: '#fff' }}>
                    ACCOUNT NO 
                </h4>
                <h4 className="text-center fw-bold pt-2" style={{ fontSize: '32px', color: '#fff'}}> 
                    07-XXX-XXX
                </h4>
            </Carousel.Item>
         </Carousel>
    )
}