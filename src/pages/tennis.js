import React from "react";
import  Col from "react-bootstrap/Col";
import  Row from "react-bootstrap/Row";
import styled from "styled-components";
import CustomerInfo from "../components/CustomerInfo";
import CustomFilter from "../components/CustomFilter";
import TopNavBar from "../components/TopNavBar";
import BetslipContainer from "../components/BetslipContainer";

const StyleTennis = styled.div`
    height: 100vh;
`
export default function Tennis() {
    return (
        <StyleTennis>
        <Row className="px-2">
            <Col lg={9} md={12} sm={12}>
                <TopNavBar/>
                <CustomFilter heading="Tennis"/>
            </Col>
            <Col lg={3} md={12} sm={12} style={{ paddingLeft: 0 }}>
                <BetslipContainer/>
                <CustomerInfo/>
            </Col>
        </Row>
        </StyleTennis>
    )
}