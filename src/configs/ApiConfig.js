import axios from "axios";
import Cookies from "js-cookie";

const REACT_APP_BASE_API = process.env.REACT_APP_BASE_API;
const SECONDS = 30;
const MILISECONDS = 1000;
const TIMEOUT = SECONDS * MILISECONDS;
const TOKEN = () => Cookies.get("server_token");
const TOKEN_PAYLOAD_KEY = 'authorization';
const PUBLIC_REQUEST_KEY = 'public-request';

const server = axios.create({
    baseURL: REACT_APP_BASE_API,
    timeout: TIMEOUT,
    // headers: {
    //     "content-type": "application/json",
    //     "Authorization": `Bearer ${TOKEN}`,
    // }
});

server.interceptors.request.use(function (config) {
    if (TOKEN) {
        config.headers[TOKEN_PAYLOAD_KEY] = `Bearer ${TOKEN()}`
    }

    if (!TOKEN && !config.headers[PUBLIC_REQUEST_KEY]) {
        //history.push(ENTRY_ROUTE)
    }
    return config;
});
server.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

const serverLogin = async (formData) => {
    const { data } = await server.post(`/auth/login`, formData);
    return data;
}
const signOut = async () => {
    const { data } = await server.post(`/auth/logout`);
    return data;
}

const fetchCategory = async (formData) => {
    const { data } = await server.get(`/category`, formData);
    return data;
}
const fetchCategoryInclude = async (category) => {
    const { data } = await server.get(`/category?include=${category}`);
    return data;
}
const addCategory = async (formData) => {
    const { data } = await server.post(`/category`, formData);
    return data;
}
const editCategory = async (params) => {
    const { data } = await server.patch(`/category/${params.id}`, params.formData);
    return data;
}
const deleteCategory = async (deleteId) => {
    const { data } = await server.put(`/category/${deleteId}`);
    return data;
}

const fetchServers = async () => {
    const { data } = await server.get(`/category-server?include=category`);
    return data;
}
const addServer = async (formData) => {
    const { data } = await server.post(`/category-server`, formData);
    return data;
}
const editServer = async (params) => {
    const { data } = await server.patch(`/category-server/${params.id}`, params.formData);
    return data;
}
const deleteServer = async (deleteId) => {
    const { data } = await server.put(`/category-server/${deleteId}`);
    return data;
}
const fetchServersByCategory = async (categoryId) => {
    const { data } = await server.get(`/category/${categoryId}?include=categoryserver`);
    return data;
}

const fetchWebsites = async () => {
    const { data } = await server.get('/site?include=category&include1=categoryserver');
    return data;
}
const addWebsite = async (formData) => {
    const { data } = await server.post(`/site/`, formData);
    return data;
}
const editWebsite = async (params) => {
    const { data } = await server.patch(`/site/${params.id}`, params.formData);
    return data;
}
const deleteWebsite = async (deleteId) => {
    const { data } = await server.put(`/site/${deleteId}`);
    return data;
}


const sendInvoicePay = async (params) => {
    const { data } = await server.put(`/site/status/${params.id}`, params.formData);
    return data;
}

const notificationPush = async () => {
    const { data } = await server.post(`/notification`);
    return data;
}
const fetchNotification = async () => {
    const { data } = await server.get('/site?status=pay');
    return data;
}

export {
    serverLogin,
    signOut,
    fetchCategory,
    fetchCategoryInclude,
    addCategory,
    editCategory,
    deleteCategory,
    fetchServers,
    sendInvoicePay,
    fetchWebsites,
    addWebsite,
    editWebsite,
    deleteWebsite,
    addServer,
    editServer,
    deleteServer,
    fetchServersByCategory,
    notificationPush,
    fetchNotification
};