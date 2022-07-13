import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const UserApi = createApi({
    reducerPath: 'UserApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${ (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
        process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT+'api/users' : 
        process.env.NEXT_PUBLIC_BACKEND_URL+'api/users'}`,
    }),
    endpoints: (builder) => ({
        getAuthUser: builder.query({
            query: (user_id) => `auth_user?auth_id=${user_id}`
        })
    })
})

export const {
    useGetAuthUserQuery,
} = UserApi