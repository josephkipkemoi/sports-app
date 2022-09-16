import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";

const StyleShare = styled.div`
    background: #fff;
    height: 100vh;
`

export default function Share() {
    const router = useRouter()
    const { query: { pid } } = router

    const checkIfShareCodeExists = () => {   
     
        if(Boolean(router?.query?.pid) === true) {
            sessionStorage.setItem('share_code', pid)   
        }

        const shareCode = sessionStorage.getItem('share_code')

        if(Boolean(shareCode) === true) {
            router.replace('/')
        }

    }
    useEffect(() => {
    
        checkIfShareCodeExists()     
    }, [pid])

    return (
        <StyleShare>
            {/* <Index/> */}
            <div className="d-flex flex-column align-items-center justify-content-center p-5">
                <Spinner animation="grow" />
                <h3>Loading Betslip</h3>
            </div>
        </StyleShare>
    )
}