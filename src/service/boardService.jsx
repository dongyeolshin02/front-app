import api from '../api/axiosApi';


export const boardAPI ={

    list : async (page) =>{
        const response = await api.get(`/api/v1/board?page=${page}`);
        return response.data.response;
    },

     get : async (brdId) =>{
        const response = await api.get(`/api/v1/board/${brdId}`);
        return response.data.response;
    },

    create : async (formData) =>{
        const response = await api.post(`/api/v1/board`, formData, 
            {headers: {
                "Content-Type": "multipart/form-data" 
            }});
        return response.data.response;
    },

    update : async (formData) =>{
        const response = await api.put(`/api/v1/board`, formData, 
            {headers: {
                "Content-Type": "multipart/form-data" 
            }});
        return response.data.response;
    },

    delete : async (brdId) =>{
        const response = await api.delete(`/api/v1/board/${brdId}`);
        return response.data.response;
    },

    deleteFile : async (bfId) =>{
        const response = await api.delete(`/api/v1/board/file/${bfId}`);
        return response.data.response;
    }
}