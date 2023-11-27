import '../style/style.css';
import callApi from './ApiService';
import React from "react";
import { useState } from "react";
import { Container, FloatingLabel, Form, Button, Image } from "react-bootstrap";
import { Link } from 'react-router-dom';

export default function Login(){
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

  const handleUserName = (e) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  function checkValidate(){
    if(username==null || username=='' || password==null || password==''){
        throw new Error();
    }
}

    function handleLogin(event){
        try{
            checkValidate();

            const submitUserData = {username, password};

            callApi('http://localhost:8080/memberApi/signin', 'POST', submitUserData)
            .then(response=>response.json()).then((json)=>{
                if(json.token){
                    sessionStorage.setItem('token', json.token);
                    sessionStorage.setItem('username', json.username);
                    sessionStorage.setItem('type', json.type);
                    sessionStorage.setItem('role', json.role);
                    sessionStorage.setItem('userId', json.id);

                    window.location = '/';
                }else{
                    setMessage(json.error);
                    setUsername('');
                    setPassword('');
                }
            });
        }catch(e){
             alert('빈 칸을 모두 작성해주세요.');
        }
        event.preventDefault(); 
    }

    function handleKeyDown(event){
        if(event.key === 'Enter'){
            handleLogin(event);
        }
    }

    return(
        <div class="my-page my_div my_bg">
            <Container fluid>
                <div id="divLogin_2">
                    <h1 class="my-strong opacity-75" style={{fontSize: '100px', fontWeight: 'bold'}}>LOGIN</h1>
                </div>
                <div class="opacity-75" id="divLogin" style={{width: '1000px', height: '530px', backgroundColor: 'white'}}>

                    <Container style={{width: '800px', marginTop: '100px'}}>
                        <FloatingLabel controlId="floatingInput" label="User Name" className="mb-3">
                            <Form.Control type="text" placeholder="User Name" name="userName" value={username} onChange={handleUserName}/>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Password">
                            <Form.Control type="password" placeholder="Password" name="password" value={password} onChange={handlePassword} onKeyDown={(e)=>handleKeyDown(e)} />
                        </FloatingLabel>

                        <p className='mt-3'>{message}</p>

                        <div className="d-grid gap-2 mt-5">
                            <Button onClick={handleLogin} variant="dark" size="lg">login</Button>
                            <span style={{marginLeft: '560px'}}>아직 회원이 아니신가요? <Link to="/signup" variant="body2">회원가입</Link></span>
                            <span className="mt-3" style={{marginLeft: '600px'}}>
                                <Link className="me-2" to="/findId" variant="body2">아이디 찾기 </Link><Link to="/findPw" variant="body2">비밀번호 찾기</Link>
                            </span>
                        </div>
                        <p className="text-center mt-3 mb-10"><Link to="/" variant="body2"><Image src='img/logo.png' alt='logo image' width={100}/></Link></p>
                    </Container>
                </div>
            </Container>
        </div>
    );
}