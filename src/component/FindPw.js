import '../style/style.css';
import callApi from './ApiService';
import React from "react";
import { useState } from "react";
import { Container, FloatingLabel, Form, Button, Image, InputGroup } from "react-bootstrap";
import { Link } from 'react-router-dom';

export default function FindPw(){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [emailCheck, setEmailCheck] = useState('');
    const [emailCode, setEmailCode] = useState('null');
    
  const handleUserName = (e) => {
    setUsername(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleEmailCheck = (e) => {
    setEmailCheck(e.target.value);
  };

  function checkValidate(){
    if(username==null || username=='' || email==null || email==''){
        throw new Error();
    }
}

    //인증번호 발송 버튼 누를 시 실행되는 함수
    function handleSendEmailCode(){
        //우선 아이디-이메일 회원정보 존재하는지 확인
        const submitUserData = {username, email};

            callApi('http://localhost:8080/memberApi/findPwd', 'POST', submitUserData)
            .then(response=>response.json()).then((json)=>{

                 //있을 경우 인증번호 발송해주기
                if(json.username){
                    sessionStorage.setItem('username', json.username);
                    callApi('http://localhost:8080/memberApi/mailConfirm/'+email, 'GET')
                    .then(response=>response.json()).then((json)=>{
                        if(json.code){
                            setEmailCode(json.code);
                        }
                    });
                    alert('입력하신 이메일 주소로 인증번호를 발송했습니다.');

                //없으면 발송X 이메일 다시 입력하게 하기
                }else{
                    alert(json.error);
                    setEmail('');
                    return;
                }
            });
    }

    //비밀번호 찾기 버튼 누르면 실행-인증번호 일치할 경우 비밀번호 변경 페이지로 이동(이메일 정보 보내줘야함)
    function handleFindPw(e){
        try{
            checkValidate();
            console.log(emailCheck);
            console.log(emailCode);

            if(emailCheck==emailCode){
                
                window.location = '/changePw';
            }

        }catch(e){
             alert('빈 칸을 모두 작성해주세요.');
        }
        e.preventDefault(); 
    }

    //인증번호 일치하는지 확인
    function handleCheckEmail(){
        if(emailCheck==emailCode){
            alert('인증번호 확인 완료.');
            return true;
        }else {
            alert('인증번호 오류! 다시 확인해주세요.');
            return false;
        }
    }

    return(
        <div class="my-page my_div my_bg">
            <Container fluid>
                <div id="divLogin_2">
                    <h1 class="my-strong opacity-75" style={{fontSize: '100px', fontWeight: 'bold'}}>Find PW</h1>
                </div>
                <div class="opacity-75" id="divLogin" style={{width: '1000px', height: '580px', backgroundColor: 'white'}}>

                    <Container style={{width: '800px', marginTop: '80px'}}>
                        <FloatingLabel controlId="floatingInput_userName" label="User Name" className="mb-3">
                            <Form.Control type="text" placeholder="User Name" name="userName" value={username} onChange={handleUserName}/>
                        </FloatingLabel>

        <InputGroup className="mb-1">
        <FloatingLabel controlId="floatingInput_EmailAddress" label="Email Address">
            <Form.Control placeholder="Email Address" aria-label="Email Address" aria-describedby="basic-addon2" name="emailAddress" value={email} onChange={handleEmail}/>
        </FloatingLabel>
        <Button onClick={handleSendEmailCode} variant="secondary" id="button-addon2">인증번호 발송</Button>
        </InputGroup>

        <InputGroup className="mb-4">
        <Form.Control type="text" placeholder="Email Verification Code" aria-label="Email Verification Code" aria-describedby="basic-addon1" name="emailCodeCheck"
        value={emailCheck} onChange={handleEmailCheck}/>
        <Button onClick={handleCheckEmail} variant="outline-secondary" id="button-addon1">check</Button>
        </InputGroup>

                        <div className="d-grid gap-2 mt-5">
                            <Button id="findBt" onClick={handleFindPw} variant="dark" size="lg">비밀번호 찾기</Button>
                            <span style={{marginLeft: '560px'}}>아직 회원이 아니신가요? <Link to="/signup" variant="body2">회원가입</Link></span>
                            <span className="mt-3" style={{marginLeft: '640px'}}>
                            <Link className="me-2" to="/findId" variant="body2">아이디 찾기 </Link><Link to="/login" variant="body2">로그인</Link>
                            </span>
                        </div>
                        <p className="text-center mt-3 mb-10"><Link to="/" variant="body2"><Image src='img/logo.png' alt='logo image' width={100}/></Link></p>
                    </Container>
                </div>
            </Container>
        </div>
    );
}