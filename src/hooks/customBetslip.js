import axios from "../lib/axios";
import useSWR , {mutate} from "swr";
import { useEffect, useState } from "react";

const useCustomBetslip = () => {

    // const {data, error, isValidating} = useSWR('api/betslips', async () => {
    //     const response =  await axios.get(`api/betslips/${session_id}`)

    //     return response.data
    // })
 

    const postBetslip = async (props) => {
 
       const res = await axios.post('api/betslips', props)
    //    axios
    //         .post('api/betslips', props)
    //         .then(d => d)
    //         .catch(e => console.error(e.message))
        return res.status
    }

    const getBetslip =  (session_id) => {

            const response =   axios.get(`api/betslips/${session_id}`)
       
            return response.data
      
    }

    return {
        postBetslip,
        getBetslip,
    }
}

export default useCustomBetslip;