import React from "react";
import styled from "styled-components";

const StyleOffline = styled.div`
background: #282c34;
box-sizing: border-box;
font-family: sans-serif;
font-size: 1.5rem;
margin: 0;
height: 100vh;
.offline {
    align-items: center;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
    max-width: 40ch;
    min-height: 100vh;
  }
`
export default function Offline() {
    return (
        <StyleOffline className="offline d-flex flex-column align-items-center justify-content-center">
            <svg style={{ height: '100px', backgroundColor: 'transparent' }} className="rounded-circle m-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119.034 8 8 119.033 8 256s111.034 248 248 248 248-111.034 248-248S392.967 8 256 8zm130.108 117.892c65.448 65.448 70 165.481 20.677 235.637L150.47 105.216c70.204-49.356 170.226-44.735 235.638 20.676zM125.892 386.108c-65.448-65.448-70-165.481-20.677-235.637L361.53 406.784c-70.203 49.356-170.226 44.736-235.638-20.676z"/></svg>
            <h1 className="text-white">Offline</h1>
            <p className="text-white">The current page isn't available offline. Please try again when when you're back online.</p>
        </StyleOffline>
    )
}