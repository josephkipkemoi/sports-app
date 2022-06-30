import axios from '../lib/axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter();
    const [userSession, setUserSession] = useState(null)

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const { data, error, mutate } = useSWR(`api/user`, async () => {
        // if(!!userSession) {
        //     const response = await axios.get(`api/user?us_s=${userSession}`)
        //     if(response.data.status === 200) {
        //         setIsAuthenticated(true)
        //     }
        //     return response.data.user[0]
        // }
      
        // .then(res => res.data)
        // .catch(e => {
        //     if(e.response.status !== 409) throw error

        //     router.push('/verify-email')
        // })

    }
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }) => {
        await csrf()
        setErrors([])
        axios
            .post('api/register', props)
            .then((d) => {
                console.log(d)
                localStorage.removeItem('u_s')
                localStorage.removeItem('u_i')
                localStorage.setItem('u_i',d.data.user_id)

               localStorage.setItem('u_s',d.data.session_payload)
               window.location.pathname = '/'
                mutate()
            })
            .catch(e => {
          
                if(e.response.status !== 422) throw error

                setErrors(Object.values(e.response.data.errors).flat())
            })
    }


    const login = async ({ setErrors, setIsLoading,...props }) => {
        await csrf()
         
        setErrors([])
        setIsLoading(true)
             axios
            .post('api/login', props)
            .then((d) => {
                mutate()
                if(d.status === 200)
                {
                localStorage.removeItem('u_s')
                localStorage.removeItem('u_i')
                localStorage.setItem('u_s',d.data.session_cookie)
                localStorage.setItem('u_i', d.data.session_uid)
                window.location.pathname = '/'
                setIsLoading(false)
                return true
                }

            })
            .catch(e => {
                if(e.response.status !== 422) throw error

                setErrors(Object.values(e.response.data.errors).flat())
               
                setIsLoading(false)
            }) 
 
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('api/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(e => {
                if (e.response.status !== 422) throw error

                setErrors(Object.values(e.response.data.errors).flat())
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('api/reset-password', { token: router.query.token, ...props })
            .then(response => router.push('/login?reset=' + btoa(response.data.status)))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(Object.values(error.response.data.errors).flat())
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('api/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        await csrf()
        if (! error) {
            await axios
                    .post('api/logout')
                    .then(() =>{
                        mutate()
                        })
        }
        localStorage.removeItem('u_i')
        localStorage.removeItem('u_s')
        localStorage.removeItem('share_code')
        window.location.pathname = '/'
    }
    
    function checkIfAuthenticated() {

        if(!!localStorage.getItem('u_s')) {
            setIsAuthenticated(true)
        }
    }
    useEffect(() => {
        // if( user === null) localStorage.removeItem('u_s')
        if (middleware === 'guest' && redirectIfAuthenticated && data?.user) router.push(redirectIfAuthenticated)
        if(middleware === 'auth' && error) logout()
        setUserSession(localStorage.getItem('u_s'))
      
        checkIfAuthenticated()

    }, [ error, data])

    return {
        user: data,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
        isAuthenticated
    }

}

export default useAuth;