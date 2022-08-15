import React, { useEffect, useState } from "react";
import styled from "styled-components";

const StyleTimer = styled.div`
    span {
        margin-left: 10px;
        letter-spacing: 2px;
        font-weight: bold;
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
           <span className="text-white">{`${hours}:${String(min).padStart(2, '0')}`}</span>
        </StyleTimer>
    )
}