const { default: axiosInstance } = require(".");
const BASE_URL = process.env.REACT_APP_API_URL;

// add report
export const addReport = async (payload) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/api/reports/add-report`, payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// get all reports
export const getAllReports = async (filters) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/api/reports/get-all-reports`, filters);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
} 

// get all reports by user
export const getAllReportsByUser = async () => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/api/reports/get-all-reports-by-user`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}