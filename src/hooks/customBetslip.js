import axios from "../lib/axios";


const useCustomBetslip = () => {
 

    const postBetslip = async (props) => {
 
       const res = await axios.post('api/betslips', props)

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