import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";

axios.defaults.paramsSerializer = params => qs.stringify(params);

function _get(url: string) {
    return async (query: AxiosRequestConfig = {}) => {
        const { cancelToken = axios.CancelToken.source().token, params = {}, headers } = query;

        const response = await axios.get(url, {
            cancelToken,
            params: params,
            headers: {
                ...headers,
            },
        });
        return response.data;
    };
}

function _patch(url: string) {
    return async (query: AxiosRequestConfig = {}) => {
        const { cancelToken = axios.CancelToken.source().token, data, headers } = query;

        const response = await axios.patch(url, data, {
            headers: {
                ...headers,
            },
            cancelToken,
        });
        return response.data;
    };
}

function _delete(url: string) {
    return async (query: AxiosRequestConfig = {}) => {
        const { data, headers } = query;

        const response = await axios.delete(url, {
            data,
            headers: {
                ...headers,
            },
        });
        return response.data;
    };
}

function _post(url: string) {
    return async (query: AxiosRequestConfig = {}) => {
        const { cancelToken = axios.CancelToken.source().token, data, headers } = query;

        const response = await axios.post(url, data, {
            headers: {
                ...headers,
            },
            cancelToken,
        });
        return response.data;
    };
}

export default {
    delete: _delete,
    get: _get,
    patch: _patch,
    post: _post,
};
