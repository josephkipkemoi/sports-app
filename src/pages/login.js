import React, { useState } from "react";
import { Button, Form, Card, Container } from "react-bootstrap";
import styled from "styled-components";
import { withPublic } from "../components/RouteProtection";
import useAuth from "../hooks/auth";

const StyleLogin = styled.div`
height: 50vh;
background-color: #fff;
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
                    <Card className='card-box shadow border-0'>
                        <Card.Header style={{ backgroundColor: '#1affff', borderBottom: '0' }}>
                        <h5 className='mt-2 mb-2'>User Information</h5>
                        </Card.Header>

                        <Card.Body>
                            <Form.Group className='mb-3' controlId="formBasicPhoneNumber">
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control 
                                    type='number' 
                                    placeholder='Phone number' 
                                    className='shadow-sm'
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
                                    className='shadow-sm' 
                                    autoComplete='new-password'
                                    name='password'
                                    required={true}
                                    onChange={handleUser}      
                                />
                            </Form.Group>
                        </Card.Body>
                          
                    </Card>                
                   
                    <Button 
                    style={{ backgroundColor: '#191970', borderColor: '#191970', letterSpacing: '1px' }} 
                    type="submit" 
                    className='w-100 shadow mt-4'
                    onClick={submitForm}
                    >
                        Login
                    </Button>
                    <div className='d-flex justify-content-center'>
                        <Form.Group className='mt-4 text-center' controlId='formRememberCheckbox'>
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

export default Login