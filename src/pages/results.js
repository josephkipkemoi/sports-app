import React from "react";
import styled from "styled-components";
import  Card  from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

const StyleResults = styled.div`
    height: 100vh;
    background: #fff;
`
export default function Results() {
    return (
        <StyleResults>
          <Container>
                <Card >
                    <Card.Header >
                        <h3>Results</h3>
                    </Card.Header>
                    <Card.Body>
                       
                    </Card.Body>
                </Card>
            </Container>
        </StyleResults>
    )
}