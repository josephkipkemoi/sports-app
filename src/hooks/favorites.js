import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const FavoritesApi = createApi({
    reducerPath: 'FavoritesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}api`
    }),
    endpoints: (builder) => ({
        getFavoritesById: builder.query({
            query: (user_id) => `users/${user_id}/favorites`
        })
    })
})

export const {
    useGetFavoritesByIdQuery,
} = FavoritesApi