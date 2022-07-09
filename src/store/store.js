import { configureStore } from "@reduxjs/toolkit";

import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { AdminApi } from "../hooks/admin";
import { BalanceApi } from "../hooks/balance";
import { BetslipApi } from "../hooks/betslip";
import { UserApi } from "../hooks/customAuth";
import { FavoritesApi } from "../hooks/favorites";
import { FixtureApi, CustomFixtureApi } from "../hooks/fixture";
import { HistoryApi } from "../hooks/history";
 
export const store = configureStore({
    reducer: {
        [BalanceApi.reducerPath]: BalanceApi.reducer,
        [FixtureApi.reducerPath]: FixtureApi.reducer,
        [CustomFixtureApi.reducerPath]: CustomFixtureApi.reducer,
        [BetslipApi.reducerPath]: BetslipApi.reducer,
        [UserApi.reducerPath]: UserApi.reducer,
        [HistoryApi.reducerPath]: HistoryApi.reducer,
        [FavoritesApi.reducerPath]: FavoritesApi.reducer,
        [AdminApi.reducerPath]: AdminApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false
    }).concat( 
        FixtureApi.middleware, 
        CustomFixtureApi.middleware, 
        BalanceApi.middleware,
        BetslipApi.middleware,
        UserApi.middleware,
        HistoryApi.middleware,
        FavoritesApi.middleware,
        AdminApi.middleware,
    )
})

setupListeners(store.dispatch);