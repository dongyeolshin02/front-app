import React, { useEffect, useRef, useState } from 'react';
import '../../assets/css/boardDetail.css'
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
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

function BoardWrite(props) {

    const {register, handleSubmit, formState:{errors}, reset, setValue} =
                    useForm({resolver : yupResolver(schema)});
    
    const navigate = useNavigate();
    const {createBoardMutation} = useBoard();

    const goList = () =>{
        navigate('/board');
    }

    const createBoard = async (data) => {
        const formData = new FormData();
    
        formData.append("title", data.title);
        formData.append("contents", data.contents);

        if(data.file.length  > 0) {
            formData.append("file", data.file[0]);
        }

        try{

            const result = await createBoardMutation.mutateAsync(formData);

            if(result.resultCode === 200) {
                alert('게시글이 등록되었습니다.');
                navigate('/board');
            }else {
                alert("게시글이 등록이 실패했습니다.");
            }

        }catch(error) {
            alert(error);
        }
    }

    return (
        <>
          <main className='container'>
            <header>
                <h2> 게시글 쓰기</h2>
            </header>
            <section className='d-contents'>
                <form onSubmit={handleSubmit(createBoard)}>
                    <div className='sch'>
                        <button type='submit' 
                        className='btn btn-outline-primary'>등록</button>
                        <button type='button' 
                        className='btn btn-outline-secondary' onClick={goList}>취소</button>
                    </div>
                    <div className='board'>
                        <div className='mb-3'>
                            <label htmlFor='title' className='form-label'>제목</label>
                            <input type='text' id="title" {...register('title')} 
                                className='form-control' />
                           {errors.title  && <p className='error'>{errors.title.message}</p>}                    
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
                            {errors.file  && <p className='error'>{errors.file.message}</p>}   
                        </div>
                    </div>
                </form>
            </section>    
        </main>  
        </>
    );
}

export default BoardWrite;