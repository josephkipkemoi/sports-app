import React from "react";
import styled from "styled-components";

const StyleLoader = styled.div`
.container {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    width: 200px;
  }
  h2 {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    letter-spacing: 3px;
  }
  .dash {
    margin: 0 15px;
    width: 35px;
    height: 15px;
    border-radius: 8px;
    background: #FF2CBD;
    box-shadow: 0 0 10px 0 #FECDFF;
  }
  
  .uno {
    margin-right: -18px;
    transform-origin: center left;
    animation: spin 3s linear infinite;  
  }
  
  .dos {
    transform-origin: center right;
    animation: spin2 3s linear infinite;
    animation-delay: .2s;
  }
  
  .tres {
    transform-origin: center right;
    animation: spin3 3s linear infinite;
    animation-delay: .3s;
  }
  
  .cuatro {
    transform-origin: center right;
    animation: spin4 3s linear infinite;
    animation-delay: .4s;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(360deg);
    }
    30% {
      transform: rotate(370deg);
    }
    35% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  @keyframes spin2 {
    0% {
      transform: rotate(0deg);
    }
    20% {
      transform: rotate(0deg);
    }
    30% {
      transform: rotate(-180deg);
    }
    35% {
      transform: rotate(-190deg);
    }
    40% {
      transform: rotate(-180deg);
    }
    78% {
      transform: rotate(-180deg);
    }
    95% {
      transform: rotate(-360deg);
    }
    98% {
      transform: rotate(-370deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
  
  @keyframes spin3 {
    0% {
      transform: rotate(0deg);
    }
    27% {
      transform: rotate(0deg);  
    }
    40% {
      transform: rotate(180deg);
    }
    45% {
      transform: rotate(190deg);
    }
    50% {
      transform: rotate(180deg);
    }
    62% {
      transform: rotate(180deg);
    }
    75% {
      transform: rotate(360deg);
    }
    80% {
      transform: rotate(370deg);
    }
    85% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  @keyframes spin4 {
    0% {
      transform: rotate(0deg);
    }
    38% {
      transform: rotate(0deg);
    }
    60% {
      transform: rotate(-360deg);
    }
    65% {
      transform: rotate(-370deg);
    }
    75% {
      transform: rotate(-360deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
`
export default function Loader() {
    return (
        <StyleLoader>
        <h2 className="fw-bold text-danger">BET360</h2>
        <div className="container">
            <div className="dash uno"></div>
            <div className="dash dos"></div>
            <div className="dash tres"></div>
            <div className="dash cuatro"></div>
        </div>
        </StyleLoader>
    )
}