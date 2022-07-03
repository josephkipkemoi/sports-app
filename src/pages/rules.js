import React from "react";
import styled from "styled-components";
import  Card  from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

const StyleRules = styled.div`
    height: 100vh;
    background: #fff;
`
export default function Rules() {
    return (
        <StyleRules>
          <Container>
                <Card >
                    <Card.Header >
                        <h3>Rules</h3>
                    </Card.Header>
                    <Card.Body>
                       
                    </Card.Body>
                </Card>
            </Container>
        </StyleRules>
    )
}