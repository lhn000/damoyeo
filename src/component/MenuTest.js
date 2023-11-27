import '../App.css';
import '../style/style.css';
import React from 'react';
import { Container, Image, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import callApi from './ApiService';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';

export default function MenuTest(){
 //식단 유형 검사 기능
 const [result1, setResult1] = useState('');
 const [result2, setResult2] = useState('');
 const [result3, setResult3] = useState('');
 const [result4, setResult4] = useState('');
 const [result5, setResult5] = useState('');
 let testResult = null;

 const [title, setTitle] = useState('');
 const [content, setContent] = useState('');
 const [subContent, setSubContent] = useState('');
 const [nickname, setNickname] = useState('');

 //빈 칸 유효성 검사 함수
 function validate(){
    if(result1==null || result1=='' || result2==null || result2=='' || result3==null || result3=='' || result4==null || result4=='' || result5==null || result5==''){
        throw new Error();
    }
 }

 //테스트 결과 도출 함수
 function doTest(){
    if(result5 == "no"){
		if(result3 == "no" && result4 == "yes"){
		testResult = '키토제닉식단';	
		}else{
			if(result4 == "no"){
			testResult = '저지방고단백식단';	
			}
		}
		if(result1 == "yes"){		
		if(result2 == "yes"){
			testResult = '디톡스식단';
		}else{
			testResult = '원푸드식단';
		    }
		}
	}else{
		testResult = '간헐적단식식단';	
	}
 }

 //결과 보기 버튼 눌렀을 때 실행되는 함수
 function handleSendResult(e){
    try{
        validate();
        doTest();

        callApi('http://localhost:8080/menuApi/menuTestResult/'+testResult, 'GET')
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
      <Image style={{marginTop: '50px'}} src='img/menuTest.jpg' alt='menuTest image' fluid />
      
{
  title == '' 
  ? <>
  <div className="my-menuTest">
  <Container className="my-container2" >
<Form>
  <div key='inline-radio1' style={{marginBottom: '100px'}}>
    <h4>Q1. 목표가 단기 다이어트(2주) 인가요?</h4>
    <Form.Check className="mt-2" style={{fontSize: '18px'}} inline label="네! 단기간에 빼고 싶어요." 
    name="group1" type='radio' id='inline-radio-1' value="yes" onChange={()=>setResult1("yes")} />
    <Form.Check className="mt-2" style={{fontSize: '18px'}} inline label="아니요, 한 달 이상 고려하고 있어요." 
    name="group1" type='radio' id='inline-radio-2' value="no" onChange={()=>setResult1("no")} />
  </div>
  <div key='inline-radio2' style={{marginBottom: '100px'}}>
    <h4>Q2. 디톡스가 효과와 필요성이 있다고 생각하나요?</h4>
      <Form.Check className="mt-2" style={{fontSize: '18px'}} inline label="네! 디톡스 해독은 좋다고 생각해요." 
      name="group2" type='radio' id='inline-radio-3' value="yes" onChange={()=>setResult2("yes")} />
      <Form.Check className="mt-2" style={{fontSize: '18px'}} inline label="아니요. 생각해본 적 없어요." 
      name="group2" type='radio' id='inline-radio-4' value="no" onChange={()=>setResult2("no")} />
  </div>
  <div key='inline-radio3' style={{marginBottom: '100px'}}>
    <h4>Q3. 고기보다 탄수화물이 더 중요하다고 생각하나요?</h4>
      <Form.Check className="mt-2" style={{fontSize: '18px'}} inline label="한국인은 밥 힘!" 
      name="group3" type='radio' id='inline-radio-5' value="yes" onChange={()=>setResult3("yes")} />
      <Form.Check className="mt-2" style={{fontSize: '18px'}} inline label="고기 없인 못 살아!" 
      name="group3" type='radio' id='inline-radio-6' value="no" onChange={()=>setResult3("no")} />
  </div>
  <div key='inline-radio4' style={{marginBottom: '100px'}}>
    <h4>Q4. 치킨먹을 때 닭다리를 좋아하나요?</h4>
    <Form.Check className="mt-2" style={{fontSize: '18px'}} inline label="부드러운 닭다리가 최고지~" 
    name="group4" type='radio' id='inline-radio-7' value="yes" onChange={()=>setResult4("yes")} />
    <Form.Check className="mt-2" style={{fontSize: '18px'}} inline label="고소한 닭가슴살이 최고지~" 
    name="group4" type='radio' id='inline-radio-8' value="no" onChange={()=>setResult4("no")} />
  </div>
  <div key='inline-radio5' style={{marginBottom: '100px'}}>
    <h4>Q5. 한 끼를 먹을 때 배부르게 먹어야 한다고 생각하나요?</h4>
    <Form.Check className="mt-2" style={{fontSize: '18px'}} inline label="한끼를 먹더라도 든든히!" 
    name="group5" type='radio' id='inline-radio-9' value="yes" onChange={()=>setResult5("yes")} />
    <Form.Check className="mt-2" style={{fontSize: '18px'}} inline label="적당히 먹어도 괜찮지." 
    name="group5" type='radio' id='inline-radio-10' value="no" onChange={()=>setResult5("no")} />
  </div>
  <Button onClick={handleSendResult} variant="primary" size="lg">결과 보기</Button>
</Form>
</Container>
</div>
</>
  : <>
  <div className="my-menuTest-result">
  <Container className="my-container-result2" >
  <h2 style={{textAlign: 'center'}}>당신의 식단 유형은 <strong className='my-strong'>{nickname}</strong></h2><br/><br/>
  <div style={{paddingLeft: '100px', paddingRight: '100px', fontSize: '18px'}} dangerouslySetInnerHTML={{ __html: content }}></div><hr/>
  <h4 style={{marginTop:'50px', textAlign: 'center'}}>▼ 이런 식단을 추천드려요! ▼</h4><br/><br/>
  <div style={{paddingLeft: '100px', paddingRight: '100px', fontSize: '18px'}} dangerouslySetInnerHTML={{ __html: subContent }}></div><br/><br/>
  <Button onClick={()=>window.location = '/menuTest'} style={{marginLeft: '45%'}} variant="primary" size="lg">뒤로 가기</Button>
  </Container>
  </div>  
  </>
}
<MyFooter />
      </Container>
        </div>
    );
}