// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../api';
import {Satellite, Launch} from '../api/Api.ts';
import  {logoutUserAsync}  from './userSlice'; // Замените на правильный путь

// Интерфейс состояния черновой заявки
interface DraftLaunchState {
    draft_id: number | undefined;
    satellitesCount: number | undefined;
    satellites: Satellite[];
    satelliteLaunchSet: SatelliteLaunch[];
    launchData: Launch;
    isDraft: boolean;
    loading: boolean;
    error: string | null;
}

// Начальное состояние
const initialState: DraftLaunchState = {
    draft_id: 0,
    satellitesCount: 0,
    satellites: [],
    satelliteLaunchSet: [],
    launchData: {
        title: '',
        rocket: '',
        creator: '',
        status: 'draft',
        date: null,
        satellites: []
    },
    isDraft: true,
    loading: false,
    error: null,
};

// Асинхронное действие для получения запуска
export const getLaunch = createAsyncThunk(
    'draftLaunch/getLaunch',
    async (draft_id: number, {rejectWithValue}) => {
        try {
            const response = await api.launches.launchesRead(draft_id.toString());
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при получении запуска');
        }
    }
);

// Асинхронное действие для получения черновика запуска
export const getDraftLaunch = createAsyncThunk(
    'draftLaunch/getDraftLaunch',
    async (draft_id: number, {rejectWithValue}) => {
        try {
            const response = await api.launches.launchesRead(draft_id.toString());
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при получении черновика запуска');
        }
    }
);

// Асинхронное действие для добавления спутника в запуск
export const addSatelliteToLaunch = createAsyncThunk(
    'draftLaunch/addSatelliteToLaunch',
    async (satelliteId: number, {rejectWithValue}) => {
        try {
            const response = await api.satellites.satellitesAddToDraftCreate(satelliteId.toString());
            return response.data;
        } catch (error) {
            return rejectWithValue('Не удалось добавить спутник в черновик запуска');
        }
    }
);

// Асинхронное действие для удаления спутника из запуска
export const removeSatelliteFromLaunch = createAsyncThunk(
    'draftLaunch/removeSatelliteFromLaunch',
    async (satelliteId: number, {rejectWithValue}) => {
        try {
            await api.satellites.satellitesManageDraftDelete(satelliteId.toString());
            return satelliteId;
        } catch (error) {
            return rejectWithValue('Не удалось удалить спутник из черновика запуска');
        }
    }
);

// Асинхронное действие для обновления данных запуска
export const updateLaunchAsync = createAsyncThunk(
    'draftLaunch/updateLaunch',
    async ({id, data}: {id: number; data: Launch}, {rejectWithValue}) => {
        try {
            const response = await api.launches.launchesUpdate(id.toString(), data);
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при обновлении запуска');
        }
    }
);

// Асинхронное действие для формирования запуска
export const submitLaunch = createAsyncThunk(
    'draftLaunch/submitLaunch',
    async (id: number, {rejectWithValue}) => {
        try {
            await api.launches.launchesFormCreate(id.toString());
            console.log(id)
            return id;
        } catch (error) {
            return rejectWithValue('Ошибка при формировании запуска');
        }
    }
);

// Асинхронное действие для удаления запуска
export const deleteLaunch = createAsyncThunk(
    'draftLaunch/deleteLaunch',
    async (id: number, {rejectWithValue}) => {
        try {
            await api.launches.launchesDelete(id.toString());
            return id;
        } catch (error) {
            return rejectWithValue('Ошибка при удалении запуска');
        }
    }
);

export const updateSatelliteLaunch = createAsyncThunk(
    'draftLaunch/updateSatelliteLaunch',
    async ({id, order}: { id: number; order: string }, {rejectWithValue}) => {
        try {
            const response = await api.engines.satellitesManageDraftUpdate(id, {order: order});
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка при обновлении SatelliteLaunch');
        }
    }
);

// Слайс для черновика запуска
const draftLaunchSlice = createSlice({
    name: 'draftLaunch',
    initialState,
    reducers: {
        setId: (state, action) => {
            state.draft_id = action.payload;
        },
        setSatellitesCount: (state, action) => {
            state.satellitesCount = action.payload;
        },
        setLaunchData: (state, action) => {
            state.launchData = {...state.launchData, ...action.payload};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLaunch.fulfilled, (state, action) => {
                state.launchData = action.payload;
                state.satellites = action.payload.satellites || [];
                state.isDraft = action.payload.status === 'draft';
            })
            .addCase(logoutUserAsync.fulfilled, (state) => {
                // Сброс состояния DraftLaunchState
                state.draft_id = 0;
                state.satellitesCount = 0;
                state.satellites = [];
                state.launchData = initialState.launchData;
                state.isDraft = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(getDraftLaunch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDraftLaunch.fulfilled, (state, action) => {
                state.loading = false;
                state.launchData = action.payload;
                state.isDraft = action.payload.status === 'draft';
            })
            .addCase(getDraftLaunch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addSatelliteToLaunch.fulfilled, (state, action) => {
                state.satellites.push(action.payload);
                state.satellitesCount = (state.satellitesCount || 0) + 1;
            })
            .addCase(removeSatelliteFromLaunch.fulfilled, (state, action) => {
                state.satellites = state.satellites.filter(
                    (item) => item.satellite_id !== action.payload
                );
                state.satellitesCount = Math.max(0, (state.satellitesCount || 1) - 1);
            })
            .addCase(updateLaunchAsync.fulfilled, (state, action) => {
                state.launchData = action.payload;
            })
            .addCase(submitLaunch.fulfilled, (state) => {
                state.draft_id = 0;
                state.satellitesCount = 0;
                state.satellites = [];
                state.launchData = initialState.launchData;
                state.isDraft = false;
            })
            .addCase(deleteLaunch.fulfilled, (state) => {
                state.draft_id = 0;
                state.satellitesCount = 0;
                state.satellites = [];
                state.launchData = initialState.launchData;
                state.isDraft = false;
            })
            .addCase(updateSatelliteLaunch.fulfilled, (state, action) => {
                const index = state.satellites.findIndex(item => item.satellite_id === action.payload.satellite_id);
                if (index !== -1) {
                    state.satellites[index] = action.payload;
                }
            });
    },
});

export const {setId, setSatellitesCount, setLaunchData} = draftLaunchSlice.actions;
export default draftLaunchSlice.reducer;
