import axios from "axios";
import axiosRetry from "axios-retry";

const api = axios.create({
    baseURL: 'https://api.mangadex.org',
    timeout: 10000,
});

axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error);
    },
    onRetry: (retryCount, error, requestConfig) => {
        console.log(`🔁 Essai ${retryCount} → ${requestConfig.url}`);
    }
});

export default api;