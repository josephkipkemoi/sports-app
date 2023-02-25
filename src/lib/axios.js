import Axios from "axios";

const axios = Axios.create({
    baseURL: `${ (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
              process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT : 
              process.env.NEXT_PUBLIC_BACKEND_URL}`,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    }
    // withCredentials: true
})
export default axios