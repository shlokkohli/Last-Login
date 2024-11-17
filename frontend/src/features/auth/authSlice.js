import {createSlice, nanoid} from '@reduxjs/toolkit'
import axios from "axios"

const initialState = {
    user: null,
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null,
    emailVerified: false,
    isCheckingAuth: true,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        signupStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        signupSuccess: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.loading = false;
        },

        signupFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        login: (state, action) => {

        },

        logout: (state, action) => {

        },

        verifyEmailStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        verifyEmailSuccess: (state) => {
            state.emailVerified = true;
            state.loading = false;
            if (state.user){
                state.user.isVerified = true;
            }
        },

        verifyEmailFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        checkAuthStart: (state) => {
            state.error = null;
        },

        checkAuthSuccess: (state, action) => {
            state.isCheckingAuth = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },

        checkAuthFailure: (state, action) => {
            state.error = action.payload;
            state.isCheckingAuth = false;
            state.isAuthenticated = false;
        },

        forgotPassword: (state, action) => {

        },

        resetPassword: (state, action) => {

        }
    }
})

export const {signupStart, signupSuccess, signupFailure, verifyEmailStart, verifyEmailSuccess, verifyEmailFailure,
    checkAuthStart, checkAuthSuccess, checkAuthFailure
 } = authSlice.actions;
export default authSlice.reducer;

const API_URL = "http://localhost:3000/api/auth";

axios.defaults.withCredentials = true;

export const signupUser = (name, email, password) => async (dispatch) => {
    dispatch(signupStart());
    try {
        // take the user data from the post request
        const response = await axios.post(`${API_URL}/register`, {username: name, email, password});
        // we have taken the user data, now save it in the store
        dispatch(signupSuccess({
            user: response.data.user,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
        }))
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error occured during signing in user";
        dispatch(signupFailure(errorMessage));
    }
}

export const verifyEmail = (otp) => async (dispatch) => {
    dispatch(verifyEmailStart());
    try {
        const response = await axios.post(`${API_URL}/verify-email`, { code: otp });
        // we have taken the user otp, now send confirmation to server that everything is done fine
        dispatch(verifyEmailSuccess());
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error occuring during email verification";
        dispatch(verifyEmailFailure(errorMessage));
    }
}

export const checkAuth = () => async (dispatch) => {
    dispatch(checkAuthStart());
    try {

        const token = localStorage.getItem('accessToken');

        // make an api call to check if the user is authenticated
        const response = await axios.get(`${API_URL}/check-auth`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        dispatch(checkAuthSuccess({
            user: response.data.data.user,
            token: token,
        }));
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error occuring while checking auth";
        dispatch(checkAuthFailure(errorMessage));
    }
}