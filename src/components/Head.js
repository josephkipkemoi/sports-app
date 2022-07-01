import React from "react";
import Head from "next/head";

export default ({
    
}) => {
    return (
        <Head>
            <title>Bet360 | KE</title>
            <meta name="csrf-token" content="{{ csrf_token() }}"/>
        </Head>
    )
}