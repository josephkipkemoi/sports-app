import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const HistoryApi = createApi({
    reducerPath: 'HistoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users`
    }),
    endpoints: (builder) => ({
        getAllUserHistoryBetslip: builder.query({
            query: (user_id) => `${user_id}/betslips`
        }),
        getSettledHistoryBetslip: builder.query({
            query: (user_id) => `betslips/status?user_id=${user_id}&bet_status=Lost`
        }),
        getUnsettledHistoryBetslip: builder.query({
            query: (user_id) => `betslips/status?user_id=${user_id}&bet_status=Active`
        }),
        removeSingleHistoryBetslip: builder.query({
            query: (user_id, session_id) => `betslips/delete?user_id=${user_id}&session_id=${session_id}`
        }),
        getBetSessionFixtures: builder.query({
            query: (session_id) => `sessions/${session_id}/history`
        })
    })
})

export const {
    useGetAllUserHistoryBetslipQuery,
    useGetSettledHistoryBetslipQuery,
    useGetUnsettledHistoryBetslipQuery,
    useRemoveSingleHistoryBetslipQuery,
    useGetBetSessionFixturesQuery,
} = HistoryApi