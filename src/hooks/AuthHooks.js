import { useMutation } from "react-query";
import * as api from "configs/ApiConfig";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import Cookies from "js-cookie";

export const useServerLogin = () => {
    return useMutation((formData) => api.serverLogin(formData));
}

export const useServerLogout = () => {
    const navigate = useNavigate();
    return useMutation(() => api.signOut(), {
        retry: false,
        onSuccess: (datas) => {
            message.success("Logout Success")
            Cookies.remove('server_token')
            navigate('login')
        }, onError: (error) => {
            if(!error.response){
                message.error(error.message)
            }if(error.response.data.error){
                message.error(error.response.data.error)
            }else{
                message.error("Something Went Wrong!")
            }
        }
    })

}

