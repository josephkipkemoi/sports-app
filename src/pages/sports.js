import React from "react";
import App from ".";
import axios from "../lib/axios";
export default function Sports({ data }) {
    return (
        <App data={data}/>
    )
}

export async function getServerSideProps(context) {
    const  data  = await axios.get('api/custom_fixture')
     
     return {
      props: {
        data: data.data.fixtures
      },  
    }
  }