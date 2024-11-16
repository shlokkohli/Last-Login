import {createSlice, nanoid} from '@reduxjs/toolkit'
import axios from "axios"

const initialState = {
    user: null,
    isAuthenticate: false,
    token: null,
    loading: false,
    error: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        signupStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        signupSuccess: (state, payload) => {
            state.user = action.payload.user;
            state.isAuthenticate = true;
            state.token = action.payload.token;
            state.loading = false;
        },

        signupFailure: (action, payload) => {
            state.loading = false;
            state.error = action.payload;
        },

        login: (action, payload) => {

        },

        logout: (action, payload) => {

        },

        verifyEmail: (action, payload) => {

        },

        checkAuth: (action, payload) => {

        },

        forgotPassword: (action, payload) => {

        },

        resetPassword: (action, payload) => {

        }
    }
})

export const {signupStart, signupSuccess, signupFailure} = authSlice.actions;
export default authSlice.reducer;

const API_URL = "http://localhost:3000/api";

axios.defaults.withCredentials = true;

export const signupUser = (name, email, password) => async (dispatch) => {
    dispatch(signupStart());
    try {
        // take the user data from the post request
        const response = await axios.post(`${API_URL}/auth/register`, {username: name, email, password});

        console.log(response)
        // we have taken the user data, now save it in the store
        dispatch(signupSuccess({
            user: response.data.user,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
        }))
    } catch (error) {
        const errorMessage = error.response.data.message || "Error signing up"
        console.log(errorMessage);
    }
}