import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useGetBalanceByUserIdQuery } from "../hooks/balance";

export default function UserBalance({ user_id, type }) {
    
    const { data, error, isLoading, refetch } = useGetBalanceByUserIdQuery(user_id)

    if(error) {
        return <span className="d-block fw-bold text-danger mt-1">Error</span>
    }

    if(isLoading) {
        return <Spinner className="d-block mt-2 pb-3" animation="grow" size="sm"/>
    }
    
    return (
        <div className="d-flex align-items-center">
            <FontAwesomeIcon  
                icon={faRefresh} 
                style={{ paddingRight: '.25rem', paddingLeft: '.25rem', cursor: 'pointer' }} 
                className="btn"
                onClick={refetch}
            />
            <span className="text-dark amount fw-bold">
                Kes {type === 'regular' && data?.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }                 
                {type === 'bonus' && data?.bonus.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) }                 
            </span> 
        </div>
         
    )
}