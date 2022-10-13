import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const AdminApi = createApi({
    reducerPath: 'AdminApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl:  `${ (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
        process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT : 
        process.env.NEXT_PUBLIC_BACKEND_URL}`,
    }), 
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: (page) => `api/admin/users?page=${page}`
        }),
        getAdminUserBalanceById: builder.query({
            query: (user_id) => `api/admin/users/${user_id}/profile`
        }),
        getAllFixturesIds: builder.query({
            query: () => 'api/admin/fixtures/ids'
        }),
        getAllCustomerMessages: builder.query({
            query: () => 'api/support/messages'
        }),
        getJackpotFixtures: builder.query({
            query: (market) => `api/jackpot?jp_market=${market}`
        })
    })
})

export const {
     useGetAllUsersQuery,
     useGetAdminUserBalanceByIdQuery,
     useGetAllFixturesIdsQuery,
     useGetAllCustomerMessagesQuery,
     useGetJackpotFixturesQuery,
} = AdminApi

