import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const BalanceApi = createApi({
    reducerPath: 'BalanceApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/' }), 
    endpoints: (builder) => ({
        getBalanceByUserId: builder.query({
            query: (user_id) => `users/${user_id}/balance`
        })
    })
})

export const {
    useGetBalanceByUserIdQuery
} = BalanceApi