import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Span } from '../components/Html';
import useAuth from '../hooks/auth';
import axios from '../lib/axios';

const StyledHistory = styled.div`
    background-color: #fff;
    height: 100vh;
`
export default function History() {

    const [history, setHistory] = useState([])
    const { user } = useAuth();
    
    const fetchBetHistory = async () => {
        if(!!user) {
            const response = await axios.get(`api/users/${user.id}/betslips`)
            setHistory(response?.data?.data)
        }

    }

    const BetHistoryElements = (name, i) => {
        const FixtureElements = (link, ii) => {
            console.log(link)
            return (
                <React.Fragment key={ii}>
                    <div>
                        <Span>Teams: </Span>
                        <Span>{link.betslip_teams}</Span>
                    </div>
                    <div>
                        <Span>Market: </Span>
                        <Span>{link.betslip_market}</Span>
                    </div>
                    <div>
                        <Span>Picked: </Span>
                        <Span>{link.betslip_picked}</Span>
                    </div>
                    <div>
                        <Span>Odds: </Span>
                        <Span>{link.betslip_odds}</Span>
                    </div>
                </React.Fragment>
            )
        }
        return (
            <React.Fragment key={i}>
                <div>   
                    <Span>Bet Status:</Span>
                    <Span>{name.betslip_status}</Span>
                </div>
                <div>
                    <Span>Bet ID:</Span>
                    <Span>{name.session_id}</Span>
                </div>
                <div>
                    <Span>Stake Amount:</Span>
                    <Span>KES {name.stake_amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Span>
                </div>
                <div>
                    <Span>Final Payout:</Span>
                    <Span>KES {name.final_payout.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Span>
                </div>
                <div>
                    <Span>Total Odds:</Span>
                    <Span>{name.total_odds}</Span>
                </div>               
                <div>
                    {name.fixtures.map(FixtureElements)}
                </div>
                <hr/>
            </React.Fragment>
        )
    }

    useEffect(() => {
        fetchBetHistory()
    },[user])

    return (
        <StyledHistory>
            <h1>History</h1>
            {history.map(BetHistoryElements)}            
        </StyledHistory>
    )
}