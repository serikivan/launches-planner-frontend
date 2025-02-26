import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { api } from '../api';

interface ApiError {
    error: string;
    response?: {
        status: number;
        data: {
            error?: string;
        };
    };
}

interface UserState {
    id: number;
    email: string;
    isAuthenticated: boolean;
    isStaff: boolean;
    isSuperuser: boolean;
    error?: string | null;
}

const initialState: UserState = {
    id: NaN,
    email: '',
    isAuthenticated: false,
    isStaff: false,
    isSuperuser: false,
    error: null,
};

// Асинхронное действие для авторизации пользователя
export const loginUserAsync = createAsyncThunk(
    'user/loginUserAsync',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.login.loginCreate(credentials, {});
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            if (axiosError.response && axiosError.response.status === 400) {
                return rejectWithValue(axiosError.response.data?.error || 'Неверное имя пользователя или пароль.');
            }
            return rejectWithValue('Ошибка авторизации');
        }
    }
);

// Асинхронное действие для выхода пользователя из системы
export const logoutUserAsync = createAsyncThunk(
    'user/logoutUserAsync',
    async (_, { rejectWithValue }) => {
        try {
            await api.logout.logoutCreate({});
            return {};
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка при выходе из системы');
        }
    }
);

// Асинхронное действие для регистрации пользователя
export const registerUserAsync = createAsyncThunk(
    'user/registerUserAsync',
    async (userData: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.register.registerCreate(userData);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            return rejectWithValue(axiosError.response?.data?.error || 'Ошибка при регистрации пользователя');
        }
    }
);

// Асинхронное действие для редактирования данных пользователя
export const updateUserAsync = createAsyncThunk(
    'user/updateUserAsync',
    async (userData: { id: number; email?: string; password?: string }, { rejectWithValue }) => {
        try {
            const response = await api.profile.profileUpdate(userData);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            return rejectWithValue(axiosError.response?.data?.error || 'Ошибка при обновлении данных пользователя');
        }
    }
);

const usersSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUserAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(loginUserAsync.fulfilled, (state, action) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const { id, email, is_staff, is_superuser } = action.payload;
                state.id = id;
                state.email = email;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                state.isStaff = is_staff;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                state.isSuperuser = is_superuser;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUserAsync.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isAuthenticated = false;
                state.isStaff = false;
                state.isSuperuser = false;
            })
            .addCase(logoutUserAsync.fulfilled, (state) => {
                state.id = NaN;
                state.email = '';
                state.isAuthenticated = false;
                state.isStaff = false;
                state.isSuperuser = false;
                state.error = null;
            })
            .addCase(logoutUserAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(registerUserAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(registerUserAsync.fulfilled, (state) => {
                state.error = null;
            })
            .addCase(registerUserAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(updateUserAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(updateUserAsync.fulfilled, (state, action) => {
                const { email } = action.payload;
                if (email) state.email = email;
                state.error = null;
            })
            .addCase(updateUserAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default usersSlice.reducer;
