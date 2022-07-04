import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import configData from '../../config.json';

export const FixtureApi = createApi({
    reducerPath: 'FixtureApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'https://api-football-v1.p.rapidapi.com/v3/',
        prepareHeaders: (headers) => {
            headers.set('X-RapidAPI-Host', configData.SPORTS_RADAR_HOST)
            headers.set('X-RapidAPI-Key', configData.SPORTS_RADAR_KEY)
            return headers
        } 
    }), 
    endpoints: (builder) => ({
        getFixtures: builder.query({
            query: () => `fixtures?next=50`
        }),
        getOddsFixture: builder.query({
            query: (id) => `odds?fixture=${id}&bookmaker=8`
        }),
        getFixtureById: builder.query({
            query: (id) => `${id}` 
        })
    })
})

export const CustomFixtureApi = createApi({
    reducerPath: 'CustomeFixtureApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    }),
    endpoints: (builder) => ({
        getCustomFixtures: builder.query({
            query: () => '/api/fixtures'
        }),
        getCustomOdds: builder.query({
            query: () => '/api/odds'
        }),
        getV1CustomFixture: builder.query({
            query: () => 'api/custom_fixture'
        }),
        getV1CustomFixtureById: builder.query({
            query: (fixture_id) => `api/custom_fixture/${fixture_id}`
        })
    })
})

export const {
    useGetCustomFixturesQuery,
    useGetCustomOddsQuery,
    useGetV1CustomFixtureQuery,
    useGetV1CustomFixtureByIdQuery,
} = CustomFixtureApi

export const {
    useGetFixturesQuery,
    useGetOddsFixtureQuery,
} = FixtureApi