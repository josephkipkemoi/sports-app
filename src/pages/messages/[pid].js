import { useRouter } from "next/router";
import React from "react";
import { Card, Container, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { useGetUserMessageByIdQuery } from "../../hooks/messages";
import { faHeadset, faUserCircle , faInbox, faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const StyleMessages = styled.div`
 height: 100vh;
 background: #fff;
 h4 {
    margin: 0;
    padding: 0;
  }
  .customer-care-icon {
    border: 1px solid gray;
  }
  .customer-message {
    margin-left: 18px;
  }
`

export default function MessagePid() {
    const router = useRouter()
    const { query } = router
    const number = JSON.parse(localStorage.getItem('uu_id')).uu_id.phone_number

    const { data, error, isLoading } = useGetUserMessageByIdQuery(query.pid)
    
    if(error) {
        return <span>Error</span>
    }

    if(isLoading) {
        return <Spinner animation="grow"/>
    }

    const MessagesElement = (l, i) => {
        return (
            <React.Fragment key={i}>   
             <div className="d-flex mb-2">
                <div>
                    <div className="p-2 customer-care-icon rounded bg-secondary">
                        <FontAwesomeIcon icon={faUserCircle} className="text-white" size='2x'/>
                    </div>
                </div>
                        
                <div className="d-flex flex-column customer-message">
                    <span>{number}</span>
                    <span>{l.original_message}</span>
                </div>
            </div>  
            <div className="d-flex">
                <div>
                    <div className="p-2 customer-care-icon rounded bg-secondary">
                        <FontAwesomeIcon icon={faHeadset} className="text-white" size='2x'/>
                    </div>
                </div>
                        
                <div className="d-flex flex-column customer-message">
                    <span>{l.username}</span>
                    <span>{l.message}</span>
                </div>
            </div>         
             
            </React.Fragment>
        )
    }
    return (
        <StyleMessages>
         <Container>
            <div className="pt-3 pb-2">
                <Link href="/messages">
                    <a
                        itemProp="url"
                        className="d-flex align-items-center text-dark text-decoration-none "
                    >
                        <FontAwesomeIcon style={{ marginRight: 8 }} icon={faChevronCircleLeft} size="2x"/>
                        Back
                    </a>
                </Link>
            </div>
           
                <Card className="border-0 pt-2">
                    <Card.Header className="bg-primary text-white">
                        <h4 className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faInbox} style={{ marginRight: 8 }}/>
                            {number}
                        </h4>
                    </Card.Header>
                    <Card.Body className="shadow">
                        {data.map(MessagesElement)}
                    </Card.Body>
                </Card>
            </Container>
            
        </StyleMessages>
    )
}