import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const CustomFixtureApi = createApi({
    reducerPath: 'CustomeFixtureApi',
    baseQuery: fetchBaseQuery({
        baseUrl:  `${ (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
        process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT : 
        process.env.NEXT_PUBLIC_BACKEND_URL}`
    }),
    endpoints: (builder) => ({
        getCustomFixtures: builder.query({
            query: () => '/api/fixtures'
        }),
        getCustomOdds: builder.query({
            query: () => '/api/odds'
        }),
        getV1CustomFixture: builder.query({
            query: (pageNum) => `api/custom_fixture?page=${pageNum}`
        }),
        getV1CustomFixtureById: builder.query({
            query: (fixture_id) => `api/custom_fixture/${fixture_id}`
        }),
        getFixtureIdsWhereOddsNull: builder.query({
            query: () => 'api/fixtures/ids'
        })
    })
})

export const {
    useGetCustomFixturesQuery,
    useGetCustomOddsQuery,
    useGetV1CustomFixtureQuery,
    useGetV1CustomFixtureByIdQuery,
    useGetFixtureIdsWhereOddsNullQuery,
} = CustomFixtureApi

