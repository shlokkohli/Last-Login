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

        loginStart: (state, action) => {
            state.loading = true;
            state.error = null;
        },

        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
        },

        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        logoutStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        logoutSuccess: (state,) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.loading = false;
        },

        logoutFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
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
    checkAuthStart, checkAuthSuccess, checkAuthFailure, loginStart, loginSuccess, loginFailure, logoutStart, logoutSuccess, logoutFailure
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

        if (!token) {
            console.log("No token found. User is not authenticated")
            dispatch(checkAuthFailure("No token found. User is not authenticated"))
            return;
        }

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
        console.error('Error object:', error);
        const errorMessage = error.response?.data?.message || "Error occured while checking auth";
        console.log(errorMessage)
        dispatch(checkAuthFailure(errorMessage));
    }
};

export const loginUser = (email, password) => async (dispatch) => {
    dispatch(loginStart());
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        
        // save the token to the local storage if needed
        localStorage.setItem('accessToken', response.data.data.accessToken);

        console.log(response.data)

        dispatch(loginSuccess({
            user: response.data.data.user,
            accessToken: response.data.data.accessToken,
            refreshToken: response.data.data.refreshToken,
        }));
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Login failed. Please try again";
        dispatch(errorMessage);
    }
}

export const logoutUser = () => async (dispatch) => {
    dispatch(logoutStart());
    try {
        await axios.post(`${API_URL}/logout`);
        dispatch(logoutSuccess());
        localStorage.removeItem('accessToken');
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error logging out. Please try again.";
        dispatch(logoutFailure(errorMessage));
    }
}