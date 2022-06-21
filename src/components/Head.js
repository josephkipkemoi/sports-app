import React from "react";
import Head from "next/head";

export default ({
    
}) => {
    return (
        <Head>
            <title>Sports App</title>
            <meta name="csrf-token" content="{{ csrf_token() }}"/>
        </Head>
    )
}