import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface SearchState {
    searchTerm: string;
}

const initialState: SearchState = {
    searchTerm: '',
};

const dataSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
    },
});

export const { setSearchTerm } = dataSlice.actions;
export default dataSlice.reducer;