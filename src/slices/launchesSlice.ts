import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {api} from '../api';
import {Launch} from "../api/Api.ts";
import draftSlice from "./draftSlice.ts";

// Интерфейс состояния слайса
interface LaunchesState {
    launches: Launch[];
    selectedSatellites: number[];
    loading: boolean;
    error: string | null;
    qr?: string;
}

// Начальное состояние
const initialState: LaunchesState = {
    launches: [],
    selectedSatellites: [],
    loading: false,
    error: null,
    qr: undefined,
};

// Асинхронное действие для получения списка запусков с фильтрами
export const getLaunches = createAsyncThunk(
    'launches/getLaunches',
    async (filters: { status?: string; start_date?: string; end_date?: string }) => {
        const response = await api.launches.launchesList({ query: filters });
        return response.data;
    }
);

// Асинхронное действие для получения детальной информации о запуске
export const getLaunchById = createAsyncThunk(
    'launches/getLaunchById',
    async (id: string) => {
        const response = await api.launches.launchesRead(id);
        return response.data;
    }
);

// Асинхронное действие для удаления запуска
export const deleteLaunch = createAsyncThunk(
    'launches/deleteLaunch',
    async (id: string) => {
        await api.launches.launchesDelete(id);
        return id;
    }
);

// Асинхронное действие для добавления спутника в запуск
export const addSatelliteToLaunchAsync = createAsyncThunk(
    'launches/addSatelliteToLaunchAsync',
    async ({ satelliteId, order }: { satelliteId: number, order: number }, { rejectWithValue }) => {
        try {
            await api.satellites.satellitesAddToDraftCreate(satelliteId.toString(), { });
            return satelliteId;
        } catch (error) {
            console.error('Error adding satellite to launch:', error);
            return rejectWithValue('Ошибка при добавлении спутника в запуск');
        }
    }
);

// Асинхронное действие для удаления спутника из запуска
export const removeSatelliteFromLaunchAsync = createAsyncThunk(
    'launches/removeSatelliteFromLaunchAsync',
    async (satelliteId: number, { rejectWithValue }) => {
        try {
            await api.satellites.satellitesManageDraftDelete(satelliteId.toString());
            return satelliteId;
        } catch (error) {
            console.error('Error removing satellite from launch:', error);
            return rejectWithValue('Ошибка при удалении спутника из запуска');
        }
    }
);

// Асинхронное действие для получения запуска пользователя
export const fetchUserLaunch = createAsyncThunk(
    'launches/fetchUserLaunch',
    async (_, { rejectWithValue, getState }) => {
        try {
            const response = await api.launches.launchesList();
            
            if (response.data && response.data.launches) {
                return response.data.launches[0] || null;
            } else {
                return null;
            }
        } catch (error) {
            if (error.response?.status === 403 || error.response?.status === 401) {
                console.log('User not authorized for launches or no launches found');
                return null;
            }
            console.error('Error fetching launches:', error);
            return rejectWithValue('Ошибка при получении данных запуска');
        }
    }
);

// Добавляем новый action для модерации запуска
export const moderateLaunchAsync = createAsyncThunk(
    'launches/moderateLaunchAsync',
    async ({ id, status }: { id: string, status: 'completed' | 'rejected' }, { rejectWithValue }) => {
        try {
            const response = await api.launches.launchesModerateCreate(id, { status });
            return { id, status, success: response.data.success };
        } catch (error) {
            console.error('Error moderating launch:', error);
            return rejectWithValue('Ошибка при модерации запуска');
        }
    }
);

const launchesSlice = createSlice({
    name: 'launches',
    initialState,
    reducers: {
        addSatelliteToLaunch: (state, action) => {
            if (!state.selectedSatellites.includes(action.payload)) {
                state.selectedSatellites.push(action.payload);
            }
        },
        removeSatelliteFromLaunch: (state, action) => {
            state.selectedSatellites = state.selectedSatellites.filter(id => id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLaunches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLaunches.fulfilled, (state, action) => {
                state.loading = false;
                state.launches = action.payload;
            })
            .addCase(getLaunches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Ошибка при получении запусков';
            })
            .addCase(deleteLaunch.fulfilled, (state, action) => {
                state.launches = state.launches.filter(
                    (launch) => launch.launch_id !== parseInt(action.payload)
                );
            })
            .addCase(fetchUserLaunch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserLaunch.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchUserLaunch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addSatelliteToLaunchAsync.fulfilled, (state, action) => {
                if (!state.selectedSatellites.includes(action.payload)) {
                    state.selectedSatellites.push(action.payload);
                }
            })
            .addCase(removeSatelliteFromLaunchAsync.fulfilled, (state, action) => {
                state.selectedSatellites = state.selectedSatellites.filter(id => id !== action.payload);
            })
            .addCase(moderateLaunchAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(moderateLaunchAsync.fulfilled, (state, action) => {
                state.loading = false;
                const launch = state.launches.find(l => l.launch_id === parseInt(action.payload.id));
                if (launch) {
                    launch.status = action.payload.status;
                    if (action.payload.status === 'completed') {
                        launch.success = action.payload.success;
                    }
                }
            })
            .addCase(moderateLaunchAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { addSatelliteToLaunch, removeSatelliteFromLaunch } = launchesSlice.actions;
export default launchesSlice.reducer;
