import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import styled from 'styled-components';
import Link from 'next/link';
import Select from 'react-select';
import  useAuth  from '../hooks/auth';
import { validateNumber } from '../lib/validation';
import Support from '../components/Support';

const StyleRegistration = styled.div`
background-color: #ebeded;
a {
    text-decoration: none;
    color: #8b0000;
    font-weight: bold;
}
.custom-box {
    max-width: 530px;
    padding-top: 32px;
    padding-bottom: 64px;
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
 h3, h6 {
     font-weight: bold;
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
`

const countryOptions = [
    { name: 'country_residence', value: 'Kenya', label: 'Kenya' },
    { name: 'country_residence', value: 'Uganda', label: 'Uganda' },
    { name: 'country_residence', value: 'Tanzania', label: 'Tanzania' }
]

export default function Register() {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/'
    })
 
    const [numberValidationMessage, setNumberValidationMessage] = useState('')
    const [errors, setErrors] = useState([])

    const [userDetails, setUserDetails] = useState({
        country_residence: countryOptions[0].value,
        phone_number: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const { country_residence, phone_number, email, password, password_confirmation } = userDetails;

    const handleUser = (e) => {

        const validatedNum = e?.target?.name === 'phone_number' && validateNumber( e.target.value )
        
        if(!!validatedNum) {
            setNumberValidationMessage(validatedNum)
        } else {
            setNumberValidationMessage('')
        }
       
        setUserDetails(prev => ({ ...prev, [e?.target?.name || 'country_residence'] : e?.target?.value || e.value}))
    }

    const submitForm = (e) => {
        e.preventDefault();

        register({ country_residence, phone_number, email, password, password_confirmation, setErrors })
    }

    return (
        <StyleRegistration>
            <Container className='custom-box'>
                <Form>
                    <h3 className='mb-4'>Open Account</h3>
                    <small className='d-block mb-4'>
                        Get help - 
                    <Link href="/contact">
                        <a itemProp='url'> Contact Us</a>
                    </Link>
                    </small>
                    <small className='d-block mb-2'>Country of residence</small>
                    <Select 
                        className="mb-5 shadow-sm" 
                        options={countryOptions}
                        defaultValue={countryOptions[0]}                     
                        onChange={handleUser}
                    />
                    <hr/>
                    <h6 className='mt-4 mb-4'>Contact information</h6>
                    <Form.Group className='mb-3' controlId="formBasicEmail">
                        <Form.Label><small className='d-block'>Enter Email</small></Form.Label>
                        <Form.Control 
                            type='email' 
                            placeholder='Email address' 
                            className='shadow-sm' 
                            autoComplete='username'
                            name='email'
                            maxLength={50}
                            required={true}
                            onChange={handleUser}                             
                        />
                    </Form.Group>
                    <Form.Group className='mb-5' controlId="formBasicPhoneNumber">
                        <Form.Label><small className='d-block'>Contact Number</small></Form.Label>
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
                    <hr/>
                    <h6 className='mt-4 mb-4'>Create login</h6>
                    <Form.Group className='mb-3' controlId='formBasicPassword'>
                        <Form.Label><small className='d-block'>Password</small></Form.Label>
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
                    <Form.Group className='mb-5' controlId='formBasicPassword2'>
                        <Form.Label><small className='d-block'>Confirm password</small></Form.Label>
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
                    <Form.Group className='mb-3' controlId='formBasicCheckbox'>
                        <Form.Check 
                            type="checkbox" 
                            label="I have read and agree to the Terms & Conditions"
                            required={true}
                        />
                    </Form.Group>
                    <Button 
                    disabled={!!numberValidationMessage} 
                    style={{ backgroundColor: '#126e51', borderColor: '#126e51' }} 
                    type="submit" className='w-100'
                    onClick={submitForm}
                    >
                        Join SportsApp
                    </Button>
                </Form>               
            </Container>      
        <Support/>
        </StyleRegistration>
    )
}