import React from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { useGetFavoritesByIdQuery } from "../hooks/favorites";
import TopNavBar from "../components/TopNavBar";
import CustomerInfo from "../components/CustomerInfo";
import CustomFilter from "../components/CustomFilter";

const StyledFavorites = styled.div`
 height: 100vh;
 h5 {
    margin-left: 1rem;
    margin-top: 2px;
 }

`
export default function Favorites() {

    const { data, error, isLoading } = useGetFavoritesByIdQuery(2)
    
    if(error) {
        return <span>Error</span>
    }
    
    if(isLoading) {
        return <Spinner animation="grow"/>
    }

    return (
        <StyledFavorites >
            <Row className="px-2">
                <Col lg={9} md={12} sm={12}>
                    <TopNavBar/>
                    <CustomFilter heading="Favorites"/>
                    <div className='text-center mt-5'>
                        <span className='text-light'>You do not have any favorites</span>
                    </div>
                </Col>
                <Col lg={3} md={12} sm={12} style={{ paddingLeft: 0 }}>
                    <CustomerInfo/>
                </Col>
            </Row>
          
        </StyledFavorites>
    )
}