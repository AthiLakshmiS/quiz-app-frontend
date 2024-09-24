const { default: axiosInstance } = require(".");
const BASE_URL = process.env.REACT_APP_API_URL;

export const registerUser = async (payload) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/api/users/register`, payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const loginUser = async (payload) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/api/users/login`, payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getUserInfo = async () => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/api/users/get-user-info`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
