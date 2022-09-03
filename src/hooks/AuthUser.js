import React, { useState } from "react";
import axios from "../lib/axios";

export default function AuthUser() {

    const getUser = async () => {
        const user = await axios.get('api/user')
   
        return user
    }
    // console.log(getUser())
    return {
         getUser
    }
}