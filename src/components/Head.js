import React from "react";
import Head from "next/head";
import config from '../../config.json';

export default ({
    
}) => {
    return (
        <Head>
            <title>{config.APP_NAME} | Kenya</title>
            <meta name="csrf-token" content="{{ csrf_token() }}"/> 
        </Head>
    )
}