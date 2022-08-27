import React from "react";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Support from "../components/Support";
import CustomerInfo from "../components/CustomerInfo";
import TopNavBar from "../components/TopNavBar";

const StyleResults = styled.div`
    height: 100vh;
    background: #505050;
    .card-bb {
        margin: 15vh auto;
    }
    h5, span {
        letter-spacing: 1px;
    }
`
export default function Results() {
    return (
        <StyleResults>
            <Row className="px-2">
                <Col lg="9" md="9" sm="12" style={{ padding: 0 }}>
                    <TopNavBar/>
                    <div className="text-center mt-3">
                        <span className="text-white">Please refresh or check again later!</span>
                    </div>
                </Col>
                <Col lg="3" md="3" sm="12" style={{ paddingLeft: 0 }}>
                    <CustomerInfo   />
                </Col>
            </Row>
            <Support/>
        </StyleResults>
    )
}