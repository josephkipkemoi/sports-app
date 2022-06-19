
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react"

export const BetslipApi = createApi({
    reducerPath: 'BetslipApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/',
    }),
    refetchOnFocus: true,
    endpoints: (builder) => ({
        getBetslip: builder.query({
            query: (session_id) => `betslips/${session_id}`,          
        }),
        removeSingleBetslip: builder.query({
            query: (fixture_id) => `fixtures/${fixture_id}`
        }),
        removeAllBetlslip: builder.query({
            query: (session_id) => `sessions/${session_id}`
        }),
        getAllBetHistory: builder.query({
            query: (user_id) => `users/${user_id}/betslips`
        })
    })
})

export const {
    useGetBetslipQuery,
    useRemoveAllBetlslipQuery,
    useRemoveSingleBetslipQuery,
    useGetAllBetHistoryQuery,
} = BetslipApi