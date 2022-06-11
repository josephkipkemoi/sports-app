import { configureStore } from "@reduxjs/toolkit";

import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { BalanceApi } from "../hooks/balance";
import { BetslipApi } from "../hooks/betslip";
import { FixtureApi, CustomFixtureApi } from "../hooks/fixture";
 
export const store = configureStore({
    reducer: {
        [BalanceApi.reducerPath]: BalanceApi.reducer,
        [FixtureApi.reducerPath]: FixtureApi.reducer,
        [CustomFixtureApi.reducerPath]: CustomFixtureApi.reducer,
        [BetslipApi.reducerPath]: BetslipApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false
    }).concat( 
        FixtureApi.middleware, 
        CustomFixtureApi.middleware, 
        BalanceApi.middleware,
        BetslipApi.middleware,
    )
})

setupListeners(store.dispatch);