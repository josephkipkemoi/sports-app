import axios from '../lib/axios'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const useAuth = ({ middleware, redirectIfAuthenticated, redirectIfNotAuthenticated } = {}) => {
    const router = useRouter();

    const { data, error, mutate } = useSWR(`api/user`, async () => {
        const user = axios.get('api/user');
   
        if(user.data) {
            setIsAuthenticated(true)
        }

        return user
    }
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, setRegisterLoading, ...props }) => {
        await csrf()
        setErrors([])
        axios
            .post('api/register', props)
            .then((d) => {
               localStorage.setItem('uu_id', JSON.stringify(d.data))
               setRegisterLoading(false)
                window.location.pathname = '/'
                mutate()
            })
            .catch(e => {
                if(e.response.status === 500) {
                    setErrors(['Duplicate mobile number detected, please log in to continue'])
                } else if(e.status !== 422) {
                    setErrors(Object.values(e.response.data.errors).flat())
                }
                setRegisterLoading(false)
            })
    }


    const login = async ({ setErrors, setIsLoading, setIsAuth, ...props }) => {
        await csrf()
         
        setErrors([])
        setIsLoading(true)
             axios
            .post('api/login', props)
            .then((r) =>{
                 mutate()
                 if(r.status === 200) {
                   localStorage.setItem('uu_id', JSON.stringify(r.data))
                   setIsLoading(false)
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
        localStorage.removeItem('uu_id')
        localStorage.removeItem('share_code')
        window.location.pathname = '/'
    }

    useEffect(() => {

        if (middleware === 'guest' && redirectIfAuthenticated && data?.data) router.push(redirectIfAuthenticated)
        if (middleware === 'guest' && redirectIfNotAuthenticated && Boolean(data?.data) === false ) router.push(redirectIfNotAuthenticated)
        if(middleware === 'auth' && error) logout()
      
    }, [ error, data?.data])

    return {
        user: data,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }

}

export default useAuth;