import React from "react";
import Container  from "react-bootstrap/Container";
import styled from "styled-components";

const StyleNotifications = styled.div`
    height: 100vh;
    background: #fff;
`

export default function Notifications() {

    const EmptyNotifications = () => {
        return (
            <div className="d-flex justify-content-center mt-5">
                <small>You do not have any notifications</small>
            </div>
        )
    }
    return (
        <StyleNotifications>
            <Container >
                <div className="pt-3">
                    <h5 className="fw-bold">All Notifications</h5>
                    <span className="text-danger fw-bold d-block">Mark all as read</span>
                    <EmptyNotifications/>
                </div>
            </Container>
        </StyleNotifications>
    )
}