import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import configData from '../../config.json';

export const BalanceApi = createApi({
    reducerPath: 'BalanceApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:8000/api/',
        prepareHeaders: (headers) => {
            headers.set('x-sportsapp-key', configData.SPORTS_APP_KEY)

            return headers
        } 
    }), 
    endpoints: (builder) => ({
        getBalanceByUserId: builder.query({
            query: (user_id) => `users/${user_id}/balance`
        })
    })
})

export const {
    useGetBalanceByUserIdQuery
} = BalanceApi