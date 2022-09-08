import React from "react";
import { withPublic } from "../components/RouteProtection";
import useAuth from "../hooks/auth";

const Login = () => {
    const { login } = useAuth({ middleware: 'guest', redirectIfAuthenticated: '/' })
    return (
        <>
            <h1>Log In</h1>
        </>
    )
}

export default Login