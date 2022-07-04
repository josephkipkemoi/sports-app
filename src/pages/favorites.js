import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useGetFavoritesByIdQuery } from "../hooks/favorites";

export default function() {

    const [userId, setUserId] = useState(null)

    const { data, error, isLoading } = useGetFavoritesByIdQuery(2)
    
    if(error) {
        return <span>Error</span>
    }
    
    if(isLoading) {
        return <Spinner animation="grow"/>
    }

    

    return (
        <>
            <h1>Favorites</h1>
        </>
    )
}