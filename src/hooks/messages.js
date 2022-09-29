import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const MessageApi = createApi({
    reducerPath: 'MessageApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl:  `${ (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
        process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT : 
        process.env.NEXT_PUBLIC_BACKEND_URL}`,
    }), 
    endpoints: (builder) => ({
        getAdminMessages: builder.query({
            query: (phone_number) => `api/users/messages?phone_number=${phone_number}`
        }),
        getUserMessageById: builder.query({
            query: (id) => `api/users/messages/show?id=${id}`
        }),
    })
})

export const {
    useGetAdminMessagesQuery,
    useGetUserMessageByIdQuery,
} = MessageApi