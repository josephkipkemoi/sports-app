import React from "react";
import styled from "styled-components";
import Card from 'react-bootstrap/Card';
const StyleLivePage = styled.div`
    height: 100vh;
    background-color: #fff;
`
export default function Live() {
    return (
        <StyleLivePage>
            <Card>
                <Card.Header>
                <h5 className="fw-bold text-center">LIVE GAMES</h5>
                </Card.Header>
                <Card.Body>

                </Card.Body>
            </Card>
           

        </StyleLivePage>
    )
}