import '../style/style.css';
import callApi from './ApiService';
import React from "react";
import { useState } from "react";
import { Container, FloatingLabel, Form, Button, InputGroup, Image } from "react-bootstrap";
import { Link } from 'react-router-dom';

export default function Signup(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [email, setEmail] = useState('');
    const [emailCheck, setEmailCheck] = useState('');
    const [type, setType] = useState('');
    const [emailCode, setEmailCode] = useState('');

  const handleUserName = (e) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handlePasswordCheck = (e) => {
    setPasswordCheck(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleEmailCheck = (e) => {
    setEmailCheck(e.target.value);
  };

  function checkValidate(){
    if(username==null || username=='' || password==null || password=='' || email==null || email=='' || type==null || type==''){
        throw new Error('nameRequired');
    }

    //비밀번호 다른 경우
    if(password != passwordCheck){
        throw new Error('passwordCheckRequired');
    }

    //인증번호 다른 경우
    if(emailCheck != emailCode){
        throw new Error('emailCheckRequired');
    }
}

function handleSignup(e){
    try{
        checkValidate();

        const signupUserData = {username, password, email, menutype: null, sporttype: null, type};

        callApi('http://localhost:8080/memberApi/signup', 'POST', signupUserData)
            .then(response=>{
                if(response.status === 200){
                    window.location = '/login';
                }else{
                    throw Error(response.statusText);
                }
            })
            .catch(e=>{console.log(e);})       
            
    }catch(e){
        switch(e.message){
            case 'nameRequired':
                alert('모든 창을 입력해주세요.');
                break;
            case 'passwordCheckRequired':
                alert('비밀번호 확인을 해주세요.');
                break;
            case 'emailCheckRequired':
                alert('인증번호 확인을 해주세요.');
                break;
            default:
                break;
        }
    }
    e.preventDefault();
}

function handleCheckUserName(){
    callApi('http://localhost:8080/memberApi/signup/checkUserName/'+username, 'GET')
            .then(response=>response.json()).then((json)=>{

                //유저네임 중복없음 확인
                if(json.data){
                    //가능 alert 띄워주고 다음창 입력하도록 하기
                    alert(json.data);
                
                //유저네임 중복 alert 띄우기 
                }else{
                    alert(json.error);
                    setUsername('');
                }
            });
}

function handleSendEmailCode(){
    //먼저 이메일 중복여부 체크하기
    callApi('http://localhost:8080/memberApi/signup/checkEmail/'+email, 'GET')
            .then(response=>response.json()).then((json)=>{

                //이메일 중복없음 확인
                if(json.data){
                    //fetch로 자바에 호출, 발급된 인증번호 받아오기
                    callApi('http://localhost:8080/memberApi/mailConfirm/'+email, 'GET')
                    .then(response=>response.json()).then((json)=>{
                        if(json.code){
                            setEmailCode(json.code);
                        }
                    });
                    alert('입력하신 이메일 주소로 인증번호를 발송했습니다.');
                
                //이메일 중복, 회원가입 X
                }else{
                    alert(json.error);
                    setEmail('');
                }
            });
}

function handleCheckPassword(){
    if(password==passwordCheck){
        alert('비밀번호가 일치합니다.');
    }else {
        alert('비밀번호가 불일치합니다.');
    }
}

function handleCheckEmail(){
    //인증코드 일치하는지 확인
    if(emailCheck==emailCode){
        alert('인증번호 확인 완료.');
    }else {
        alert('인증번호 오류! 다시 확인해주세요.');
    }
}

function handleCheckPasswordValidation(){
    const regex = /^(?=.*[`~!@#\$%\^&\*\(\)\{\}\[\]\-_=\+\\|;:'"<>,\./\?])(?=.*[a-zA-Z])(?=.*[0-9]).{8,15}$/g;

    if(!regex.test(password)) {
    alert("비밀번호는 8자 이상-15자 이하여야 하고, 숫자/영어/특수문자를 각각 1개 이상 반드시 포함해야 합니다."); 
    return false;
    }
}

    return(
        <div class="my-page my_div my_bg">
            <Container fluid>
                <div id="divLogin_2">
                    <h1 class="my-strong opacity-75" style={{fontSize: '100px', fontWeight: 'bold'}}>SIGN UP</h1>
                </div>
                <div class="opacity-75" id="divLogin" style={{width: '1000px', height: '630px', backgroundColor: 'white'}}>
                    <Container style={{width: '800px', marginTop: '60px'}}>

                    <InputGroup className="mb-4">
                        <FloatingLabel controlId="floatingInput_UserName" label="User Name">
                            <Form.Control type="text" placeholder="User Name" name="userName" aria-label="Password Check" aria-describedby="basic-addon1" 
                            value={username} onChange={handleUserName}/>
                        </FloatingLabel>
                        <Button onClick={handleCheckUserName} variant="secondary" id="button-addon1">중복 확인</Button>
                    </InputGroup>

                        <FloatingLabel controlId="floatingInput_Password" label="Password" className="mb-1">
                            <Form.Control type="password" placeholder="Password" name="password" value={password} 
                            onChange={handlePassword} onBlur={() => handleCheckPasswordValidation()}/>
                        </FloatingLabel>
                        
        <InputGroup className="mb-4">
        <Form.Control type="password" placeholder="Password Check" aria-label="Password Check" aria-describedby="basic-addon2" name="passwordCheck" 
        value={passwordCheck} onChange={handlePasswordCheck}/>
        <Button onClick={handleCheckPassword} variant="outline-secondary" id="button-addon2">check</Button>
        </InputGroup>

        <InputGroup className="mb-1">
        <FloatingLabel controlId="floatingInput_EmailAddress" label="Email Address">
            <Form.Control placeholder="Email Address" aria-label="Email Address" aria-describedby="basic-addon3" name="emailAddress" value={email} onChange={handleEmail}/>
        </FloatingLabel>
        <Button onClick={handleSendEmailCode} variant="secondary" id="button-addon3">인증번호 발송</Button>
        </InputGroup>

        <InputGroup className="mb-3">
        <Form.Control placeholder="Email Verification Code" aria-label="Email Verification Code" aria-describedby="basic-addon4" name="emailCheck" 
        value={emailCheck} onChange={handleEmailCheck}/>
        <Button onClick={handleCheckEmail} variant="outline-secondary" id="button-addon4">check</Button>
        </InputGroup>

    <Form>
      {['radio'].map((t) => (
        <div key={`inline-${t}`} className="mb-3">
          <Form.Check type={t} inline label="일반 회원" name="userType" value="일반" onChange={()=>setType("일반")} id={`inline-${t}-1`} />
          <Form.Check type={t} inline label="전문 회원" name="userType" value="전문" onChange={()=>setType("전문")} id={`inline-${t}-2`} />
        </div>
      ))}
    </Form>
                        
                        <div className="d-grid gap-2 mt-5">
                            <Button onClick={handleSignup} variant="dark" size="lg">sign up</Button>
                            <span style={{marginLeft: '570px'}}>이미 계정이 있으신가요? <Link to="/login" variant="body2">로그인</Link></span> 
                        </div>
                        <p className="text-center mb-10"><Link to="/" variant="body2"><Image src='img/logo.png' alt='logo image' width={100}/></Link></p>
                    </Container>
                </div>
            </Container>
        </div>
    );
}