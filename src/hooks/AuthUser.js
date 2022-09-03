import React from "react";

export default function AuthUser() {
    return JSON.parse(localStorage.getItem('uu_id'))
}