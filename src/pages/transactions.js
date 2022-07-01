import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import styled from 'styled-components';
import {  useGetUserBalanceTransactionsQuery } from '../hooks/balance';
import { Span } from '../components/Html';
import Link from 'next/link';
import { UserProfile } from './history';
import Support from '../components/Support';

const StyleTransaction = styled.div`
    height: 100vh;
    background: #fff;
`
export default function Transactions() {
    const [userId, setUserId] = useState(null)
    const  transactions = useGetUserBalanceTransactionsQuery(userId)
    useEffect(() => {
        const user_id = localStorage.getItem('u_i')
        setUserId(user_id)
    }, [])
    return (
        <StyleTransaction>
            <Row>
                <Col lg="3" md="3" sm="4">
                    <UserProfile/>
                </Col>
                <Col lg="9" md="9" sm="8">
                    <TransactionsProfile data={transactions?.data?.balances}/>
                </Col>
            </Row>    
            <Support/>      
        </StyleTransaction>
    )
}


const TransactionsProfile = ({ data }) => {
     
    const Transactions = () => {
        const DepositElements = (link, i) => {
            return (
                <React.Fragment key={i}>
                    <Span className='d-block'>{link.amount}</Span>
                </React.Fragment>
            )
        }
        return (
            <>
                <h5>Deposits</h5>
                    {data?.data?.map(DepositElements)}
                <hr/>
                <h5>Withdrawals</h5>
            </>
        )
    }
    return (
        <Card className='mt-2'>
            <Card.Header>
                <h3>Transactions</h3>
            </Card.Header> 
            <Card.Body>
                {data?.data?.length === 0 ?   <NoTransactions/> :  <Transactions/>}              
            </Card.Body>
        </Card>
    )
}

const NoTransactions = () => {
    return (
    <>
      <Span className='d-block text-center'>You do not have any transactions</Span>
      <div className='text-center'>
        <button className='btn btn-warning mt-3 mb-3'>Deposit Now</button>
      </div>
    </>
  )
}
 