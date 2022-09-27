import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const NotificationsApi = createApi({
    reducerPath: 'NotificationsApi',
    baseQuery: fetchBaseQuery({
        baseUrl:  `${ (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
        process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT + 'api' : 
        process.env.NEXT_PUBLIC_BACKEND_URL + 'api'}`
    }),
    endpoints: (builder) => ({
        getUnreadNotifications: builder.query({
            query: (user_id) => `notitifications/users?u_id=${user_id}`
        })
    })
})

export const {
    useGetUnreadNotificationsQuery,
} = NotificationsApi