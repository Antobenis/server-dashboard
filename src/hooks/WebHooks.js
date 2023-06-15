import { useMutation, useQuery, useQueryClient } from "react-query";
import * as api from "configs/ApiConfig";
import { message } from "antd";

export const useFetchCategory = () => {
    return useQuery(["CategoryData"], () => api.fetchCategory(), {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}
export const useFetchCategoryInclude = (category) => {
    return useQuery(["CategoryDataInclude", category], () => api.fetchCategoryInclude(category), {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    });
}
export const useAddCategory = (formData) => {
    return useMutation((formData) => api.addCategory(formData), {
        retry: false,
    });
}
export const useEditCategory = () => {
    return useMutation((params) => api.editCategory(params), {
        retry: false,
    });
}
export const useDeleteCategory = () => {
    return useMutation((deleteId) => api.deleteCategory(deleteId), {
        retry: false,
    });
}

export const useFetchServers = () => {
    return useQuery(['ServerData'], () => api.fetchServers(), {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}
export const useAddServer = () => {
    return useMutation((formData) => api.addServer(formData), {
        retry: false,
    });
}
export const useEditServer = () => {
    return useMutation((params) => api.editServer(params), {
        retry: false,
    });
}
export const useDeleteServer = () => {
    return useMutation((deleteId) => api.deleteServer(deleteId), {
        retry: false,
    });
}
export const useFetchServersByCategory = (categoryId) => {
    return useQuery(['ServerDataByCategory', categoryId], () => api.fetchServersByCategory(categoryId), {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}

export const useFetchWebsites = () => {
    return useQuery(["WebsitesData"], () => api.fetchWebsites(), {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}
export const useAddWebsite = () => {
    return useMutation('addwebsite', (formData) => api.addWebsite(formData), {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
}
export const useEditWebsite = () => {
    return useMutation((params) => api.editWebsite(params), {
        retry: false,
    });
}
export const useDeleteWebsite = () => {
    return useMutation((deleteId) => api.deleteWebsite(deleteId), {
        retry: false,
    });
}

export const useNotificationPush = () => {
    return useQuery(['Notification'], () => api.notificationPush(), {
        retry: false,
    })
}
export const useFetchNotification = () => {
    return useQuery(["fetchNotification"], () => api.fetchNotification(), {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}

export const useSendInvoicePay = () => {
    const refetch = useQueryClient();
    return useMutation((params) => api.sendInvoicePay(params), {
        retry: false,
        onSuccess: (datas) => {
            message.success("Success")
            refetch.refetchQueries(['Notification', "WebsitesData"])
        }, onError: (error) => {
            if (!error.response) {
                message.error(error.message)
            } if (error.response.data.error) {
                message.error(error.response.data.error)
            } else {
                message.error("Something Went Wrong!")
            }
        }
    })
}