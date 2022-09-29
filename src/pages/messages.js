import { faHeadset, faArrowRight, faInbox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { Spinner } from "react-bootstrap";
import  Card  from "react-bootstrap/Card";
import  Container  from "react-bootstrap/Container";
import styled from "styled-components";
import { useGetAdminMessagesQuery } from "../hooks/messages";
import MobileNavComponent from '../components/MobileNavComponent';

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
    height: 45px;
    width: 85%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; 
  }

  .arrow-right {
    padding-right: 18px;
    padding-left: 18px;
  }

`
export default function Messages() {

    const number = JSON.parse(localStorage.getItem('uu_id')).uu_id.phone_number
    const { data, isLoading, error } = useGetAdminMessagesQuery(number)

    if(error) {
        return <span>Error</span>
    }

    if(isLoading) {
        return <Spinner animation="grow" />
    }
   
    const MessagesElement = (l, i) => {

        return (
            <React.Fragment key={i}>
                <div className="d-flex justify-content-between align-items-center mb-2 p-1 shadow-sm">
                    <div>
                        <div className="p-2 customer-care-icon rounded bg-secondary">
                            <FontAwesomeIcon icon={faHeadset} className="text-white" size='2x'/>
                        </div>
                    </div>
                    <div className="customer-message">
                        <Link href={`/messages/${l.id}`} >
                            <a
                                itemProp="url"
                                className="d-flex mb-2 text-decoration-none text-dark "
                            >                       
                                <div className="d-flex flex-column ">
                                    <span>{l.username}</span>
                                    <span className="message">{l.message}</span>
                                </div>
                            </a>
                        </Link>
                    </div>   
                    <Link href={`/messages/${l.id}`}>
                        <a
                            itemProp="url"
                            className="text-decoration-none text-dark "
                        >
                            <div className="arrow-right">
                                <FontAwesomeIcon icon={faArrowRight} />
                            </div>  
                        </a>
                    </Link>
                               
                </div>               
            </React.Fragment>
        )
    }
    return (
        <StyleMessages>
            <Container>
                <Card className="border-0 pt-2">
                    <Card.Header className="bg-primary text-white">
                        <h4 className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faInbox} style={{ marginRight: 8 }}/>
                            Inbox
                        </h4>
                    </Card.Header>
                    <Card.Body>
                        {data.map(MessagesElement)}
                    </Card.Body>
                </Card>
            </Container>
            <MobileNavComponent/>
        </StyleMessages>
    )
}