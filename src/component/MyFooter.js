import '../App.css';
import '../style/style.css';
import React from 'react';
import { Container, Image, Row, Col } from 'react-bootstrap';

export default function MyFooter(){
    return(
<footer className='p-4' style={{backgroundColor: '#FF7DC8'}}>
        <Container className='my-footer'>
        <Row className='mt-4'>
        <Col style={{textAlign: 'center'}}>
        <h5 style={{color: 'white', fontWeight: 'bold'}}>고객센터</h5>
        <h2 style={{color: 'white'}}>1588-5000</h2>
        <p style={{color: 'white'}}>damoyeo@naver.com</p>
        </Col>
        <Col style={{textAlign: 'center'}}>
        <h5 style={{color: 'white', fontWeight: 'bold'}}>다모여 정보</h5>
        <h5 style={{color: 'white'}}>(주) 퍼니엠 Funny Co., Ltd 대표 김OO</h5>
        <p style={{color: 'white'}}>서울시 성동구 왕십리로</p>
        <p style={{color: 'white'}}>영업소: 서울시 성동구 광나루로</p>
        </Col>
        <Col style={{textAlign: 'center'}}>
        <a href="https://www.instagram.com/" target="blank"><Image src="img/instagram.png" style={{width: '70px', marginRight: '30px'}}></Image></a>
        <a href="https://line.me/ko/" target="blank"><Image src="img/line.png" style={{width: '60px', marginRight: '30px'}}></Image></a>
        <a href="https://www.facebook.com/" target="blank"><Image src="img/facebook.png" style={{width: '60px'}}></Image></a>
        </Col>
        </Row>
        </Container>
      </footer>
    );
}