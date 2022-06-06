import { configureStore } from "@reduxjs/toolkit";

import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { BalanceApi } from "../hooks/balance";
import { FixtureApi, CustomFixtureApi } from "../hooks/fixture";
 
export const store = configureStore({
    reducer: {
        [BalanceApi.reducerPath]: BalanceApi.reducer,
        [FixtureApi.reducerPath]: FixtureApi.reducer,
        [CustomFixtureApi.reducerPath]: CustomFixtureApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false
    }).concat(FixtureApi.middleware, CustomFixtureApi.middleware, BalanceApi.middleware)
})

setupListeners(store.dispatch);