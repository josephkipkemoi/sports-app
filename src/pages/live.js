import React from "react";
import styled from "styled-components";
import Support from '../components/Support';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CustomerInfo from "../components/CustomerInfo";
import TopNavBar from "../components/TopNavBar";

const StyleLivePage = styled.div`
    height: 100vh;
    background-color: #505050;
    h5 {
        letter-spacing: 1px;
    }
    span {
        letter-spacing: 1px;
    }
    .card-bb {
        min-height: 25vh;
    }
    .card-container {
        margin: 15vh auto;
    }
`
export default function Live() {
    return (
        <StyleLivePage>
            <Row className="px-2">
                <Col lg="9" md="9" sm="12" style={{ padding: 0 }}>
                    <TopNavBar/>
                    <div className="text-center mt-3">
                        <span className="text-white">Please refresh or check again later!</span>
                    </div>
                </Col>
                <Col lg="3" md="3" sm="12" style={{ paddingLeft: 0 }}>
                    <CustomerInfo/>
                </Col>
            </Row>
           
            <Support/>

        </StyleLivePage>
    )
}