import '../App.css';
import '../style/style.css';
import React from 'react';
import { Container, Image, Button, Card, CloseButton, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';
import axios from "axios";
import { Link } from 'react-router-dom';
import callApi from './ApiService';

export default function CommunityPost(){
//글 작성인지 수정인지 확인 후, 수정이면 해당글 객체 받아와서 값 넣어주기.
let updatePostId = -1;
const [updatePost, setUpdatePost] = useState(null);

if(sessionStorage.getItem('update')){
  updatePostId = sessionStorage.getItem('update');
}

useEffect(()=>{ 
  callApi('http://localhost:8080/coummunityApi/communityInfo/'+updatePostId, 'GET')
  .then((response)=>{
    if(response.status === 200){
      response.json().then((json)=>{setUpdatePost(json); setTitle(json.title); setContent(json.content);})
    }else{
      setUpdatePost(null);
    }
    }).catch((status)=>console.log(status));
}, [])

//텍스트 창 상태 저장
const [title, setTitle] = useState('');
const [content, setContent] = useState('');

function handleTitle(e){
    setTitle(e.target.value);
}

function handleContent(e){
    setContent(e.target.value);
}

//이미지 다중업로드 및 미리보기 구현
const [files, setFiles] = useState(null);	//파일	
  const [imgBase64, setImgBase64] = useState([]); // 파일 base64

  const handleChangeFile = (event) => {
    setFiles(event.target.files);
    setImgBase64([]);
    
    for(var i=0; i<event.target.files.length; i++){
      if (event.target.files[i]) {

        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]); // 1. 파일을 읽어 버퍼에 저장.
        // 파일 상태 업데이트
        reader.onloadend = () => {
          // 2. 읽기가 완료되면 아래코드가 실행.
          const base64 = reader.result;
          if (base64) {
          // 문자 형태로 저장
          var base64Sub = base64.toString()
          // 배열 state 업데이트
          setImgBase64(imgBase64 => [...imgBase64, base64Sub]);
          }
        }
      }
    }
  }
  
  //미리보기 삭제 시 파일리스트 연동
  const handleDeletePreview = (index) => {
    const newImages = [...files];
    const newPreviews = [...imgBase64];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newImages);
    setImgBase64(newPreviews);
  };

  function checkValidate(){
    if(title==null || title=='' || content==null || content==''){
        throw new Error();
    }
}

  //작성하기 버튼 누를 경우 실행
  //파일과 텍스트 함께 보내기
  const handleClickAdd = async (e) => {
    e.preventDefault();
    e.persist();

    try{
      checkValidate();
      
    let formData = new FormData();

    if(files!=null){
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }  
    }else{
      formData.append("file", null);
    }
    formData.append("title", title);
    formData.append("content", content);
    formData.append("id", updatePostId);
    formData.append("image", updatePost!=null ? updatePost.image : null);

    const token = sessionStorage.getItem('token');

    const postSurvey = await axios({
      method: "POST",
      url: `http://localhost:8080/coummunityApi/addPost`,
      mode: "cors",
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': 'Bearer ' + token,
      },
      data: formData,
    });
    console.log(postSurvey);
    alert('게시물이 정상적으로 등록되었습니다.');
    sessionStorage.removeItem('update');
    window.location = '/community';

  }catch(e){
    alert('제목과 내용을 모두 작성해주세요.');
}
e.preventDefault(); 
};

    return(
        <>
        <div className='my-page'>
        <Container fluid>
        <MyNavbar />
      <Image style={{marginTop: '50px'}} src='img/community.jpg' alt='community image' fluid />

      <Container fluid className='p-5'>
<Button variant="link"><Link to="/community" variant="body2">뒤로 가기</Link></Button>

<Card className='p-5'>
<Card.Title style={{textAlign: 'center'}}><h2>게시글 작성하기</h2></Card.Title><hr/>
      <Card.Body className='p-5'>
      <Form.Label htmlFor="basic-url"><strong className='my-strong'>Title</strong> (30자 이하)</Form.Label>
      <Form.Control className="mb-5" type="text" placeholder="제목을 입력해주세요." aria-label="title" aria-describedby="basic-addon1" value={title} onChange={handleTitle}/>

      <Form.Label htmlFor="input-file"><strong className='my-strong'>Image</strong> (최대 5장까지 가능)</Form.Label>
      <Form.Control id="input-file" className="mb-3" type="file" aria-label="image" aria-describedby="basic-addon2" 
      onChange={handleChangeFile} multiple/>

       <div className="preview mb-5">
              {imgBase64.map((item, i)=>(
              <>
              <img src={item} alt={"image"+{i}} width={150} style={{marginRight: '3px'}} />
              <CloseButton onClick={() => handleDeletePreview(i)} className='me-4'></CloseButton>
              </>
              ))}
      </div>

      <Form.Label htmlFor="basic-url"><strong className='my-strong'>Content</strong> (150자 이하)</Form.Label>
      <Form.Control as="textarea" placeholder="내용을 입력해주세요." aria-label="content" aria-describedby="basic-addon3" style={{height: '500px'}} 
      value={content} onChange={handleContent} />
      <Button onClick={handleClickAdd} className="mt-5" variant="primary" size='lg' style={{marginLeft: '50%'}}>작성하기</Button>
      </Card.Body>
</Card>
</Container>

<MyFooter />
      </Container>
      </div>
        </>
    );
}
