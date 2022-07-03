import React from "react";
import { Card, Container } from "react-bootstrap";
import styled from "styled-components";

const StyleResponsibleGambling = styled.div`
    height: 100vh;
    background: #fff;
`
export default function ResponsibleGambling() {
    return (
        <StyleResponsibleGambling>
            <Container className="pt-4">
                <Card>
                    <Card.Header>
                        <h2>Responsible Gaming</h2>
                    </Card.Header>
                    <Card.Body>
                        <h5>Useful tools to help you stay in control of your gambling</h5>
                    </Card.Body>
                </Card>
            </Container>
        </StyleResponsibleGambling>
    )
}