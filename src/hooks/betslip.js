
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react"

export const BetslipApi = createApi({
    reducerPath: 'BetslipApi',
    baseQuery: fetchBaseQuery({
        baseUrl:process.env.NEXT_PUBLIC_BACKEND_URL,
    }),
    refetchOnFocus: true,
    endpoints: (builder) => ({
        getBetslip: builder.query({
            query: (session_id) => `api/betslips/${session_id}`,          
        }),
        removeSingleBetslip: builder.query({
            query: (fixture_id) => `api/fixtures/${fixture_id}`
        }),
        removeAllBetlslip: builder.query({
            query: (session_id) => `api/sessions/${session_id}`
        }),
        getAllBetHistory: builder.query({
            query: (user_id) => `api/users/${user_id}/betslips`
        })
    })
})

export const {
    useGetBetslipQuery,
    useRemoveAllBetlslipQuery,
    useRemoveSingleBetslipQuery,
    useGetAllBetHistoryQuery,
} = BetslipApi