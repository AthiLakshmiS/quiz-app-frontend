import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import loaderReducer from './loaderSlice'; // Assuming you have a loader slice

const store = configureStore({
    reducer: {
        auth: authReducer,
        loader: loaderReducer,
    },
});

export default store;