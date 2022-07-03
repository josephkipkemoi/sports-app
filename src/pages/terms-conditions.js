import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import styled from "styled-components";

const StyledTerms = styled.div`
 height: 100vh;
 background: #fff;
`

export default function TermsConditions() {
    return (
        <StyledTerms>
            <Container className="pt-3">
                <Card >
                    <Card.Header>
                        <h4>GENERAL TERMS & CONDITIONS</h4>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex justify-content-between">
                            <h6>1. INTRODUCTION</h6>
                            <span>+</span>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </StyledTerms>
    )
}