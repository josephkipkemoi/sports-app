import Link from "next/link";
import React from "react";
import { Card } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import styled from "styled-components";

const StyleFAQ = styled.div`
    height: 100vh;
    background: #fff;
    line-height: 42px;
    overflow-y: scroll;
    .custom-width {
        width : 100%;
    }
`

const faqLinks = [
    {
        name: 'Login Problems',
        path: '#',
        sub_links: [
        {
            name: 'Username / Password',
            path: '#'
        },
        {
            name: 'Having trouble logging in?',
            path: '#'
        },
        {
            name: 'Change Password',
            path: '#'
        }
    ]
    },
    {
        name: 'Withdrawals',
        path: '#',
        sub_links: [
            {
                name: 'Making a withdrawal',
                path: '#'
            }, 
            {
                name: 'Withdrawal Timeframes',
                path: '#'
            },
            {
                name: 'Withdrawal Fees',
                path: '#'
            }
        ]
    },
    {
        name: 'Deposits',
        path: '#',
        sub_links: [
            {
                name: 'Making a Deposit',
                path: '#'
            }, 
            {
                name: 'Payment Methods',
                path: '#'
            },
            {
                name: 'Declined Deposit',
                path: '#'
            }
        ]
    },
    {
        name: 'Cash Out',
        path: '#',
        sub_links: [
            {
                name: 'What is Cash Out?',
                path: '#'
            }, 
            {
                name: 'Auto Cash Out',
                path: '#'
            },
            {
                name: 'Partial Cash Out',
                path: '#'
            }
        ]
    },
    {
        name: 'Account Verification',
        path: '#',
        sub_links: [
            {
                name: 'Verifying Documents',
                path: '#'
            },
            {
                name: 'Verification',
                path: '#'
            },
            {
                name: 'Verification Timeframes',
                path: '#'
            }
        ]
    },
    {
        name: 'Responsible Gambling',
        path: '#',
        sub_links: [
            {
                name: 'Overview',
                path: '#'
            },
            {
                name: 'Stay in Control',
                path: '#'
            },
            {
                name: 'Support and Advice',
                path: '#'
            }
        ]
    },
]

export default function FAQ() {
    const FAQLinkItems = (link, i) => {
        return (
            <nav key={i} className="card p-2 m-1 w-100 bg-success ">
                <Link href={link.path}>
                    <a
                        itemProp="url"
                        className="text-decoration-none text-light"
                    >
                        {link.name}
                    </a>
                </Link>   
                {link.sub_links && link.sub_links.map(FAQLinkItems)}
            </nav>
        )
    }
    return (
        <StyleFAQ>
            <Container className="pt-5">
               <Card>
                   <Card.Header className="bg-secondary">
                        <h3 className="text-light">How Can we help you?</h3>
                   </Card.Header>
                   <Card.Body>
                    <div className="d-sm-flex flex-wrap justify-content-start ">
                        {faqLinks.map(FAQLinkItems)}
                    </div>
                   </Card.Body>
               </Card>  
            </Container>
        </StyleFAQ>
    )
}