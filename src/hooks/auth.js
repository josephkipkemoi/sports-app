import axios from '../lib/axios'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter();

    const { data: user, error, mutate } = useSWR('/api/user', () => 
        axios
            .get('api/user')
            .then(res => res.data)
            .catch(e => {
                if(e.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }) => {
        await csrf()

        setErrors([])

        axios
            .post('api/register', props)
            .then(() => mutate())
            .catch(e => {
                if(e.response.status !== 422) throw error

                setErrors(Object.values(e.response.data.errors).flat())
            })
    }


    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('api/login', props)
            .then(() => mutate())
            .catch(e => {
                if(e.response.status !== 422) throw error

                setErrors(Object.values(e.response.data.errors).flat())
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
        if (! error) {
            await axios
                    .post('api/logout')
                    .then(() => mutate())
        }

        window.location.pathname = '/'
    }
 
    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) router.push(redirectIfAuthenticated)
        if(middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout
    }

}

export default useAuth;