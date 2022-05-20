import React, { useState } from "react";
import Data from './JsonData/Games.json';
import Leagues  from "./Leagues";
import { Row, Col, Container } from "react-bootstrap";

export const Fixture = () => {
    const [leagues, setLeagues] = useState([]);

    const { response } = Data;
  
    const TeamFixtures = () => {
       response.map(data => {
           
            // setLeagues(prev => prev.concat(data.league))
       })
   }
    return (
        <Container>
            <Row>
                <Col>
                    <Leagues />
                </Col>
                <Col>
                    <h1>Today's Fixtures</h1>
                    <TeamFixtures/>
                </Col>
            </Row>
        </Container>
    )
}