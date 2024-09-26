import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const JackpotApi = createApi({
    reducerPath: 'JackpotApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl:  `${ (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
        process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT  : 
        process.env.NEXT_PUBLIC_BACKEND_URL}`,
    }), 
    endpoints: (builder) => ({
        getJackpotPrizeWins: builder.query({
            query: () => 'api/jackpot/prize'
        }),
        getJackpotMarket: builder.query({
            query: () => 'api/jackpots/markets/view'
        }),
        getJackpotMarketGames: builder.query({
            query: (market_id) => `api/jackpots/${market_id}/games`
        })
    })
})

export const {
    useGetJackpotPrizeWinsQuery,
    useGetJackpotMarketQuery,
    useGetJackpotMarketGamesQuery,
} = JackpotApi