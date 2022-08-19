import React from "react";
import  Col from "react-bootstrap/Col";
import  Row from "react-bootstrap/Row";
import styled from "styled-components";
import CustomerInfo from "../components/CustomerInfo";
import CustomFilter from "../components/CustomFilter";
import TopNavBar from "../components/TopNavBar";
import BetslipContainer from "../components/BetslipContainer";
import GameComponent from "../components/GameComponent";
import axios from "../lib/axios";
const StyleSoccer = styled.div`
    height: auto;
`
export default function Soccer({ soccer_data }) {
    return (
        <StyleSoccer>
            <Row className="px-2">
                <Col lg={9} md={12} sm={12}>
                    <TopNavBar/>
                    <CustomFilter heading="Soccer"/>
                    <GameComponent data={soccer_data}/>
                </Col>
                <Col lg={3} md={12} sm={12} style={{ paddingLeft: 0 }}>
                    <BetslipContainer/>
                    <CustomerInfo/>
                </Col>
            </Row>
        </StyleSoccer>
    )
}

export async function getServerSideProps() {
    const  data  = await axios.get('api/custom_fixture')
  
     return {
      props: {
        soccer_data: data.data.fixtures,
      },  
    }
  }