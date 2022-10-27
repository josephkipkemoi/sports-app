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
        font-size: 14px;
    }
    .clock {
        background: linear-gradient(-45deg, rgba(0,0,0,0.22), rgba(255,255,255,0.25));
        border: none;
        padding: .5rem;
        border-radius: 12px;
        box-shadow: 
        3px 3px 5px 0 rgba(0, 0, 0, 0.25),
        -2px -2px 3px 0 rgba(255, 255, 255, 0.3); 
    }
`
export default function CurrentTime({ displayMode }) {
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
            <div className={`d-flex align-items-center clock ${displayMode === 'dark-mode' ? 'text-white' : 'text-white'}`}>
                <FontAwesomeIcon icon={faClock}  size="2x"/>
                <span>{`${String(hours).padStart(2, '0')}:${String(min).padStart(2, '0')}`}</span>
            </div>         
        </StyleTimer>
    )
}