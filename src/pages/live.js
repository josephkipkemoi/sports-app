import React from "react";
import styled from "styled-components";
import Card from 'react-bootstrap/Card';
import Support from '../components/Support';
import { Container } from "react-bootstrap";

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
            <Container className="pt-3">
                <Card style={{ border: 'none' }}>
                    <Card.Header className="bg-success">
                        <h5 className="text-center text-light">Live Games</h5>
                    </Card.Header>
                    <Card.Body className="text-center card-bb">
                        <div className="card-container">
                            <span>No live games</span>
                        </div>
                    </Card.Body>
                </Card>
            </Container>           
           
            <Support/>
        </StyleLivePage>
    )
}