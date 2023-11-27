import '../style/style.css';
import callApi from './ApiService';
import React from "react";
import { useState } from "react";
import { Container, FloatingLabel, Form, Button, Image } from "react-bootstrap";
import { Link } from 'react-router-dom';

export default function FindId(){
    const [email, setEmail] = useState('');
    const [message, setMassage] = useState('');

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  function checkValidate(){
    if(email==null || email==''){
        throw new Error();
    }
}

    function handleFindId(e){
        try{
            checkValidate();

            callApi('http://localhost:8080/memberApi/findId/'+email, 'GET')
            .then(response=>response.json()).then((json)=>{
                if(json.username){
                    setMassage("해당 이메일 주소로 가입된 아이디는 [" + json.username + "] 입니다.");
                }else{
                    setMassage(json.error);
                }
            });
        }catch(e){
             alert('빈 칸을 모두 작성해주세요.');
        }
        e.preventDefault();
    }

    function handleKeyDown(event){
        if(event.key === 'Enter'){
            handleFindId(event);
        }
    }

    return(
        <div class="my-page my_div my_bg">
            <Container fluid>
                <div id="divLogin_2">
                    <h1 class="my-strong opacity-75" style={{fontSize: '100px', fontWeight: 'bold'}}>Find ID</h1>
                </div>
                <div class="opacity-75" id="divLogin" style={{width: '1000px', height: '500px', backgroundColor: 'white'}}>

                    <Container style={{width: '800px', marginTop: '100px'}}>
                        <FloatingLabel controlId="floatingInput" label="Email Address" className="mb-3">
                            <Form.Control type="email" placeholder="Email Address" name="Email Address" value={email} onChange={handleEmail} onKeyDown={(e)=>handleKeyDown(e)}/>
                        </FloatingLabel>

                        <p className='mt-3'>{message}</p>

                        <div className="d-grid gap-2 mt-5">
                            <Button onClick={handleFindId} variant="dark" size="lg">아이디 찾기</Button>
                            <span style={{marginLeft: '560px'}}>아직 회원이 아니신가요? <Link to="/signup" variant="body2">회원가입</Link></span>
                            <span className="mt-3" style={{marginLeft: '635px'}}>
                            <Link className="me-2" to="/login" variant="body2">로그인</Link><Link to="/findPw" variant="body2">비밀번호 찾기 </Link>
                            </span>
                        </div>
                        <p className="text-center mt-3 mb-10"><Link to="/" variant="body2"><Image src='img/logo.png' alt='logo image' width={100}/></Link></p>
                    </Container>
                </div>
            </Container>
        </div>
    );
}