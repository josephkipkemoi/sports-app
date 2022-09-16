import axios from "../lib/axios";

const useSocialShare = () => {
    const csrf = async () => axios.get('/sanctum/csrf-cookie')

    const getSocialShareLinks = async (session_id) => {
        await csrf()
     
        const res = await axios.get(`api/social-share?betSession=${session_id}`)
        if(res.status === 200)
        return res.data
    }

    return {
        getSocialShareLinks
    }
}

export default useSocialShare;