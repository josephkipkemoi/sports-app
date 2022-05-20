import React from "react";
import { Nav } from "react-bootstrap";
import Data from './JsonData/Games.json';

export default function Leagues(props) {
    const {response} = Data;

    const LeagueNames = () => {
      return  response.map(({league}, key) => {
            console.log(league);
            const {country, name, logo, flag} = league;
            return (
                <>
                    <Nav.Item>
                        <Nav.Link className="d-block">{name}</Nav.Link>
                    </Nav.Item>
                </>
            )
        })
    }
    return (
        <>
            <h4>Leagues</h4>
            <Nav className="flex-column">
                <LeagueNames/>
            </Nav>
           
        </>
    )
}