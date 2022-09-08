import React, { useEffect } from "react";
import { useRouter } from "next/router"
import useAuth from "../hooks/auth";
import AuthUser from "../hooks/AuthUser";

export const withPublic = (WrappedComponent) => {

    return  (props) => {
        const { user } = useAuth({ middleware: 'guest', redirectIfAuthenticated: '/' })

        useEffect( () => {
  
        }, [user?.data])

        return  <WrappedComponent {...props}/>
    }
}

export const withProtected = (WrappedComponent) => {
    return (props) => {

      const { user } = useAuth({ middleware: 'guest', redirectIfNotAuthenticated: '/login' })
 
      useEffect(() => {

      }, [user])

      return <WrappedComponent {...props} />;
    };
  };