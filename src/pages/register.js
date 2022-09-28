import React, { useState } from 'react';
import { Button, Card, Container, Form, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import  useAuth  from '../hooks/auth';
import { validateNumber } from '../lib/validation';
import Support from '../components/Support';
import config from '../../config.json';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { InputNumber, Small, Span } from '../components/Html';
import { ClosedEyeSvgIcon, OpenEyeSvgIcon } from "../components/Svg";

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
.icon-width {
    width: 48px;    
}
.close-btn {
    position: absolute;
    right: 8px;
    top: 0;
}
`
const StylePassword = styled.div`
    position: relative;
`
const StyleEyeIcon = styled.div`
    position: absolute;
    bottom: 18px;
    right: 15px;
`
 const Register = () => {
    
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/'
    })
    
    const [numberValidationMessage, setNumberValidationMessage] = useState('')
    const [errors, setErrors] = useState([])
    const [passwordValidation, setPasswordValidation] = useState(false)
    const [registerLoading, setRegisterLoading] = useState(false)
    const [passwordShow, setPasswordShow] = useState(false)
    const [confirmPasswordShow, setConfirmPasswordShow] = useState(false)
    const [passwordType, setPasswordType] = useState('password')
    const [confirmPasswordType, setConfirmPasswordType] = useState('password')

    const [userDetails, setUserDetails] = useState({
        phone_number: '',
        password: '',
        password_confirmation: '',
        agree_terms: '',
    })

    const { phone_number, password, password_confirmation, agree_terms } = userDetails;

    const handleUser = (e) => {
        const validatedNum = e?.target?.name === 'phone_number' && validateNumber( e.target.value )
        
        if(!!validatedNum) {
            setNumberValidationMessage(validatedNum)
        } else {
            setNumberValidationMessage('')
        }
       
        setUserDetails(prev => ({ ...prev, [e?.target?.name ] : e.target.name === 'agree_terms' ?  e?.target?.checked :e?.target?.value }))
    }

    const submitForm = (e) => {
        e.preventDefault()
      
        if(password !== password_confirmation) {
           return setPasswordValidation(true)
        }
        
        setRegisterLoading(true)

        let mobile_number = phone_number.split('')
        mobile_number.splice(0,1, '254')
        mobile_number = mobile_number.join('')

        register({ phone_number: Number(mobile_number), password, password_confirmation, agree_terms ,setErrors, setRegisterLoading })     
    }

    const closeErrors = () => {
        setErrors([])
    }

    const showPassword = () => {
        setPasswordShow(prev => !prev)
        if(passwordShow) {
            setPasswordType('password')
        } else {   
            setPasswordType('text')
        }
    }

    const confirmShowPassword = () => {
        setConfirmPasswordShow(prev => !prev)
        if(confirmPasswordShow) {
            setConfirmPasswordType('password')
        } else {   
            setConfirmPasswordType('text')
        }
    }

    return (
        <StyleRegistration>
            <Container className='custom-box'>
                <Form>
                    <h3 className='mb-4'>Open Account</h3>    
                    <Card className='card-box shadow-sm border-0'>
                        <Card.Header style={{ backgroundColor: '#1affff', borderBottom: '0' }}>
                            <h5 className='mt-2 mb-2'>Account Details</h5>
                        </Card.Header>

                        {errors.length > 0 ? 
                          <div className="alert alert-warning mt-2" role="alert">
                            <Span className="d-flex align-items-center">
                                <div className="align-items-center icon-width">
                                    <FontAwesomeIcon icon={faBan} size="2x"/>
                                </div>
                                <div className="align-items-center">
                                    <h6 className="fw-bold">Registration Failed</h6>
                                    {errors[0]}
                                </div>     
                                <Small className="close-btn fw-bold" onClick={closeErrors}>X</Small>                           
                            </Span>
                         </div>
                        : ''}

                        <Card.Body>
                            <Form.Group className='mb-3' controlId="formBasicPhoneNumber">
                                <Form.Label>Mobile Number *</Form.Label>
                                <Form.Control 
                                    type='number' 
                                    placeholder='0700000000' 
                                    className='shadow-sm'
                                    name='phone_number'
                                    maxLength={10}
                                    required={true}
                                    onChange={handleUser}      
                                />
                                <span className='text-danger'>{numberValidationMessage}</span>
                            </Form.Group> 
                            <Form.Group className='mb-3' controlId='formBasicPassword'>
                                <StylePassword>
                                    <Form.Label>Password *</Form.Label>
                                    <Form.Control 
                                        type={passwordType}
                                        placeholder='Password' 
                                        className='shadow-sm' 
                                        autoComplete='new-password'
                                        name='password'
                                        required={true}
                                        onChange={handleUser}      
                                    />
                                    <StyleEyeIcon>
                                        {passwordShow ? 
                                        <OpenEyeSvgIcon onClick={showPassword} width="16" height="16" /> :
                                        <ClosedEyeSvgIcon onClick={showPassword} width="16" height="16" />                       
                                        }                                      
                                    </StyleEyeIcon>
                                </StylePassword>
                           
                            </Form.Group>

                            {passwordValidation ? 
                                <div className='d-flex justify-content-start mb-2'>
                                    <span className='text-danger fw-bold'>Please enter the same password as above</span>
                                </div>
                            : '' }
                          
                            <Form.Group className='mb-3' controlId='formBasicPassword2'>
                                <StylePassword>
                                <Form.Label>Confirm password *</Form.Label>
                                <Form.Control 
                                    type={confirmPasswordType}
                                    placeholder='Confirm password' 
                                    className='shadow-sm' 
                                    autoComplete='new-password'
                                    name='password_confirmation'
                                    required={true}
                                    onChange={handleUser}      
                                />
                                    <StyleEyeIcon>
                                        {confirmPasswordShow ? 
                                        <OpenEyeSvgIcon onClick={confirmShowPassword} width="16" height="16" /> :
                                        <ClosedEyeSvgIcon onClick={confirmShowPassword} width="16" height="16" />                       
                                        }                                      
                                    </StyleEyeIcon>
                                </StylePassword>
                               
                            </Form.Group>                         

                            <div className='d-flex justify-content-start'>
                                <Form.Group className='mb-1' controlId='formBasicCheckbox'>
                                    <Form.Check 
                                        type="checkbox" 
                                        label="I have read and agreed to the Terms & Conditions, the Privacy Policy, that I am 18 years old or over and that all information given is true."
                                        required={true}
                                        name="agree_terms"
                                        onChange={handleUser}      
                                    />
                                </Form.Group>
                            </div>

                            <div className='d-flex justify-content-start'>
                                <Form.Group className='mt-1 mb-3 text-center' controlId='formRememberCheckbox'>
                                    <Form.Check 
                                        type="checkbox" 
                                        label="Keep me logged in."
                                        required={false}
                                        className="text-center"
                                    />
                                </Form.Group>
                            </div>                 

                            <Button 
                                disabled={!!numberValidationMessage || !password || !password_confirmation || registerLoading} 
                                style={{ backgroundColor: '#191970', borderColor: '#191970', letterSpacing: '1px' }} 
                                type="submit" 
                                className='w-100 shadow rounded mb-2'
                                onClick={submitForm}
                            >
                                { registerLoading ? <Spinner animation='grow'/> : `Join ${config.APP_NAME}`}
                            </Button>

                            <div className='mb-3 mt-2 text-end'>
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

                        </Card.Body>
                          
                    </Card>                
                </Form>               
            </Container>      
        <Support/>
        </StyleRegistration>
    )
}

export default Register;