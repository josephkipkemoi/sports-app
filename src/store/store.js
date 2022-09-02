import { configureStore } from "@reduxjs/toolkit";

import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { AdminApi } from "../hooks/admin";
import { BalanceApi } from "../hooks/balance";
import { BetslipApi } from "../hooks/betslip";
import { UserApi } from "../hooks/customAuth";
import { FavoritesApi } from "../hooks/favorites";
import { CustomFixtureApi } from "../hooks/fixture";
import { HistoryApi } from "../hooks/history";
import { JackpotApi } from "../hooks/jackpot";
import { LiveFixturesApi } from "../hooks/liveFixtures";
 
export const store = configureStore({
    reducer: {
        [BalanceApi.reducerPath]: BalanceApi.reducer,
        [CustomFixtureApi.reducerPath]: CustomFixtureApi.reducer,
        [BetslipApi.reducerPath]: BetslipApi.reducer,
        [UserApi.reducerPath]: UserApi.reducer,
        [HistoryApi.reducerPath]: HistoryApi.reducer,
        [FavoritesApi.reducerPath]: FavoritesApi.reducer,
        [AdminApi.reducerPath]: AdminApi.reducer,
        [LiveFixturesApi.reducerPath]: LiveFixturesApi.reducer,
        [JackpotApi.reducerPath]: JackpotApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false
    }).concat( 
        CustomFixtureApi.middleware, 
        BalanceApi.middleware,
        BetslipApi.middleware,
        UserApi.middleware,
        HistoryApi.middleware,
        FavoritesApi.middleware,
        AdminApi.middleware,
        LiveFixturesApi.middleware,
        JackpotApi.middleware,
    )
})

setupListeners(store.dispatch);