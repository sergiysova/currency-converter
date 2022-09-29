import {configureStore} from "@reduxjs/toolkit";
import ratesReducer from './ratesSlice';

const store = configureStore({
    reducer: {
        rates: ratesReducer
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;