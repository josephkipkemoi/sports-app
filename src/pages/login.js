import Link from "next/link";
import React, { useState } from "react";
import { Form, Card, Container } from "react-bootstrap";
import styled from "styled-components";
import { withPublic } from "../hooks/RouteProtection";
import useAuth from "../hooks/auth";

const StyleLogin = styled.div`
height: auto;
background-color: #fff;
padding-bottom: 24px;
a {
    text-decoration: none;
    color: #8b0000;
    font-weight: bold;
}
`
const Login = () => {
    const { login } = useAuth({ middleware: 'guest', redirectIfAuthenticated: '/' })
    
    const [errors, setErrors] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [userDetails, setUserDetails] = useState({
        phone_number: '',
        password: '',
    })

    const { phone_number, password } = userDetails;

    const handleUser = (e) => {       
        setUserDetails(prev => ({ ...prev, [e?.target?.name ] : e?.target?.value }))
    }

    const submitForm = (e) => {
        e.preventDefault();

        login({ phone_number, password, setErrors, setIsLoading })
    }

    return (
        <StyleLogin>
                <Container className='custom-box'>
                <Form>
                    <h3 className='mb-4 pt-4 fw-bold'>Login</h3>    
                    <Card className='card-box shadow-sm border-0 mb-3'>
                        <Card.Header style={{ backgroundColor: '#1affff', borderBottom: '0' }}>
                        <h5 className='mt-2 mb-2 fw-bold'>Welcome Back</h5>
                        </Card.Header>

                        <Card.Body>
                            <Form.Group className='mb-3' controlId="formBasicPhoneNumber">
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control 
                                    type='number' 
                                    placeholder='Phone number' 
                                    className='shadow-sm p-3'
                                    name='phone_number'
                                    maxLength={10}
                                    required={true}
                                    onChange={handleUser}      
                                />
                            </Form.Group> 
                            <Form.Group className='mb-3' controlId='formBasicPassword'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type='password' 
                                    placeholder='Password' 
                                    className='shadow-sm p-3' 
                                    autoComplete='new-password'
                                    name='password'
                                    required={true}
                                    onChange={handleUser}      
                                />
                            </Form.Group>
                            <div className="mt-4 text-end">
                                <Link href="/forgot-password">
                                    <a
                                        itemProp="url"
                                    >
                                        Forgot Password ?
                                    </a>
                                </Link>
                            </div>
                        </Card.Body>
                          
                    </Card>                
                  
                    <button className="btn w-100 p-3 shadow mt-2" style={{ backgroundColor: '#191970', color: '#fff' }} type="button" onClick={submitForm}>
                        {isLoading ? <> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...</> : 'Login'}                   
                    </button>

                    <div className='d-flex justify-content-center'>
                        <Form.Group className='mt-3 text-center' controlId='formRememberCheckbox'>
                            <Form.Check 
                                type="checkbox" 
                                label="Remember Me"
                                required={false}
                                className="text-center"
                            />
                        </Form.Group>
                    </div>                  
                </Form>               
            </Container>      
        </StyleLogin>
    )
}

export default withPublic(Login); 