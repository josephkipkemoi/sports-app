import { createApi,  fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const GamesApi = createApi({
    reducerPath: 'GamesApi',
 
    baseQuery: fetchBaseQuery( { baseUrl: "https://v3.football.api-sports.io/fixtures" } ),
    endpoints: (builder) => ({
        getFixturesByDate: builder.query({
            query: (date) => ({
                url: `?date=${date}`,
                method: 'GET',
                headers: {
                    'x-rapidapi-host': 'v3.football.api-sports.io',
                    'x-rapidapi-key': 'b2c138608fmsh6567bc9b793b465p1a4945jsnb15afccb7248'
                }
            })
        })
    })
})


export const {
    useGetFixturesByDateQuery,
} = GamesApi