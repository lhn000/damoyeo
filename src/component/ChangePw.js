import '../style/style.css';
import callApi from './ApiService';
import React from "react";
import { useState } from "react";
import { Container, FloatingLabel, Form, Button, Image } from "react-bootstrap";
import { Link } from 'react-router-dom';

export default function ChangePw(){
    const [passwordForChange, setPasswordForChange] = useState('');
    const [checkPassword, setCheckPassword] = useState('');

    const handlePasswordForChange = (e) => {
        setPasswordForChange(e.target.value);
      };
      const handleCheckPassword = (e) => {
        setCheckPassword(e.target.value);
      };

      function checkValidate(){
        if(passwordForChange==null || passwordForChange=='' || checkPassword==null || checkPassword==''){
            throw new Error('nameRequired');
        }

        if(passwordForChange!=checkPassword){
            throw new Error('passwordCheckRequired');
        }
    }

    function handleCheckPasswordValidation(){
        const regex = /^(?=.*[`~!@#\$%\^&\*\(\)\{\}\[\]\-_=\+\\|;:'"<>,\./\?])(?=.*[a-zA-Z])(?=.*[0-9]).{8,15}$/g;
    
        if(!regex.test(passwordForChange)) {
            throw new Error('passwordValidateRequired');
        }
    }
    
    //비밀번호 변경 버튼 눌렀을 때 실행
    function handleChangePw(e){
        try{
            //유효성 검사
            checkValidate();
            handleCheckPasswordValidation();

            //더블체크 일치하면 비밀번호 업데이트 실행
            callApi('http://localhost:8080/memberApi/pwdUpdate', 'POST', {password: checkPassword, userName: sessionStorage.getItem('username')})
            .then(response=>response.json()).then((json)=>{

                //변경 성공 시 
                if(json.data){
                    alert(json.data);
                    sessionStorage.removeItem('username');
                    window.location = '/login';
                    
                //변경 에러 시
                }else{
                    alert(json.error);
                    setPasswordForChange('');
                    setCheckPassword('');
                }
            });

        }catch(e){
            switch(e.message){
                case 'nameRequired':
                    alert('모든 창을 입력해주세요.');
                    break;
                case 'passwordCheckRequired':
                    alert('비밀번호가 불일치합니다. 비밀번호 확인을 해주세요.');
                    break;
                case 'passwordValidateRequired':
                    alert('비밀번호는 8자 이상-15자 이하여야 하고, 숫자/영어/특수문자를 각각 1개 이상 반드시 포함해야 합니다.');
                    break;
                default:
                    break;
            }
        }
        e.preventDefault();
    }

    function handleKeyDown(event){
        if(event.key === 'Enter'){
            handleChangePw(event);
        }
    }

    return(
        <div class="my-page my_div my_bg">
            <Container fluid>
                <div id="divLogin_3">
                    <h1 class="my-strong opacity-75" style={{fontSize: '90px', fontWeight: 'bold'}}>Update PW</h1>
                </div>
                <div class="opacity-75" id="divLogin" style={{width: '1000px', height: '530px', backgroundColor: 'white'}}>

                    <Container style={{width: '800px', marginTop: '80px'}}>
                        <FloatingLabel controlId="floatingInput_password" label="Password For Change" className="mb-3">
                            <Form.Control type="password" placeholder="Password For Change" name="passwordForChange" 
                            value={passwordForChange} onChange={handlePasswordForChange}/>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInput_CheckPassword" label="Check Password">
                            <Form.Control type="password" placeholder="Check Password" name="Check Password" 
                            value={checkPassword} onChange={handleCheckPassword} onKeyDown={(e)=>handleKeyDown(e)} />
                        </FloatingLabel>

                        <div className="d-grid gap-2 mt-5">
                            <Button onClick={handleChangePw} variant="dark" size="lg">비밀번호 변경</Button>
                            <span style={{marginLeft: '490px'}}>지금 바로 다모여 사이트에 접속하세요! <Link to="/login" variant="body2">로그인</Link></span>
                        </div>
                        <p className="text-center mt-5 mb-10"><Link to="/" variant="body2"><Image src='img/logo.png' alt='logo image' width={100}/></Link></p>
                    </Container>
                </div>
            </Container>
        </div>
    );
}