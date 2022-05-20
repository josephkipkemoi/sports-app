import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { GamesApi } from "../hooks/GamesHook";

export const store = configureStore({
    reducer: {
        [GamesApi.reducerPath] : GamesApi.reducer
    }
})

setupListeners(store.dispatch)