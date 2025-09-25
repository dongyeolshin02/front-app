import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { authStore } from "../store/authStore"
import api from '../api/axiosApi';
import { useNavigate } from "react-router";



export const useLogin = () => {
    const{setLogin} = authStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn :  async (credentials) => {
            console.log(credentials)
            try {
                const response = await api.post('/api/v1/login', credentials, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
               
                return response.data;
            } catch (error) {
                throw error.response?.data || error;
            }
        },
        onSuccess : (data) =>{
            //캐시무효화 
            queryClient.invalidateQueries( {queryKey : ['users']});
            //토클 저장
            setLogin(data.content);
            navigate('/board');
        },
        onError : (error) =>{
            console.error('Login 실패', error);
        }
    })

}