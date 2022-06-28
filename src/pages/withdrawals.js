import Link from 'next/link'
import React from 'react'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import styled from 'styled-components'
import { Span } from '../components/Html'
import { UserProfile } from './history'
const StyleTransaction = styled.div`
    height: 100vh;
    background: #fff;
`
export default function Deposits() {

    return (
        <StyleTransaction>
            <Row>
                <Col lg="3" md="3" sm="4">
                    <UserProfile/>
                </Col>
                <Col lg="9" md="9" sm="8" className="mt-2">
                    <Card>
                        <Card.Header>
                            <h3>Withdrawals</h3>
                        </Card.Header>
                        <Card.Body>
                        <NoTransactions/>  
                        </Card.Body>                    
                    </Card>
                 
                </Col>
            </Row>
        
        </StyleTransaction>
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
 