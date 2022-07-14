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
            query: () => `api/admin/users`
        }),
        getAdminUserBalanceById: builder.query({
            query: (user_id) => `api/admin/users/${user_id}/profile`
        }),
        getAllFixturesIds: builder.query({
            query: () => 'api/admin/fixtures/ids'
        }),
        getAllCustomerMessages: builder.query({
            query: () => 'api/support/messages'
        })
    })
})

export const {
     useGetAllUsersQuery,
     useGetAdminUserBalanceByIdQuery,
     useGetAllFixturesIdsQuery,
     useGetAllCustomerMessagesQuery,
} = AdminApi

