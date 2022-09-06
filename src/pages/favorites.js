import React, { useEffect } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { useGetFavoritesByIdQuery } from "../hooks/favorites";
import TopNavBar from "../components/TopNavBar";
import CustomerInfo from "../components/CustomerInfo";
import CustomFilter from "../components/CustomFilter";
import GameComponent from "../components/GameComponent";
import BetslipContainer from "../components/BetslipContainer";
import axios from "../lib/axios";
import AuthUser from "../hooks/AuthUser";

const StyledFavorites = styled.div`
 height: 100vh;
 overflow-y: scroll;
 overflow-x: hidden;
 background-color: #ebeded;
 h5 {
    margin-left: 1rem;
    margin-top: 2px;
 }

`
export default function Favorites() {

    const { uu_id } = AuthUser()

    const { data, error, isLoading, refetch } = useGetFavoritesByIdQuery(uu_id.id)
    
    if(error) {
        return <span>Error</span>
    }
    
    if(isLoading) {
        return <Spinner animation="grow"/>
    }
    
    const removeFavorites = async () => {
        const { status } = await axios.delete(`api/users/${uu_id.id}/favorites/remove`)
        
        if(status === 200) {
            refetch()
        }
    }
  
    return (
        <StyledFavorites >
            <Row className="px-2">
                <Col lg={9} md={12} sm={12}>
                    <TopNavBar/>
                    <CustomFilter heading="Favorites" refetch={refetch}/>
                 
                    {data?.length > 0 ? <GameComponent data={data} refetch={refetch} /> : <NoFavorites/>}   
                    {data.length > 0 ?
                     <button 
                     className="btn btn-warning"
                     onClick={removeFavorites}
                    >
                        Remove Favorites
                    </button>  : ''
                    }
                               
                </Col>
                <Col lg={3} md={12} sm={12} style={{ paddingLeft: 0 }}>
                    <BetslipContainer/>
                    <CustomerInfo/>
                </Col>
            </Row>
          
        </StyledFavorites>
    )
}

const NoFavorites = () => {
    return (
        <StyledFavorites className='text-center mt-5'>
            <span className='text-dark'>You do not have any favorites</span>
        </StyledFavorites>
    )
}