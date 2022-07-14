import React from "react";
import { Card, Container } from "react-bootstrap";
import styled from "styled-components";

const StyledJackpot = styled.div`
    height: 100vh;
    background: #505050;
    h3 {
        letter-spacing: 1px;
    }
    span {
        letter-spacing: 1px;
        display: block;
    }
    .card-bb {
        min-height: 50vh;
    }
    .text-body {
        margin: 15vh auto;
      
    }
`
export default function Jackpot() {
    return (
        <StyledJackpot>
            <Container className="pt-3">
                <Card className="bg-light" style={{ border: 'none' }}>
                    <Card.Header className="text-center bg-success text-light">
                        <h5>Jackpot Games</h5>
                    </Card.Header>
                    <Card.Body className="text-center card-bb">
                        <div className="text-body">
                            <span >
                                Jackpot games not available now. 
                            </span>
                            <span className="mt-3">
                                Check again later!
                            </span>
                        </div>                      
                    </Card.Body>
                </Card>
            </Container>
       
        </StyledJackpot>
    )
}