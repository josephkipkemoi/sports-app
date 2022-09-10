import React, { useEffect } from "react";
import { useRouter } from "next/router"
import useAuth from "../hooks/auth";
import AuthUser from "../hooks/AuthUser";

export const withPublic = (WrappedComponent) => {

    return  (props) => {
      const user = AuthUser()
      const router = useRouter()

      useEffect(() => {
        if(Boolean(user?.uu_id?.id) === true) {
            router.replace('/')          
        }
        return undefined
      }, [user?.uu_id?.id])

        return  <WrappedComponent {...props}/>
    }
}

export const withProtected = (WrappedComponent) => {
    return (props) => {
      const user = AuthUser()
      const router = useRouter()

      useEffect(() => {
        if(Boolean(user?.uu_id?.id) === false) {
            router.replace('/login')          
        }
        return undefined
      }, [user?.uu_id?.id])

      return <WrappedComponent {...props} />;
    };
  };