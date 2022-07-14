import React from "react";
import styled from "styled-components";
import  Card  from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

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
          <Container className="pt-3">
                <Card className="bg-light" style={{ border: 'none' }}>
                    <Card.Header className="bg-success text-center text-light">
                        <h5>Results</h5>
                    </Card.Header>
                    <Card.Body className="text-center">
                        <div className="card-bb">
                            <span>Check again later!</span>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </StyleResults>
    )
}