import React from "react";
import styled from "styled-components";
import Card from "react-bootstrap/Card";
import Container  from "react-bootstrap/Container";

const StyledPolicy = styled.div`
    height: 100vh;
    background: #fff;
`
export default function Privacy() {
    return (
        <StyledPolicy>
        <Container className="pt-4">
            <Card>
                <Card.Header>
                    <h2>Privacy Policy</h2>
                </Card.Header>
                <Card.Body>
                    <h5>Useful tools to help you stay in control of your gambling</h5>
                </Card.Body>
            </Card>
        </Container>
    </StyledPolicy>
    )
}