import Link from "next/link";
import React, { useEffect } from "react";
import styled from "styled-components";
import BetslipContainer from "./BetslipContainer";
import { BetslipSvgIcon, HomeSvgIcon, ListSvgIcon, PersonSvgIcon, WalletSvgIcon } from "./Svg";

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
                        <HomeSvgIcon width="16" height="16" />
                        <span className="mt-2">Home</span>
                    </a>
                </Link>               
                <Link href="/history?his_tab=sbets&tab=all">
                    <a
                        itemProp="url"
                        className="d-flex flex-column align-items-center text-decoration-none text-white"
                    >   
                        <ListSvgIcon width="16" height="16" />
                        <span className="mt-2">History</span>
                    </a>
                </Link>
                <div className="bg-white p-2 rounded-circle ">
                    {length === undefined || length === 0? 
                        <BetslipSvgIcon width="16" height="16" /> :
                        <span onClick={openSlip}  id="mobile" className="text-dark p-2 fw-bold" >{length}</span>
                    }
                </div>
                <Link href="/profile">
                    <a
                     itemProp="url"
                     className="d-flex flex-column align-items-center text-decoration-none text-white"
                    >
                        <PersonSvgIcon width="16" height="16" />
                        <span className="mt-2">Profile</span>
                    </a>                    
                </Link>
                <div className="d-flex flex-column align-items-center">
                    <WalletSvgIcon width="16" height="16" />
                    <span className="mt-2">Deposit</span>
                </div>
            </div>
        </StyleMobileNavComponent>
    )
}