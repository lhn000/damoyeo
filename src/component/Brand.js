import '../App.css';
import '../style/style.css';
import React from 'react';
import { Container, Image } from 'react-bootstrap';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';

export default function Brand(){
    return(
        <div className='my-page'>
        <Container fluid>
        <MyNavbar />
      <Image src='img/brand01.png' alt='brand top image' fluid />
      
      <Container className="my-div">
        <h5>
            다.모.여는 <strong className='my-strong'>[다이어트의 모든 것을 여기서]</strong>의 줄임말으로,<br/><br/>
            다이어트를 하는 회원 분들을 위한 종합적인 다이어트 전문 플랫폼입니다.<br/><br/><br/><br/>
            '다모여'에서는 개인별 식단+운동 유형 파악을 통해 맞춤 관리 및 정보를 제공하며,<br/><br/>
            스케쥴러를 통해 자신의 다이어트 일정 및 목표를 기록하고 관리할 수 있습니다.<br/><br/>
            또한 다모여샵을 통하여 필요한 용품까지 바로 구매가 가능합니다.<br/><br/><br/><br/>
            1:1 전문가 매칭을 통해 다이어트 방향 및 조언 등을 제공받을 수 있도록 하여<br/><br/>
            <strong className='my-strong'>여러분의 다이어트 성공에 체계적이고 전문적인 도움을 주고자 합니다.</strong><br/>
        </h5>
      </Container>

      <Image src='img/brand02.jpg' alt='brand bottom image' fluid />
      <MyFooter />
      </Container>
        </div>
    );
}