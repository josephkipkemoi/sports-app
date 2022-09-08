import React from "react";
import styled from "styled-components";

const StyleIcon = styled.div`
svg {
  position: absolute;
  left: -6px;
  top: 12px;
}
svg text {
    font-family: Roboto Condensed,Arial Narrow,sans-serif;
    letter-spacing: 3px;
    stroke: #001041;
    font-size: 28px;
    font-weight: 700;
    stroke-width: 1.5; 
    animation: textAnimate 5s infinite alternate;  
  }
  
  @keyframes textAnimate {
    0% {
      stroke-dasharray: 0 50%;
      stroke-dashoffset:  20%;
      fill: #191970
    }
    
    100% {
      stroke-dasharray: 50% 0;
      stroke-dashoffstet: -20%;
      fill: #191970
    }  
  }  
`
export default function Logo() {
    return (
        <StyleIcon>
            <svg width="170" height="40">
                <text x="50%" y="60%"  textAnchor="middle"  >
                    Pinaclebet
                </text>
            </svg>
        </StyleIcon>
    )
}