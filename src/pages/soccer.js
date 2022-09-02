import React from "react";
import  Col from "react-bootstrap/Col";
import  Row from "react-bootstrap/Row";
import styled from "styled-components";
import CustomerInfo from "../components/CustomerInfo";
import CustomFilter from "../components/CustomFilter";
import TopNavBar from "../components/TopNavBar";
import BetslipContainer from "../components/BetslipContainer";
import GameComponent from "../components/GameComponent";
import { useGetV1CustomFixtureQuery } from "../hooks/fixture";
import  Spinner  from "react-bootstrap/Spinner";

const StyleSoccer = styled.div`
    height: auto;
`

export default function Soccer() {
    const { data, isLoading, error, refetch } = useGetV1CustomFixtureQuery()

    if(isLoading) {
        return <Spinner animation='grow' />
      }
    
      if(error) {
        return <span>Try again later!</span>
      }
    
    return (
        <StyleSoccer>
            <Row className="px-2">
                <Col lg={9} md={12} sm={12}>
                    <TopNavBar  />
                    <CustomFilter heading="Soccer" refetch={refetch}/>
                    <GameComponent data={data.fixtures} refetch={refetch}/>
                </Col>
                <Col lg={3} md={12} sm={12} style={{ paddingLeft: 0 }}>
                    <BetslipContainer/>
                    <CustomerInfo/>
                </Col>
            </Row>
        </StyleSoccer>
    )
}
