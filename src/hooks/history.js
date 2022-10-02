import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const HistoryApi = createApi({
    reducerPath: 'HistoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl:  `${ (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
        process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT + 'api/users' : 
        process.env.NEXT_PUBLIC_BACKEND_URL + 'api/users' }`
    }),
    endpoints: (builder) => ({
        getAllUserHistoryBetslip: builder.query({
            query: (user_id) => `${user_id}/betslips`
        }),
        getAllUserHistoryBetslipV1: builder.query({
            query: ({user_id, pageNumber}) => `fixtures/carts?page=${pageNumber}&user_id=${user_id}&bet_status=All`            
        }),
        getSettledHistoryBetslip: builder.query({
            query: ({user_id, pageNumber}) => `fixtures/carts?page=${pageNumber}&user_id=${user_id}&bet_status=Settled`
        }),
        getUnsettledHistoryBetslip: builder.query({
            query: ({user_id, pageNumber}) => `fixtures/carts?page=${pageNumber}&user_id=${user_id}&bet_status=Unsettled`
        }),
        removeSingleHistoryBetslip: builder.query({
            query: ({user_id, cart_id}) => `fixtures/carts/delete?user_id=${user_id}&cart_id=${cart_id}`
        }),
        getBetSessionFixtures: builder.query({
            query: ({ userId, pid }) => `${userId}/sessions/${pid}/history`
        }),
        getMegaJackpotHistory: builder.query({
            query: ({ user, market }) => `jackpot/${user}/history?jp=${market}`
        })
    })
})

export const {
    useGetAllUserHistoryBetslipQuery,
    useGetAllUserHistoryBetslipV1Query,
    useGetSettledHistoryBetslipQuery,
    useGetUnsettledHistoryBetslipQuery,
    useRemoveSingleHistoryBetslipQuery,
    useGetBetSessionFixturesQuery,
    useGetMegaJackpotHistoryQuery,
} = HistoryApi