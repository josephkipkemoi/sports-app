import Link from 'next/link'
import React from 'react'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import styled from 'styled-components'
import { Span } from '../components/Html'
import useAuth from '../hooks/auth'
import { useGetBalanceByUserIdQuery, useGetUserBalanceTransactionsQuery } from '../hooks/balance'

const StyleTransaction = styled.div`
    height: 100vh;
    background: #fff;
`
export default function Deposits() {
    const { user } = useAuth({ middleware: 'guest' })
    const { data } = useGetBalanceByUserIdQuery(user && user.id)
    const  transactions = useGetUserBalanceTransactionsQuery(user && user.id)
 
    return (
        <StyleTransaction>
            <Row>
                <Col lg="3" md="3" sm="4">
                <UserProfile user={user} balance={data?.amount}/>
                </Col>
                <Col lg="9" md="9" sm="8">
                    {transactions?.data?.balances?.data.length === 0 ?   
                    <NoTransactions/> :  
                    <DepositsProfile data={transactions?.data?.balances}/>}               
                </Col>
            </Row>
        
        </StyleTransaction>
    )
}

const DepositsProfile = ({ data }) => {
 
    const DepositElements = (link, i) => {
        return (
            <React.Fragment key={i}>
                <Span className='d-block'>{link.amount}</Span>
            </React.Fragment>
        )
       
    }
    return (
        <Card className='mt-2'>
         <Card.Header>
         <h3>Deposits</h3>    
        </Card.Header> 
        <Card.Body>
            {data?.data?.map(DepositElements)}
        </Card.Body>
        </Card>
    )
}

const NoTransactions = () => {
    return (
    <Card.Body>
      <Span className='d-block text-center'>You do not have any transactions</Span>
      <div className='text-center'>
        <button className='btn btn-warning mt-3 mb-3'>Deposit Now</button>
      </div>
    </Card.Body>
  )
}

const StyleUserProfile = styled.div`
padding-top: 20px;
`

const userProfileLinks = [
    {
        name: 'Transactions',
        path: '/transactions'
    },
    {
        name: 'Deposit',
        path: '/deposits'
    },
    {
        name: 'Withdraw',
        path: '/withdrawals'
    },
    {
        name: 'Bet History',
        path: '/history?tab=all'
    }
]
const UserProfile = ({ user, balance }) => {

    const UserProfileLinkElements = (link, i) => {
        return (
            <Link key={i} href={link.path}>
                <a
                    itemProp='url'
                    className='d-flex justify-content-between text-decoration-none text-dark d-block mb-3'
                >
                    {link.name}
                    <i className="bi bi-arrow-right-short"></i>
                </a>
            </Link>
        )
    }
    return (
        <StyleUserProfile className='card m-2 p-2'>
            <Card>
                <Card.Header className="bg-dark text-light d-flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-bounding-box" viewBox="0 0 16 16">
                        <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    </svg>
                    <Span style={{ marginLeft: 10 }}>0{user?.phone_number}</Span>
                </Card.Header>
                <Card.Body>
                    <Span className='d-block'>Balance</Span>
                    <Span className='d-block fw-bold'>KES {balance?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Span>
                    <hr/>

                    {userProfileLinks.map(UserProfileLinkElements)}
                    
                </Card.Body>
            </Card>
          
        </StyleUserProfile>
    )
}