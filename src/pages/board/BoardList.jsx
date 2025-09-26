import React, { useEffect, useState } from 'react';
import Pagination from '../../compoents/Pagination';
import '../../assets/css/boardList.css';
import { useQuery } from '@tanstack/react-query';
import { boardAPI } from '../../service/boardService';
import { Link, useNavigate } from 'react-router';


function BoardList(props) {

    const [page, setPage] = useState(0);
    const [boardList, setBoardList] = useState([]);
    const [totalRows, setTotalRows] = useState(0);

    const navigate = useNavigate();
    

    const {data, isLoading, error} = useQuery({
        queryKey:['board', page],
        queryFn: () => boardAPI.list(page),
    })

    useEffect(()=>{
        if(data){
          setPage(data.page);
          setTotalRows(data.total);
          setBoardList(data.content);
        }
    },[data]);


    const movePage = (pageNum) =>{
        setPage(pageNum);
    }

    const goWrite = () =>{
        navigate('/board/add');
    }

    return (
        <>
         <main className='container'>
            <header className='header'>
                <h2>게시글 리스트</h2>
            </header>
            <section className='contents'>
                <div className='text-end my-3'>
                    <button type='button' className='btn btn-outline-primary' onClick={goWrite}>등록</button>
                </div>
                <table className='table'>
                    <colgroup>
                       <col style={{width:'15%'}}/>
                       <col style={{width:'40%'}}/>
                       <col style={{width:'15%'}}/>
                       <col style={{width:'10%'}}/>
                       <col style={{width:'20%'}}/>
                    </colgroup>
                    <thead className='table-dark'>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>글쓴이</th>
                            <th>조회 수</th>
                            <th>생성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            boardList?.map(obj=>(
                                <tr key={obj.brdId}>
                                    <td>{obj.brdId}</td>
                                    <td>
                                    <Link to={`/board/${obj.brdId}`}
                                        className='text-decoration-none text-black' 
                                    > {obj.title}</Link>
                                       
                                    
                                    </td>
                                    <td>{obj.writer}</td>
                                    <td>{obj.readCount}</td>
                                    <td>{obj.createDate}</td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </section>
            <section>
               <Pagination 
                    page={page}
                    totalRows={totalRows}
                    movePage={movePage}/>
            </section>
         </main>
        </>
    );
}

export default BoardList;