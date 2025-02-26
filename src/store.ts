import { configureStore } from '@reduxjs/toolkit';
import userSlice from "./slices/userSlice";
import satellitesSlice from "./slices/satellitesSlice";
import launchesSlice from "./slices/launchesSlice";
import draftSlice from "./slices/draftSlice";

// Создаем store
export const store = configureStore({
    reducer: {
        user: userSlice,
        satellites: satellitesSlice,
        launches: launchesSlice,
        draft: draftSlice,
    },
});

// Экспортируем типы для использования в приложении
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
