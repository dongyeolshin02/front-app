import React, { useEffect, useRef, useState } from 'react';
import '../../assets/css/boardDetail.css'
import { RiDeleteBinLine } from "react-icons/ri";
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { focusManager, useQuery, useQueryClient } from '@tanstack/react-query';
import { boardAPI } from '../../service/boardService';
import { useNavigate, useParams } from 'react-router';
import { useBoard } from '../../hooks/useBoard';


const schema = yup.object().shape({
    title: yup.string().required('제목을 입력하십시오'),
    contents : yup.string().required('내용을 입력하십시오'),
    file : yup.mixed()
            .nullable()
            .test('fileSize','파일은 2MB 이하여야 합니다', (value)=>{
                if(!value || value.length === 0) return true;
                return value[0].size  <= 2 * 1024 * 1024;
            })
})

function BoardDetail(props) {

    const {register, handleSubmit, formState:{errors}, reset, setValue} =
                    useForm({resolver : yupResolver(schema)});
    
    const {brdId} = useParams();
    const isFile = useRef();

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {deleteFileMutation, updateBoardMutation, deleteBoardMutation} = useBoard();

    const {data, isLoading, error} = useQuery({
        queryKey:['board', brdId],
        queryFn: () => boardAPI.get(brdId),
    })

    useEffect( ()=> {
        if(data) {
          
            reset({
                title :data.title,
                contents : data.contents
            })

            isFile.current = data.fileList && data.fileList.length > 0;
        }

    },[data, reset]);

  
    const updateBoard = async (frmData) =>{

        const formData = new FormData();


        formData.append("brdId", data.brdId);
        formData.append("title", frmData.title);
        formData.append("contents", frmData.contents);
        
        if(frmData.file.length  > 0) {
            if(isFile.current){
                
                if(!confirm('파일을 등록하면 기존파일이 삭제됩니다. 진행합니까?')){
                    setValue('file', '');
                    return false;
                    
                }
            }

            formData.append("file", frmData.file[0]);
        }
       

        try{

            const result = await  updateBoardMutation.mutateAsync(formData);
            
            if(result.resultCode === 200) {
                    alert('게시글이 수정되었습니다.');
                    queryClient.invalidateQueries( {queryKey:['board', brdId]} )
                    navigate('/board');
                }else {
                    alert("게시글이 수정이 실패했습니다.");
                }


        }catch(error) {
            console.log(error);
        }

    }

    const deleteFile = async (bfId)=>{
        
        if(confirm('파일이 실제로 삭제됩니다. 진행하겠습니까?')) {
           
            try{
                const result = await deleteFileMutation.mutateAsync(bfId);

                if(result.resultCode === 200) {
                    alert('파일이 삭제되었습니다.');
                    //게시글 보기 정보 캐쉬를 초기화 
                    queryClient.invalidateQueries( {queryKey:['board', brdId]} )
                   
                }else {
                       alert('파일삭제가 실패했습니다.');
                }
              
            }catch(error){
                alert(error);
            }
        }
    }

    const goList = () =>{
        navigate('/board');
    }

    const goDelete = async () =>{
         if(confirm('정말 삭제하시겠습니까?')){

            try{

                const result = await deleteBoardMutation.mutateAsync(brdId);

                if(result.resultCode === 200) {
                    alert('게시글이 삭제되었습니다.');
                    navigate('/board');
                }else {
                    alert('게시글 삭제가 실패했습니다.');
                }

            }catch(error) {
                console.log(error);
            }
         }
    }


    return (
        <>
          <main className='container'>
            <header>
                <h2> 게시글 보기</h2>
            </header>
            <section className='d-contents'>
                <form onSubmit={handleSubmit(updateBoard)}>
                    <div className='sch'>
                        <button type='submit' 
                        className='btn btn-outline-primary'>수정</button>
                        <button type='button' 
                        className='btn btn-outline-secondary' onClick={goList}>목록</button>
                        <button type='button' 
                        className='btn btn-outline-danger' onClick={goDelete}>삭제</button>
                    </div>
            
                    <div className='board'>
                        <div className='mb-3'>
                            <label htmlFor='title' className='form-label'>제목</label>
                            <input type='text' id="title" {...register('title')} 
                                className='form-control' />
                           {errors.title  && <p className='error'>{errors.title.message}</p>}                    
                        </div>
                        <div className='row mb-3'>
                            <label className='col-2'>글쓴이</label>
                            <div className='col-4'>
                                <p className=''>{data?.writer}</p>
                            </div>   
                            <label className='col-2'>조회 수</label>
                            <div className='col-4'>
                                <p>{data?.readCount}</p>
                            </div>      
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='contents' className='form-label'>내용</label>
                            <textarea id="contents" 
                            className='form-control text-contents' {...register('contents')} ></textarea>
                            {errors.contents  && <p className='error'>{errors.contents.message}</p>}   
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>첨부파일</label>
                            <div>
                                <input type='file' className='form-control'  {...register('file')} ></input>
                            </div>
                            <ul className='file-list'>
                                {
                                    data?.fileList?.map(file =>(
                                       <li key={file.bfId}>
                                        {file.fileName}
                                        <a href="#" 
                                            onClick={()=>deleteFile(file.bfId)}><RiDeleteBinLine /></a>
                                    </li>
                                    ))
                                }
                            </ul>
                            {errors.file  && <p className='error'>{errors.file.message}</p>}   
                        </div>
                    </div>
                </form>
            </section>    
        </main>  
        </>
    );
}

export default BoardDetail;