import React from "react";
import  Col from "react-bootstrap/Col";
import  Row from "react-bootstrap/Row";
import styled from "styled-components";
import CustomerInfo from "../components/CustomerInfo";
import CustomFilter from "../components/CustomFilter";
import TopNavBar from "../components/TopNavBar";
import BetslipContainer from "../components/BetslipContainer";
import GameComponent from "../components/GameComponent";
import { useGetV1CustomFixtureQuery } from "../hooks/fixture";
import  Spinner  from "react-bootstrap/Spinner";
import axios from "../lib/axios";

const StyleSoccer = styled.div`
    height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
    background-color: #ebeded;
`

export default function Soccer() { 
    
    return (
        <StyleSoccer>
            <Row>
                <Col lg={9} md={12} sm={12}>
                    <TopNavBar  />
                    <CustomFilter heading="Soccer" />
                    <GameComponent />
                </Col>
                <Col lg={3} md={12} sm={12} style={{ paddingLeft: 0 }}>
                    <BetslipContainer/>
                    <CustomerInfo/>
                </Col>
            </Row>
        </StyleSoccer>
    )
}
 