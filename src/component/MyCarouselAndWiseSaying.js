import '../App.css';
import '../style/style.css';
import React from 'react';
import { Carousel, Image, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import callApi from './ApiService';

export default function MyCarouselAndWiseSaying(){
    //캐러셀 이미지 리스트
  const carouselItemList = ['main01', 'main02', 'main03', 'main04', 'main05', 'main06'];

  //명언 리스트 가져오기
  const [wiseSayingList, setWiseSayingList] = useState([]);
  const [saying, setSaying] = useState({content: "인생은 살이 쪘을 때와 안쪘을 때로 나뉜다", writer: "이소라"});

  useEffect(()=>{ 
    callApi('http://localhost:8080/wiseSayingApi', 'GET').then((response)=>{return response.json();}).then((json)=>{setWiseSayingList(json);})
    .catch((status)=>console.log(status));
  }, [])

  //명언 리스트 내 객체 하나 랜덤 리턴 함수
  function getRandomWiseSaying(){
    const randomObject = wiseSayingList[Math.floor(Math.random() * wiseSayingList.length)];
    return randomObject;
  }

  //명언 7초마다 새로 뜨도록 하는 기능
  if(wiseSayingList.length !== 0){
    setTimeout(() => {
      const nextSaying = getRandomWiseSaying();
      setSaying(nextSaying);
    }, 7000);
  }

    return(
        <>
        <Carousel className='mt-3'>
        {carouselItemList.map((item)=>(
        <Carousel.Item>
          <Image src={`img/${item}.jpg`} alt={item} fluid />
        </Carousel.Item>
        ))}
      </Carousel>

    <Card className='mb-5'>
      <Card.Body>
        <blockquote className="blockquote mb-0">
        {
        wiseSayingList.length === 0
        ? <><p></p><footer className="blockquote-footer"></footer></>
        : <><p>{saying.content}</p><footer className="blockquote-footer">{saying.writer}</footer></>
      }
      </blockquote>
      </Card.Body>
    </Card>
        </>
    );
}