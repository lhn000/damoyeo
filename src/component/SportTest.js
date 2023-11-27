import '../App.css';
import '../style/style.css';
import React from 'react';
import { Container, Image, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import callApi from './ApiService';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';

export default function SportTest(){
 //운동 유형 검사 기능
 const [result1, setResult1] = useState('');
 const [result2, setResult2] = useState('');
 const [result3, setResult3] = useState('');
 let testResult = null;

 const [title, setTitle] = useState('');
 const [content, setContent] = useState('');
 const [subContent, setSubContent] = useState('');
 const [nickname, setNickname] = useState('');

 //빈 칸 유효성 검사 함수
 function validate(){
    if(result1==null || result1=='' || result2==null || result2=='' || result3==null || result3==''){
        throw new Error();
    }
 }

 //테스트 결과 도출 함수
 function doTest(){
    if (result1==='no' && result2==='yes' && result3==='no') {
      testResult = '실내 같이 저강도';
	}

	if (result1==='no' && result2==='yes' && result3==='yes') {
		testResult = '실내 같이 고강도';
	}

	if (result1==='no' && result2==='no' && result3==='no') {
		testResult = '실내 혼자 저강도';
	}

	if (result1==='no' && result2==='no' && result3==='yes') {
		testResult = '실내 혼자 고강도';
	}

	if (result1==='yes' && result2==='yes' && result3==='no') {
		testResult = '야외 같이 저강도';
	}

	if (result1==='yes' && result2==='yes' && result3==='yes') {
		testResult = '야외 같이 고강도';
	}

	if (result1==='yes' && result2==='no' && result3==='no') {
		testResult = '야외 혼자 저강도';
	}

	if (result1==='yes' && result2==='no' && result3==='yes') {
		testResult = '야외 혼자 고강도';
	}
 }

 //결과 보기 버튼 눌렀을 때 실행되는 함수
 function handleSendResult(e){
    try{
        validate();
        doTest();

        callApi('http://localhost:8080/sportApi/sportTestResult/'+testResult, 'GET')
        .then(response=>{
          //로그인한 유저가 버튼 누른 경우 - 정상 작동
          if(response.status === 200){
              response.json().then((json)=>{
                if(json.title){
                  setTitle(json.title);
                  setContent(json.content);
                  setSubContent(json.subContent);
                  setNickname(json.nickname);
                  
                //로그인한 유저가 버튼 눌렀을 경우의 에러 발생, 에러 문구 alert
                }else{
                  alert(json.error);
                }
              })

          //로그인하지 않은 유저가 버튼 누른 경우 - 접근 막아놓음, 403 badRequest, alert 띄우고 로그인 페이지로 보내기
          }else{
            alert('로그인이 필요한 서비스입니다! 로그인을 해주세요.');
            window.location = '/login';
          }
      })
      .catch(e=>{console.log(e);})      

    }catch(e){
        alert('모든 질문에 답변해주세요!');
    }
    e.preventDefault();
 }

    return(
        <div className='my-page'>
        <Container fluid>
        <MyNavbar />
      <Image style={{marginTop: '50px'}} src='img/sportTest.jpg' alt='sportTest image' fluid />
      
{
  title == '' 

  ? <>
  <div className="my-sportTest">
  <Container className="my-container" >
<Form>
  <div key='inline-radio1' style={{marginBottom: '100px'}}>
    <h4>Q1. 밖에 있을 때 에너지를 얻는 편인가요, 잃는 편인가요?</h4>
    <Form.Check className="mt-3" style={{fontSize: '18px'}} inline label="네! 밖에서 에너지가 쭉쭉 생겨요." 
    name="group1" type='radio' id='inline-radio-1' value="yes" onChange={()=>setResult1("yes")} />
    <Form.Check className="mt-3" style={{fontSize: '18px'}} inline label="아니요, 밖에 있으면 에너지가 점점 사라져요." 
    name="group1" type='radio' id='inline-radio-2' value="no" onChange={()=>setResult1("no")} />
  </div>
  <div key='inline-radio2' style={{marginBottom: '100px'}}>
    <h4>Q2. 평소 단체 활동을 즐기시나요?</h4>
      <Form.Check className="mt-3" style={{fontSize: '18px'}} inline label="네! 사람들과 있는게 좋아요." 
      name="group2" type='radio' id='inline-radio-3' value="yes" onChange={()=>setResult2("yes")} />
      <Form.Check className="mt-3" style={{fontSize: '18px'}} inline label="아니요, 혼자 있어야 편해요." 
      name="group2" type='radio' id='inline-radio-4' value="no" onChange={()=>setResult2("no")} />
  </div>
  <div key='inline-radio3' style={{marginBottom: '100px'}}>
    <h4>Q3. 운동 후 숨이 차는 기분을 즐겨본 경험이 있나요?</h4>
      <Form.Check className="mt-3" style={{fontSize: '18px'}} inline label="네! 즐겨본 경험이 있고 좋아해요." 
      name="group3" type='radio' id='inline-radio-5' value="yes" onChange={()=>setResult3("yes")} />
      <Form.Check className="mt-3" style={{fontSize: '18px'}} inline label="아니요, 즐겨본 경험이 없고 힘들 것 같아요." 
      name="group3" type='radio' id='inline-radio-6' value="no" onChange={()=>setResult3("no")} />
  </div>
  <Button onClick={handleSendResult} variant="primary" size="lg">결과 보기</Button>
</Form>
</Container>
</div>
</>

  : <>
  <div className="my-sportTest-result">
  <Container className="my-container-result" >
  <h2 style={{textAlign: 'center'}}>당신의 운동 유형은 <strong className='my-strong'>{nickname}</strong></h2><br/><br/>
  <div style={{paddingLeft: '100px', paddingRight: '100px', fontSize: '18px'}} dangerouslySetInnerHTML={{ __html: content }}></div><hr/>
  <h4 style={{marginTop:'50px', textAlign: 'center'}}>▼ 이런 운동을 추천드려요! ▼</h4><br/><br/>
  <div style={{paddingLeft: '100px', paddingRight: '100px', fontSize: '18px'}} dangerouslySetInnerHTML={{ __html: subContent }}></div><br/><br/>
  <Button onClick={()=>window.location = '/sportTest'} style={{marginLeft: '45%'}} variant="primary" size="lg">뒤로 가기</Button>
  </Container>
  </div>  
  </>
}
<MyFooter />
      </Container>
        </div>
    );
}