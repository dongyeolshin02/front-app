import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { authStore } from "../store/authStore"
import api from '../api/axiosApi';
import { useNavigate } from "react-router";



export const useLogin = () => {
    const{setLogin} = authStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn :  async (credentials) => {
            console.log(credentials)
          
            const response = await api.post('/api/v1/login', credentials, {
                    headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    },
            });
               
            console.log(response);
            return response.data;
          
        },
        onSuccess : (data) =>{
            console.log(data);
            //캐시무효화 
            //토클 저장
            setLogin(data.content);
            navigate('/board');
        },
        onError: (error) => {
            // 에러 로깅
            console.error('Login failed:', error);
            
            // 에러는 컴포넌트에서 처리하므로 여기서는 로깅만 수행
            // 필요시 토스트나 전역 에러 처리 로직 추가 가능
        }
        
        
    })

    return { loginMutation };
}