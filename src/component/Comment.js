import '../App.css';
import '../style/style.css';
import React from 'react';
import { Card, Table, Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import callApi from './ApiService';

export default function Comment({postId}){

//댓글 목록 가져오기
const [commentList, setCommentList] = useState([]);

useEffect(()=>{ 
    callApi('http://localhost:8080/commentApi/getAll/'+postId, 'GET')
    .then((response)=>{return response.json();}).then((json)=>setCommentList(json))
    .catch((status)=>console.log(status));
  }, [])

  //댓글 추가 기능
  const [commentText, setCommentText] = useState('');

  function handleCommentText(e){
    setCommentText(e.target.value);
  }

  function checkValidate(){
    if(commentText==null || commentText==''){
        throw new Error();
    }
}

//댓글 작성 버튼 눌렀을 때 실행
  function handleAddComment(event){
    try{
        checkValidate();

        const submitData = {communityId: postId, content: commentText};

        callApi('http://localhost:8080/commentApi/addComment', 'POST', submitData)
        .then(response=>response.json()).then((json)=>{
            if(json){
                alert('댓글이 정상적으로 등록되었습니다.');
                setCommentText('');
                setCommentList(json);
            }
        });
    }catch(e){
         alert('댓글 내용을 작성해주세요.');
    }
    event.preventDefault(); 
  }

  //댓글 삭제 버튼 눌렀을 때 실행
  function handleClickDelete(commentId){
    const submitData = {commentId, postId};

    if (window.confirm("댓글을 정말로 삭제하시겠습니까?")) {
        callApi('http://localhost:8080/commentApi/deleteComment', 'POST', submitData)
        .then(response=>response.json()).then((json)=>{
            if(json){
                alert('댓글이 정상적으로 삭제되었습니다.');
                setCommentList(json);
            }
        });
      }
  }

    return(
<>
        <Card className='p-3'>
        <Card.Title><h4>COMMENT</h4></Card.Title>
        <Table striped bordered>
        <tbody>
            {
            (commentList.length!==0)
            ?
            commentList.map((comment, i)=>(
            <tr>
                <td style={{width: '50px', textAlign: 'center'}}>{i+1}</td>
                <td style={{width: '300px', textAlign: 'center'}}>{comment.username} ({comment.memberType} 회원) / {comment.commentDate}</td>
                <td>{comment.content}</td>
                <td style={{width: '100px', textAlign: 'center'}}>  
                    {
                        comment.username == sessionStorage.getItem('username') || sessionStorage.getItem('role')=='TRUE'
                        ? <Button onClick={()=>handleClickDelete(comment.id)} variant="light">삭제</Button>
                        : <></>
                    }
                </td>
            </tr>
            ))
        :<tr>
            <td>등록된 댓글이 없습니다.</td>
        </tr>
        }
        </tbody>
        </Table>
        </Card>

        {
            sessionStorage.getItem('token')
            ?
            <>
        <Card className='p-3 mt-3'>
        <Table style={{textAlign: 'center'}}>
            <tbody>
            <tr>
                <td style={{borderBottom: 'none', width: '200px'}}>{sessionStorage.getItem('username')} ({sessionStorage.getItem('type')} 회원)</td>
                <td style={{borderBottom: 'none'}}>
                    <Form.Control type="text" placeholder="상대방을 존중하는 댓글을 남깁시다. (30자 이하)" name="commentText" style={{height: '150px'}} 
                    value={commentText} onChange={handleCommentText}/>
                </td>
                <td style={{borderBottom: 'none', width: '200px'}}><Button onClick={handleAddComment} className="me-3" variant="secondary" size='lg'>댓글 작성</Button></td>
            </tr>
            </tbody>
        </Table>
        </Card>
            </>
            :<></>
        }
</>
    );
}