import React from "react";

const AuthUser = () => {
    if(Boolean(JSON.parse(localStorage.getItem('uu_id'))) == false) {
        return {
            uu_id: ''
        }
    } 
    if(Boolean(JSON.parse(localStorage.getItem('uu_id')))) {
        return JSON.parse(localStorage.getItem('uu_id'))
    }
}

export default AuthUser;