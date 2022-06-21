import axios from '../lib/axios';
import configData from '../../config.json';
import { useGetCustomFixturesQuery, useGetOddsFixtureQuery } from './fixture';
import { useEffect, useState } from 'react';

const useCustomOdds = () => {

    const { data , isLoading, error} = useGetCustomFixturesQuery()
    
    if(error)
    {
        console.error(error)
    }

    if(isLoading)
    {
        console.info('loading')
    }
    const [counter, setCounter] = useState(0)
    let parsedIds = []

    if(!!data?.fixture_id){
        const parsed = JSON.parse(data.fixture_id)
         
        parsedIds.push(...parsed)
    }
  
    const oddsData = useGetOddsFixtureQuery(parsedIds[counter])
    if(oddsData.status === 'fulfilled')
    {
        const { data: { response } } = oddsData
        const [ bookmaker,  ] = response;
  
        axios
        .post('https://infinite-coast-08848.herokuapp.com/api/odds', {
            data: [bookmaker]
        })
        .then(d => d)
        .catch(e => console.error(e))
    }
 
    // console.log(oddsData)
    // if(!!oddsData?.data?.response && !!data?.fixture_id)
    // {
    //     console.log(oddsData?.data?.response)
    // }

    useEffect(() => {
        const startint = setInterval(() => {
            setCounter(counter + 1)
        },2000)

        if(counter === 49) clearInterval(startint)

        return () => clearInterval(startint)
 
    },[counter])
 
   
   
    const getOdds = (fixture_id) => {

        axios
            .get(`https://api-football-v1.p.rapidapi.com/v3/odds?fixture=${fixture_id}&bookmaker=8`,{ 
            headers: {
                'X-RapidAPI-Host': configData.SPORTS_RADAR_HOST,
                'X-RapidAPI-Key': configData.SPORTS_RADAR_KEY
            }})
            .then(d => d)
            .catch(e => console.error(e.message))

    }

    return {
        getOdds
    }
}

export default useCustomOdds;