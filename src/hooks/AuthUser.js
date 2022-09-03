import React from "react";

export default function AuthUser() {
    if(Boolean(JSON.parse(localStorage.getItem('uu_id'))) == false) {
        return {
            uu_id: ''
        }
    }
    return JSON.parse(localStorage.getItem('uu_id'))
}