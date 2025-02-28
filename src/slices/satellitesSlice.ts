// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api';
import { setId, setSatellitesCount, addSatelliteToLaunch as draftAddSatelliteToLaunch, setLaunchId } from './draftSlice';
import { SATELLITES_MOCK } from '../modules/mock';
import { Satellite } from "../api/Api.ts";
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { FETCH_SATELLITE, CREATE_SATELLITE } from '../graphQL';

const client = new ApolloClient({
    uri: 'https://localhost:8000/graphql',
    cache: new InMemoryCache(),
});

interface SatellitesState {
    satellite_title: string;
    satellites: Satellite[];
    currentSatellite: Satellite | null;
    satCount: number;
    loading: boolean;
    error: string | null;
    launchid: number;
}

const initialState: SatellitesState = {
    satellite_title: '',
    satellites: [],
    currentSatellite: null,
    satCount: 0,
    loading: false,
    error: null,
    launchid: 0,
};

export const fetchSatellite = createAsyncThunk(
    'satellite/fetchSatellite',
    async (satellite_id: number, { rejectWithValue }) => {
        try {
            const response = await client.query({
                query: FETCH_SATELLITE,
                variables: { id: satellite_id },
            });

            const satellite = response.data.satellite;
            return {
                satellite_id: satellite.satelliteId,
                title: satellite.title,
                description: satellite.description,
                full_desc: satellite.fullDesc,
                image_url: satellite.imageUrl,
                weight: satellite.weight,
                orbit: satellite.orbit,
                expected_date: satellite.expectedDate
            };
        } catch {
            return rejectWithValue('Не удалось загрузить данные спутника')
        }
    }
);

export const createSatellite = createAsyncThunk<
    Satellite,
    { title: string; expectedDate: Date; weight: number; orbit: string; fullDesc: string; description: string; imageUrl: string },
    { rejectValue: string }
>(
    'satellites/createSatellite',
    async ({ title, expectedDate, weight, orbit, fullDesc, description, imageUrl }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: CREATE_SATELLITE,
                variables: { title, weight, fullDesc, description, imageUrl, orbit, expectedDate}
            });
            return data.createSatellite.satellite;
        } catch (error) {
            return rejectWithValue('Ошибка добавления спутника');
        }
    }
);

// Асинхронное действие для получения списка спутников
export const getSatellitesList = createAsyncThunk(
    'satellites/getSatellitesList',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const state = getState() as { satellites: SatellitesState };
        try {
            const response = await api.satellites.satellitesList({ 
                satellite_title: state.satellites.satellite_title 
            });
            console.log('Получен список спутников:', response.data);
            if (response.data.draft_id) {
                dispatch(setId(response.data.draft_id));
                dispatch(setSatellitesCount(response.data.draft_satellites_count));
                dispatch(setLaunchId(response.data.draft_id));
            }
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении списка спутников:', error);
            return rejectWithValue('Ошибка при загрузке данных: ' + error);
        }
    }
);

// Асинхронное действие для получения спутника по ID
export const getSatelliteById = createAsyncThunk(
    'satellites/getSatelliteById',
    async (satelliteId: string, { rejectWithValue }) => {
        try {
            const response = await api.satellites.satellitesRead(satelliteId);
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при загрузке данных о спутнике');
        }
    }
);

// Асинхронное действие для добавления спутника в запуск
export const addSatelliteToLaunchAsync = createAsyncThunk(
    'satellites/addSatelliteToLaunch',
    async (satelliteId: number, { dispatch, rejectWithValue }) => {
        try {
            const order = 1;
            const result = await dispatch(draftAddSatelliteToLaunch({ satelliteId, order })).unwrap();
            return result;
        } catch (error) {
            return rejectWithValue('Ошибка при добавлении спутника в запуск');
        }
    }
);

// Асинхронное действие для добавления нового спутника
export const addSatelliteAsync = createAsyncThunk(
    'satellites/addSatellite',
    async (newSatellite: Satellite, { rejectWithValue }) => {
        try {
            const response = await api.satellites.satellitesCreate(newSatellite);
            return response.data;
        } catch (error) {
            return rejectWithValue('Не удалось добавить спутник. Пожалуйста, проверьте введенные данные');
        }
    }
);

// Асинхронное действие для обновления спутника
export const updateSatelliteAsync = createAsyncThunk(
    'satellites/updateSatellite',
    async (updatedSatellite: Satellite, { rejectWithValue }) => {
        try {
            const response = await api.satellites.satellitesUpdate(
                updatedSatellite.satellite_id.toString(), 
                updatedSatellite
            );
            return response.data;
        } catch (error) {
            return rejectWithValue('Не удалось обновить данные спутника. Пожалуйста, попробуйте еще раз');
        }
    }
);

// Асинхронное действие для удаления спутника
export const deleteSatelliteAsync = createAsyncThunk(
    'satellites/deleteSatellite',
    async (satelliteId: number, { rejectWithValue }) => {
        try {
            await api.satellites.satellitesDelete(satelliteId.toString());
            return satelliteId;
        } catch (error) {
            return rejectWithValue('Ошибка при удалении спутника');
        }
    }
);

// Add this new thunk for image upload
export const uploadSatelliteImageAsync = createAsyncThunk(
    'satellites/uploadImage',
    async ({ id, file }: { id: number, file: File }, { rejectWithValue }) => {
        try {
            const response = await api.satellites.satellitesAddImageCreate(id.toString());
            return response.data;
        } catch (error) {
            return rejectWithValue('Не удалось загрузить изображение. Пожалуйста, проверьте формат файла');
        }
    }
);

export const satellitesSlice = createSlice({
    name: 'satellites',
    initialState,
    reducers: {
        setSearchValue: (state, action: PayloadAction<string>) => {
            state.satellite_title = action.payload;
        },
        incrementSatCount: (state) => {
            state.satCount += 1;
        },
        decrementSatCount: (state) => {
            if (state.satCount > 0) {
                state.satCount -= 1;
            }
        },
        setSatCount: (state, action: PayloadAction<number>) => {
            state.satCount = action.payload;
        },
        setLaunchId: (state, action: PayloadAction<number>) => {
            state.launchid = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSatellitesList.fulfilled, (state, action) => {
                state.satellites = action.payload.satellites;
                state.loading = false;
            })
            .addCase(getSatellitesList.rejected, (state) => {
                state.satellites = SATELLITES_MOCK;
                state.loading = false;
            })
            .addCase(getSatellitesList.pending, (state) => {
                state.loading = true;
            })
            .addCase(addSatelliteAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(addSatelliteAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateSatelliteAsync.fulfilled, (state, action) => {
                const index = state.satellites.findIndex((satellite) => satellite.id === action.payload.id);
                if (index !== -1) state.satellites[index] = action.payload;
            })
            .addCase(deleteSatelliteAsync.fulfilled, (state, action) => {
                state.satellites = state.satellites.filter((satellite) => satellite.id !== action.payload);
            })
            .addCase(fetchSatellite.fulfilled, (state, action) => {
                const index = state.satellites.findIndex((satellite) => satellite.id === action.payload.id);
                if (index !== -1) {
                    state.satellites[index] = action.payload;
                } else {
                    state.satellites.push(action.payload);
                }
            })
            .addCase(uploadSatelliteImageAsync.fulfilled, (state, action) => {
                const satellite = state.satellites.find(s => s.id === action.payload.id);
                if (satellite) {
                    satellite.image_url = action.payload.imageUrl;
                }
            })
            .addCase(uploadSatelliteImageAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { setSearchValue, incrementSatCount, decrementSatCount, setSatCount, setLaunchId } = satellitesSlice.actions;
export default satellitesSlice.reducer;
