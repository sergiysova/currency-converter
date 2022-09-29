import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import {fetchSymbols, fetchRates} from '../api/rates';
import {CurrenciesType, RatesType} from "../types";

interface RatesState {
    rates: RatesType,
    currencies: CurrenciesType | null,
        status: {
        loading: boolean,
            error: boolean
    }
}

const initialState: RatesState = {
    rates: {},
    currencies: null,
    status: {
        loading: false,
        error: false
    }
}

export const getCurrencies = createAsyncThunk(
    'rates/fetchSymbols',
    async (_: void, { rejectWithValue }) => {
        try {
            const data = await fetchSymbols();
            return data;
        } catch (err) {
            return rejectWithValue([]);
        }
    }
)

export const getRates = createAsyncThunk(
    'rates/fetchRates',
    async (base: string, { rejectWithValue }) => {
        try {
            const data = await fetchRates(base);
            return data;
        } catch (err) {
            return rejectWithValue([]);
        }
    }
)

export const ratesSlice = createSlice({
    name: 'rates',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCurrencies.fulfilled, (state: RatesState, {payload}: any) => {
            if (payload.success) {
                state.currencies = payload.symbols;
                state.status = {
                    loading: false,
                    error: false
                }
            } else {
                state.status = {
                    loading: false,
                    error: true
                }
            }
        })
        builder.addCase(getCurrencies.pending, (state: RatesState) => {
            state.status = {
                loading: true,
                error: false
            }
        })
        builder.addCase(getCurrencies.rejected, (state: RatesState) => {
            state.status = {
                loading: false,
                error: true
            }
        })
        builder.addCase(getRates.fulfilled, (state: RatesState, {payload}: any) => {

            if (payload.success) {
                state.rates[payload.base] = payload.rates;
                state.status = {
                    loading: false,
                    error: false
                }
            } else {
                state.status = {
                    loading: false,
                    error: true
                }
            }
        })
        builder.addCase(getRates.pending, (state: RatesState) => {
            state.status = {
                loading: true,
                error: false
            }
        })
        builder.addCase(getRates.rejected, (state: RatesState) => {
            state.status = {
                loading: false,
                error: true
            }
        })

    }
})

export default ratesSlice.reducer