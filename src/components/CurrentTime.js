import React, { useEffect, useState } from "react";
import styled from "styled-components";
import  { FontAwesomeIcon }  from "@fortawesome/react-fontawesome";
import  { faClock }  from "@fortawesome/free-solid-svg-icons";
const StyleTimer = styled.div`
    span {
        letter-spacing: 2px;
        font-weight: bold;
        margin-top: 2px;
        margin-left: 6px;
    }
`
export default function CurrentTime() {
    const [hours, setHours] = useState(0)
    const [min, setMin] = useState(0)
    const [timer, setTimer] = useState(false)
    const date = new Date()

    useEffect(() => {
        setHours(date.getHours())
        setMin(date.getMinutes())

        const time = setInterval(() => {
            setTimer(prev => !prev)
        }, 1000)

        return () => clearInterval(time)
    }, [timer])
    return (
        <StyleTimer>
            <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faClock} className="text-white" size="2x"/>
                <span className="text-white">{`${String(hours).padStart(2, '0')}:${String(min).padStart(2, '0')}`}</span>
            </div>         
        </StyleTimer>
    )
}