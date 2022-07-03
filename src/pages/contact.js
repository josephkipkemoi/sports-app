import React from "react";
import  Card  from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import styled from "styled-components";

const StyleContact = styled.div`
    height: 100vh;
    overflow: scroll;
    background: #fff;
`

export default function Contact() {
    return (
        <StyleContact>
            <Container>
                <Card className="mt-4">
                    <Card.Header>
                        <h3>Contact</h3>
                    </Card.Header>
                    <Card.Body>
                        <h4>WhatsApp</h4>
                        <h4>Email</h4>
                        <h4>Chat</h4>
                    </Card.Body>
                </Card>
            </Container>
        </StyleContact>
    )
}