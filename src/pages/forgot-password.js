import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import styled from "styled-components";
import Support from '../components/Support';

const StyledPassword = styled.div`
    background: #EBEDED;   
    min-height: 100vh;
    .inner-container {
        max-width: 530px;
    }
    button {
        background-color: #58d7af;
        border-color: #58d7af;
        color: #000;
        font-weight: bold;
        transition: .3s;
    }
    button:hover {
        background-color: #126e51;
        border-color:  #126e51;
    }
`
export default function forgotPassword() {
    return (
        <StyledPassword>
         <Container>
             <div className="inner-container mx-auto pt-5 pb-5">
                <h5 className="mb-4 fw-bold">Having trouble logging in?</h5>
                <Form>
                    <Form.Group className="mb-4">
                        <Form.Label><small className="d-block mb-2">Please enter your email address / phone number to help us identify your account</small></Form.Label>
                        <Form.Control type="text" placeholder="Email address / Phone number" className="p-3"/>
                    </Form.Group>
                    <Button className="w-100 p-3" stype="submit">
                        Next
                    </Button>
                </Form>
             </div>           
         </Container>   
         <Support/>
        </StyledPassword>
    )
}