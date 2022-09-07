import Link from "next/link";
import React, { useEffect } from "react";
import styled from "styled-components";
import AuthUser from "../hooks/AuthUser";
import BetslipContainer from "./BetslipContainer";
import { BetslipSvgIcon, HomeSvgIcon, ListSvgIcon, PersonSvgIcon, WalletSvgIcon } from "./Svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StyleMobileNavComponent = styled.div`
    position: fixed;
    bottom: 0;
    z-index: 2;
    margin: 0;
    padding: 0;
    background-color: #001041;
    span {
        line-height: 12px;
    }
    #mobile {
        cursor: pointer;
    }
    @media screen and (min-width: 990px) {
        display: none; 
    }
    .mobile-display {
        padding-right: 12px;
        padding-left: 12px;
        padding-top: 12px;
        padding-bottom: 6px;
    }
`
export default function MobileNavComponent ({ length, openSlip }) {
    const { uu_id } = AuthUser()
  
    return (
        <StyleMobileNavComponent className="w-100">
            <div 
            className="w-100 text-white d-flex justify-content-between align-items-center mobile-display"
            >
                <Link href="/">
                    <a
                        itemProp="url"
                        className="d-flex flex-column align-items-center text-decoration-none text-white"
                    >
                        <HomeSvgIcon width="20" height="20" />
                        <span className="mt-2">Home</span>
                    </a>
                </Link>               
                <div className="d-flex flex-column align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16">
                    <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
                    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                </svg>
                    <span className="mt-2">Live</span>
                </div>
                <div className="rounded-circle d-flex flex-column align-items-center">
                    {length === undefined || length === 0? 
                        <BetslipSvgIcon width="20" height="20" /> :
                        <span onClick={openSlip}  id="mobile" className="text-white fw-bold p-1 rounded-pill" style={{ border: '2px solid #fff' }}>{length}</span>
                    }
                    <span className="mt-2">Betslip</span>
                </div>
                <Link href="/history?his_tab=sbets&tab=all">
                    <a
                        itemProp="url"
                        className="d-flex flex-column align-items-center text-decoration-none text-white"
                    >   
                        {/* <ListSvgIcon width="20" height="20" /> */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-collection-fill" viewBox="0 0 16 16">
                            <path d="M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3zm2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1z"/>
                        </svg>
                        <span className="mt-2">Check Bets</span>
                    </a>
                </Link>             
                {Boolean(uu_id) ? 
                  <Link href="/profile">
                        <a
                        itemProp="url"
                        className="d-flex flex-column align-items-center text-decoration-none text-white"
                        >
                            <PersonSvgIcon width="20" height="20" />
                            <span className="mt-2">Profile</span>
                        </a>                    
                 </Link> :
                <Link href="/login">
                    <a
                    itemProp="url"
                    className="d-flex flex-column align-items-center text-decoration-none text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                        </svg>
                        <span className="mt-2">Login</span>
                    </a>                    
                </Link>
                }
              
              
            </div>
        </StyleMobileNavComponent>
    )
}