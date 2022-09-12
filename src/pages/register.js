import React, { useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import styled from 'styled-components';
import  useAuth  from '../hooks/auth';
import { validateNumber } from '../lib/validation';
import Support from '../components/Support';
import config from '../../config.json';
import Link from 'next/link';

const StyleRegistration = styled.div`
background-color: #fff;
a {
    text-decoration: none;
    color: #8b0000;
    font-weight: bold;
}
.custom-box {
    max-width: 530px;
    padding-top: 22px;
    padding-bottom: 22px;
}
hr {
    margin: 0;
    padding: 0;
}
 input {
     padding: 15px 12px;
 }
 button {
    padding: 15px 12px;
    font-weight: bold;
 }
 input[type=checkbox] {
     padding: 0;
 }
 h3, h5 {
     font-weight: bold;
     color: #001041;
 }
 label {
    color: #001041; 
 }
 .card-box {
    background-color: #fff;
    border: 0;
 }

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
small {
    line-height: 30px;  
}
.card-red {
    background-color: #1affff;
}
`

 const Register = () => {
    
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/'
    })
    
    const [numberValidationMessage, setNumberValidationMessage] = useState('')
    const [errors, setErrors] = useState([])

    const [userDetails, setUserDetails] = useState({
        phone_number: '',
        password: '',
        password_confirmation: '',
    })

    const { phone_number, password, password_confirmation } = userDetails;

    const handleUser = (e) => {

        const validatedNum = e?.target?.name === 'phone_number' && validateNumber( e.target.value )
        
        if(!!validatedNum) {
            setNumberValidationMessage(validatedNum)
        } else {
            setNumberValidationMessage('')
        }
       
        setUserDetails(prev => ({ ...prev, [e?.target?.name ] : e?.target?.value }))
    }

    const submitForm = (e) => {
        e.preventDefault();
        let mobile_number = phone_number.split('')
        mobile_number.splice(0,1,'254')
        mobile_number = mobile_number.join('')
        register({ phone_number: mobile_number, password, password_confirmation, setErrors })
    }

    return (
        <StyleRegistration>
            <Container className='custom-box'>
                <Form>
                    <h3 className='mb-4'>Open Account</h3>    
                    <Card className='card-box shadow-sm border-0'>
                        <Card.Header style={{ backgroundColor: '#1affff', borderBottom: '0' }}>
                        <h5 className='mt-2 mb-2'>Contact Information</h5>
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
                                <small className='text-danger'>{numberValidationMessage}</small>
                            </Form.Group> 
                        </Card.Body>
                          
                    </Card>                
                  
                    <Card className='card-box shadow-sm border-0 mt-4 mb-4'>
                        <Card.Header style={{ backgroundColor: '#1affff', borderBottom: '0' }}>
                            <h5>Create Password</h5>
                        </Card.Header>
                        <Card.Body>
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
                        <Form.Group className='mb-3' controlId='formBasicPassword2'>
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control 
                                type='password' 
                                placeholder='Confirm password' 
                                className='shadow-sm' 
                                autoComplete='new-password'
                                name='password_confirmation'
                                required={true}
                                onChange={handleUser}      
                            />
                        </Form.Group>
                        </Card.Body>
                    </Card>
                    <div className='d-flex justify-content-start'>
                        <Form.Group className='mb-1' controlId='formBasicCheckbox'>
                            <Form.Check 
                                type="checkbox" 
                                label="I have read and agree to the Terms & Conditions"
                                required={true}
                            />
                        </Form.Group>
                    </div>

                    <div className='mb-2 text-end'>
                        <span>
                            Already have an account?
                            <Link href="/login">
                                <a
                                    itemProp='url'
                                    style={{ marginLeft: 5 }}
                                >
                                    Login
                                </a>
                            </Link>
                        </span>
                    </div>

                    <Button 
                    disabled={!!numberValidationMessage} 
                    style={{ backgroundColor: '#191970', borderColor: '#191970', letterSpacing: '1px' }} 
                    type="submit" 
                    className='w-100 shadow'
                    onClick={submitForm}
                    >
                        Join {config.APP_NAME}
                    </Button>
                   
                    <div className='d-flex justify-content-start'>
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
        <Support/>
        </StyleRegistration>
    )
}

export default Register;