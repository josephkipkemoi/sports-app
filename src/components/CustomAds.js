import React from "react";
import { Card, Carousel } from "react-bootstrap";
import styled from "styled-components";
import Image from "next/image";
import config from '../../config.json';

const StyleCustomAds = styled.div`
    background-color: #fff;  
    h4 {
        padding: 0;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: 1px;
        font-size: 1.3rem;
    }
.custom-card {
    max-width: 70%;
    height: 100px;
    align-items: center;
    background: linear-gradient(-45deg, rgba(0,0,0,0.22), rgba(255,255,255,0.25));
    box-shadow: 
    8px 8px 12px 0 rgba(0, 0, 0, 0.25),
    -2px -2px 4px 0 rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    display: flex;  
    justify-content: center; 
}
.custom-row {
    background: #5dbb63;
    padding: 1rem;
}
`
export default function CustomAds() {
    return (
        <StyleCustomAds className="d-flex">
            <CarouselComponent/>
        </StyleCustomAds>
    )
}

const CarouselComponent = () => {

    return (
         <Carousel controls={false} indicators={false} className="rounded w-100">
            <Carousel.Item 
                interval={2000} 
                className="border-0 shadow p-1 rounded " 
                style={{ backgroundColor: '#5dbb63' }}            
            >
                <div className="row align-items-center custom-row">
                    <div className="col d-flex justify-content-center p-3" style={{ maxWidth: '30%', height: '100px' }}>
                        <Image width={75} height={75} src="https://www.pinaclebet.com/mpesa.png" />
                    </div>
                    <div 
                    className=
                    "col m-2 rounded-pill d-flex align-items-center flex-column justify-content-center custom-card text-white p-3" 
                    >
                        <h4 className="text-center fw-bold mb-2">PAYBILL: {config.MPESA_PAYBILL_NUMBER}</h4>
                        <h4 className="text-center fw-bold w-100 rounded">
                            ACCT. NO: 07-XXX-XXX
                        </h4>
                    </div>
                </div>              
            </Carousel.Item>    
            <Carousel.Item 
                interval={2000} 
                className="border-0 shadow p-1 rounded" 
                style={{ backgroundColor: '#5dbb63' }}            
            >
                <div className="row align-items-center custom-row">
                    <div className="col d-flex justify-content-center p-3" style={{ maxWidth: '30%', height: '100px' }}>
                        <Image width={75} height={75} src="https://www.pinaclebet.com/mpesa.png" />
                    </div>
                    <div 
                    className=
                    "col m-2 rounded-pill d-flex align-items-center flex-column justify-content-center custom-card text-white p-3" 
                    >
                        <h1 className="text-center fw-bold mb-2">
                            Instant Cash Out!
                        </h1>                             
                    </div>
                </div>              
            </Carousel.Item>  
         </Carousel>
    )
}