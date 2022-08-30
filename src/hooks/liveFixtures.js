import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const LiveFixturesApi = createApi({
    reducerPath: 'LiveFixturesApi',
    baseQuery: fetchBaseQuery({
        baseUrl:  `${ (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
        process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT + 'api/fixtures' : 
        process.env.NEXT_PUBLIC_BACKEND_URL + 'api/fixtures' }`
    }),
    endpoints: (builder) => ({
        getAllLiveFixtures: builder.query({
           query:  (query) => `live?fixtures=${query}`
        }),
    })
})

export const {
    useGetAllLiveFixturesQuery,
} = LiveFixturesApi