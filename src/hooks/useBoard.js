import { useMutation, useQueryClient } from "@tanstack/react-query"
import { boardAPI } from "../service/boardService"



export const useBoard = ()=>{

    const queryClient = useQueryClient();

    const deleteFileMutation = useMutation({
        mutationFn : (bfId) => boardAPI.deleteFile(bfId),
    });

    const createBoardMutation = useMutation({
        mutationFn : (formData) => boardAPI.create(formData),
        onSuccess : () =>{
            console.log('등록 완료')
            queryClient.invalidateQueries({queryKey:['board', 0]})
        }
    });

    const updateBoardMutation = useMutation({
        mutationFn : (formData) => boardAPI.update(formData),
        onSuccess : () =>{
            console.log('업데이트 완료')
            queryClient.invalidateQueries({queryKey:['board', 0]})
        }
    });


     const deleteBoardMutation = useMutation({
        mutationFn : (brdId) => boardAPI.delete(brdId),
        onSuccess : () =>{
            console.log('삭제 완료')
            queryClient.invalidateQueries({queryKey:['board', 0]})
        }
    });

    return {deleteFileMutation, updateBoardMutation, deleteBoardMutation, createBoardMutation}
}
