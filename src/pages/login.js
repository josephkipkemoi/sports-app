import Link from "next/link";
import React, { useState } from "react";
import { Form, Card, Container } from "react-bootstrap";
import styled from "styled-components";
import { withPublic } from "../hooks/RouteProtection";
import useAuth from "../hooks/auth";
import { ClosedEyeSvgIcon, OpenEyeSvgIcon } from "../components/Svg";
import { Small, Span } from "../components/Html";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { validateNumber } from "../lib/validation";

const StyleLogin = styled.div`
height: auto;
background-color: #fff;
padding-bottom: 24px;
a {
    text-decoration: none;
    color: #8b0000;
    font-weight: bold;
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
const Login = () => {
    const { login } = useAuth({ middleware: 'guest', redirectIfAuthenticated: '/' })
    
    const [errors, setErrors] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [passwordShow, setPasswordShow] = useState(false)
    const [passwordType, setPasswordType] = useState('password')
    const [disableLoginBtn, setDisableLoginBtn] = useState(true)
    const [numberValidationMessage, setNumberValidationMessage] = useState('')

    const [userDetails, setUserDetails] = useState({
        phone_number: '',
        password: '',
    })

    const { phone_number, password } = userDetails;

    const handleUser = (e) => {   

        const validatedNum = e?.target?.name === 'phone_number' && validateNumber( e.target.value )
        console.log(validatedNum)
        if(!!validatedNum) {
            setNumberValidationMessage(validatedNum)
        } else {
            setNumberValidationMessage('')
            setDisableLoginBtn(false)
        }

        setUserDetails(prev => ({ ...prev, [e?.target?.name ] : e?.target?.value }))
    }

    const submitForm = (e) => {
        e.preventDefault();

        login({ phone_number, password, setErrors, setIsLoading })
    }

    const showPassword = () => {
        setPasswordShow(prev => !prev)
        if(passwordShow) {
            setPasswordType('password')
        } else {   
            setPasswordType('text')
        }
    }

    const closeErrors = () => {
        setErrors([])
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
                        {errors.length > 0 ? 
                          <div className="alert alert-warning mt-2" role="alert">
                            <Span className="d-flex align-items-center">
                                <div className="align-items-center icon-width">
                                    <FontAwesomeIcon icon={faBan} size="2x"/>
                                </div>
                                <div className="align-items-center">
                                    <h6 className="fw-bold">Login Failed</h6>
                                    {errors[0]}
                                </div>     
                                <Small className="close-btn fw-bold" onClick={closeErrors}>X</Small>                           
                            </Span>
                         </div>
                        : ''}
                      
                        <Card.Body style={{ paddingTop: 0, marginTop: 0 }}>                          
                            <Form.Group className='mb-3 mt-2' controlId="formBasicPhoneNumber">
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
                                <Small className="text-danger">{numberValidationMessage}</Small>
                            </Form.Group> 
                            <Form.Group className='mb-3' controlId='formBasicPassword'>
                                <StylePassword>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                        type={passwordType} 
                                        placeholder='Password' 
                                        className='shadow-sm p-3' 
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
                            <div className="mt-4 text-end">
                                <Link href="/forgot-password">
                                    <a
                                        itemProp="url"
                                    >
                                        Forgot Password ?
                                    </a>
                                </Link>
                            </div>
                            <div className='d-flex justify-content-start'>
                        <Form.Group className='text-start' controlId='formRememberCheckbox'>
                            <Form.Check 
                                type="checkbox" 
                                label="Keep me logged in"
                                required={false}
                                className="text-center"
                            />
                        </Form.Group>
                    </div> 

                    <button 
                        className="btn w-100 p-3 shadow mt-2 rounded" 
                        style={{ backgroundColor: '#191970', color: '#fff' }} 
                        type="button" 
                        onClick={submitForm}
                        disabled={disableLoginBtn}
                    >
                        {isLoading ? <> <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...</> : 'Login'}                   
                    </button>

                    <div className="d-flex flex-column justify-content-center align-items-center mt-3">
                        <Span className="d-block">Don't have an account?</Span>
                        <Link href="/register">
                            <a
                                itemProp="url"
                            >
                                Register here
                            </a>
                        </Link>
                    </div>
                 
                        </Card.Body>
                          
                    </Card>                
                  
                  
                </Form>               
            </Container>      
        </StyleLogin>
    )
}

export default withPublic(Login); 