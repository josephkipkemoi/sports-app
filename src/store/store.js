import { configureStore } from "@reduxjs/toolkit";

import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { BalanceApi } from "../hooks/balance";

export const store = configureStore({
    reducer: {
        [BalanceApi.reducerPath]: BalanceApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(BalanceApi.middleware)
})

setupListeners(store.dispatch);