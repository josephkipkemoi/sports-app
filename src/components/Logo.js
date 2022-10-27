import React from "react";
import styled from "styled-components";

const StyleIcon = styled.div`
.dark-mode-logo svg {
  max-width: 155px;
  height: 40px;
  border-radius: 16px;
  padding-top: 4px;
  margin-left: -8px;
  margin-bottom: -4px;
  margin-top: 4px;
}
.light-mode-logo svg {
 max-width: 155px;
 height: 40px;
 border-radius: 16px;
 padding-top: 4px;
 margin-left: -8px;
 margin-bottom: -4px;
 margin-top: 4px;
}
.dark-mode-logo svg text {
  font-family: Roboto Condensed,Arial Narrow,sans-serif;
  letter-spacing: 2px;
  stroke: #fff;
  font-size: 28px;
  font-weight: 700;
  stroke-width: 1.5; 
  animation: textAnimateDarkMode 5s infinite alternate;  
}
.light-mode-logo svg text {
    font-family: Roboto Condensed,Arial Narrow,sans-serif;
    letter-spacing: 2px;
    stroke: #001041;
    font-size: 28px;
    font-weight: 700;
    stroke-width: 1.5; 
    animation: textAnimateLightMode 5s infinite alternate;  
  }
  
   @keyframes textAnimateLightMode {
    0% {
      stroke-dasharray: 0 50%;
      stroke-dashoffset:  20%;
      fill: #191970;
    }
    
    100% {
      stroke-dasharray: 50% 0;
      stroke-dashoffstet: -20%;
      fill: #191970;
    }  
  } 
  @keyframes textAnimateDarkMode {
    0% {
      stroke-dasharray: 0 50%;
      stroke-dashoffset:  20%;
      fill: #fff;
    }
    100% {
      stroke-dasharray: 50% 0;
      stroke-dashoffstet: -20%;
      fill: #fff;
    }  
  } 
`
export default function Logo({ displayMode }) {
    return (
        <StyleIcon>    
            {displayMode === 'dark-mode' ? 
              <div className="dark-mode-logo">
                <svg className="d-flex align-items-center">
                      <text x="50%" y="60%"  textAnchor="middle"  >
                        Pinaclebet
                    </text>
                </svg>
              </div>
            : <div className="light-mode-logo">
            <svg className="d-flex align-items-center">
                <text x="50%" y="60%"  textAnchor="middle"  >
                    Pinaclebet
                </text>
            </svg>
          </div>}
        </StyleIcon>
    )
}