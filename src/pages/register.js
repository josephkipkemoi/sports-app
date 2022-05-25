import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import styled from 'styled-components';
import Link from 'next/link';
import Select from 'react-select';

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
`

const countryOptions = [
    { value: 'Kenya', label: 'Kenya' },
    { value: 'Uganda', label: 'Uganda' },
    { value: 'Tanzania', label: 'Tanzania' }
]

export default function Register() {
    return (
        <StyleRegistration>
            <Container className='custom-box '>
                <Form>
                    <h3 className='mb-4'>Open Account</h3>
                    <small className='d-block mb-4'>
                        Get help - 
                    <Link href="/contact">
                        <a itemProp='url'> Contact Us</a>
                    </Link>
                    </small>
                    <small className='d-block mb-2'>Country of residence</small>
                    <Select options={countryOptions}  className="mb-5 shadow-sm"/>
                    <hr/>
                    <h6 className='mt-4 mb-4'>Contact information</h6>
                    <Form.Group className='mb-3' controlId="formBasicEmail">
                        <Form.Label><small className='d-block'>Enter Email</small></Form.Label>
                        <Form.Control type='email' placeholder='Email address' className='shadow-sm' autoComplete='username'/>
                    </Form.Group>
                    <Form.Group className='mb-5' controlId="formBasicPhoneNumber">
                    <Form.Label><small className='d-block'>Contact Number</small></Form.Label>
                        <Form.Control type='number' placeholder='Phone number' className='shadow-sm'/>
                    </Form.Group>
                    <hr/>
                    <h6 className='mt-4 mb-4'>Create login</h6>
                    <Form.Group className='mb-3' controlId='formBasicPassword'>
                        <Form.Label><small className='d-block'>Password</small></Form.Label>
                        <Form.Control type='password' placeholder='Password' className='shadow-sm' autoComplete='new-password'/>
                    </Form.Group>
                    <Form.Group className='mb-5' controlId='formBasicPassword2'>
                        <Form.Label><small className='d-block'>Confirm password</small></Form.Label>
                        <Form.Control type='password' placeholder='Confirm password' className='shadow-sm' autoComplete='new-password'/>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formBasicCheckbox'>
                        <Form.Check type="checkbox" label="I have read and agree to the Terms & Conditions"/>
                    </Form.Group>
                    <Button style={{ backgroundColor: '#126e51', borderColor: '#126e51' }} type="submit" className='w-100'>
                        Join SportsApp
                    </Button>
                </Form>               
            </Container>           
        </StyleRegistration>
    )
}