import React from "react";
import  Col from "react-bootstrap/Col";
import  Row from "react-bootstrap/Row";
import styled from "styled-components";
import CustomerInfo from "../components/CustomerInfo";
import CustomFilter from "../components/CustomFilter";
import TopNavBar from "../components/TopNavBar";
import BetslipContainer from "../components/BetslipContainer";

const StyleSchedule = styled.div`
    height: 100vh;
`
export default function Baseball() {
    return (
        <StyleSchedule>
        <Row className="px-2">
            <Col lg={9} md={12} sm={12}>
                <TopNavBar/>
                <CustomFilter heading="Schedule"/>
                <ScheduleContainer/>
            </Col>
            <Col lg={3} md={12} sm={12} style={{ paddingLeft: 0 }}>
                <BetslipContainer/>
                <CustomerInfo/>
            </Col>
        </Row>
        </StyleSchedule>
    )
}

const StyleScheduled = styled.div`
    color: white;
`
const days = [
    {
        day: 'All'
    },
    {
        day: 'Monday'
    },
    {
        day: 'Tuesday'
    },
    {
        day: 'Wednesday'
    },
    {
        day: 'Thursday'
    },
    {
        day: 'Friday'
    },
    {
        day: 'Saturday'
    },
    {
        day: 'Sunday'
    },
]
const ScheduleContainer = () => {

    const DayItems = (link, i) => {
        return (
                <span key={i}>{link.day}</span>
        )
    }
    return (
        <StyleScheduled>
            <nav className="d-flex justify-content-between p-2">
                {days.map(DayItems)}
            </nav>
        </StyleScheduled>
    )
}