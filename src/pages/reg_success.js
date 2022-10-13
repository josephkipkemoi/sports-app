import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef } from "react";
import Card from "react-bootstrap/Card";
import styled from "styled-components";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Confetti from '../components/Confetti';

const StyleRegSuccess = styled.div`
    height: 100vh;
    background: #191970;
    h3, h4 {
        letter-spacing: 1px;
    }
    .position-confetti {
        position: absolute;
        top: 0;
        background: #191970;
    }
`
export default function Reg_Success() {
    
    const regRef = useRef(null)

    useEffect(() => {
        regRef.current.focus()
    }, [])

    return (
        <StyleRegSuccess>                              
                <Card className="shadow-lg mt-5 border-0 m-3" style={{ zIndex: 1 }}>                 
                    <Card.Header ref={regRef} tabIndex="-1" className="bg-warning text-white text-center border-0 pt-4" style={{ zIndex: 1 }}>
                        <FontAwesomeIcon icon={faCheckCircle} size="8x" className="text-white"/>
                        <h1 className="mt-3 fw-bold">SUCCESS</h1>
                    </Card.Header>
                    <Card.Body className="text-center mt-2 mb-2">
                        <h4 className="text-secondary">Congratulations, your account has been successfully created.</h4>
                    </Card.Body>
                    <Card.Footer className="border-0 p-3 text-center">
                        <h6 className="d-block mt-2 mb-3">Activate your account by making your first Deposit.</h6>
                        <div className="d-flex justify-content-center">
                            <Link href="/profile">
                                <a
                                    itemProp="url"
                                    className="btn btn-primary btn-lg shadow rounded-pill m-1 w-50"
                                >
                                    <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="16" 
                                    height="16" 
                                    fill="currentColor" 
                                    className="bi bi-currency-exchange" 
                                    viewBox="0 0 16 16"
                                    style={{ marginRight: 8 }}
                                    >
                                        <path d="M0 5a5.002 5.002 0 0 0 4.027 4.905 6.46 6.46 0 0 1 .544-2.073C3.695 7.536 3.132 6.864 3 5.91h-.5v-.426h.466V5.05c0-.046 0-.093.004-.135H2.5v-.427h.511C3.236 3.24 4.213 2.5 5.681 2.5c.316 0 .59.031.819.085v.733a3.46 3.46 0 0 0-.815-.082c-.919 0-1.538.466-1.734 1.252h1.917v.427h-1.98c-.003.046-.003.097-.003.147v.422h1.983v.427H3.93c.118.602.468 1.03 1.005 1.229a6.5 6.5 0 0 1 4.97-3.113A5.002 5.002 0 0 0 0 5zm16 5.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0zm-7.75 1.322c.069.835.746 1.485 1.964 1.562V14h.54v-.62c1.259-.086 1.996-.74 1.996-1.69 0-.865-.563-1.31-1.57-1.54l-.426-.1V8.374c.54.06.884.347.966.745h.948c-.07-.804-.779-1.433-1.914-1.502V7h-.54v.629c-1.076.103-1.808.732-1.808 1.622 0 .787.544 1.288 1.45 1.493l.358.085v1.78c-.554-.08-.92-.376-1.003-.787H8.25zm1.96-1.895c-.532-.12-.82-.364-.82-.732 0-.41.311-.719.824-.809v1.54h-.005zm.622 1.044c.645.145.943.38.943.796 0 .474-.37.8-1.02.86v-1.674l.077.018z"/>
                                    </svg>
                                    Deposit
                                </a>
                            </Link>
                            <Link href="/">
                                <a
                                    itemProp="url"
                                    className="btn btn-success btn-lg shadow rounded-pill m-1 w-50"
                                >
                                    <i 
                                    className="bi bi-box-arrow-in-right"
                                    style={{ marginRight: 8 }}
                                    ></i>
                                    Continue
                                </a>
                            </Link>
                        </div>
                       
                    </Card.Footer>
                </Card>
                <div className="position-confetti">
                        <Confetti />
                    </div>  
        </StyleRegSuccess>
    )
}