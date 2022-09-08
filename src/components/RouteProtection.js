import React, { useEffect } from "react";
import { useRouter } from "next/router"
import useAuth from "../hooks/auth";

export const withPublic = (WrappedComponent) => {

    return  (props) => {
        const router = useRouter()
        const { user } = useAuth({ middleware: 'guest'   })

        useEffect( () => {
            if(Boolean(user?.data)) {
                router.replace('/')
                return null;
            }
        }, [user?.data])

        return  <WrappedComponent {...props}/>
    }
}

export const withProtected = (WrappedComponent) => {
    return (props) => {
      const router = useRouter()
      const { user } = useAuth({ middleware: 'guest' })
 
      useEffect(() => {
        if(Boolean(user?.data) === false) {
          router.replace('/login')
          return null;
        }
        return null;
      }, [user?.data])

      return <WrappedComponent {...props} />;
    };
  };