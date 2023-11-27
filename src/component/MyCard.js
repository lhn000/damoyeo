import '../App.css';
import '../style/style.css';
import React from 'react';
import { useState, useEffect } from 'react';
import callApi from './ApiService';
import { Card, Button, Row, Col, ListGroup, Stack, Badge } from 'react-bootstrap';

export default function MyCard(){

  //커뮤니티 게시물 조회수 높은 것 두 개 가져오기
  const [postList, setPostList] = useState([]);

  useEffect(()=>{ 
    callApi('http://localhost:8080/homeApi/getPosts', 'GET')
    .then((response)=>{return response.json();}).then((json)=>setPostList(json))
    .catch((status)=>console.log(status));
  }, [])

  //할인 상품 랜덤 두 개 가져오기
  const [productList, setProductList] = useState([]);

  useEffect(()=>{ 
    callApi('http://localhost:8080/homeApi/getProducts', 'GET')
    .then((response)=>{return response.json();}).then((json)=>setProductList(json))
    .catch((status)=>console.log(status));
  }, [])

  //상품 다중이미지 배열화 저장
  let imageArray = [];

  for(let p of productList){
    let nextImages = p.image.split(';');
    nextImages.pop();
    let nextP = {...p, image: nextImages};
    imageArray.push(nextP);
    }

//숫자 세자리마다 콤마
function priceToString(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//칼로리 사전 중 랜덤 세 개 가져오기
const [calories, setCalories] = useState([]);

  useEffect(()=>{ 
    callApi('http://localhost:8080/homeApi/getCalories', 'GET')
    .then((response)=>{return response.json();}).then((json)=>setCalories(json))
    .catch((status)=>console.log(status));
  }, [])

    return(
        <>
        <Row className="mb-5">
      <Col>
      <Stack gap={2}>
      <Card className="ms-5 me-5" style={{ width: '40rem' }}>
      <Card.Header><strong>커뮤니티 BEST</strong></Card.Header>
      <Card.Body>
        <Card.Title>{postList.length!=0?postList[0].title:''}</Card.Title>
        <Card.Text><div class="word">{postList.length!=0?postList[0].content:''}</div></Card.Text>
        <Button variant="outline-secondary" onClick={()=>window.location='/community'}>더보기</Button>
      </Card.Body>
    </Card>
    <Card className="ms-5 mt-3" style={{ width: '40rem' }}>
      <Card.Header><strong>커뮤니티 BEST</strong></Card.Header>
      <Card.Body>
        <Card.Title>{postList.length!=0?postList[1].title:''}</Card.Title>
        <Card.Text><div class="word">{postList.length!=0?postList[1].content:''}</div></Card.Text>
        <Button variant="outline-secondary" onClick={()=>window.location='/community'}>더보기</Button>
      </Card.Body>
    </Card>
    </Stack>
      </Col>
      
      <Col>
      <Card>
      <Card.Header><strong>다모여샵 SALE</strong></Card.Header>
      <Card.Body>
      <Card.Img variant="top" src={imageArray.length!=0?'http://localhost:8080/coummunityApi/getImage/'+imageArray[0].image[0]:''}/>
        <Card.Title className="mt-2">{imageArray.length!=0?imageArray[0].name:''}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {imageArray.length!=0
          ?<>
          {imageArray[0].sale?<h6><Badge bg="info">sale</Badge></h6>:''} ₩{imageArray[0].sale?<del>{priceToString(imageArray[0].price)}</del>:priceToString(imageArray[0].price)} 
          {' '}<span className="my-strong" style={{color: '#C65FF9', fontSize: '30px'}}>{imageArray[0].sale?'₩'+priceToString(imageArray[0].discountPrice):''}</span>
          </>
          :''}
        
        </Card.Subtitle>
        <Card.Text></Card.Text>
        <Card.Link href="/productForSale">할인 목록 보기</Card.Link>
        <Card.Link href="/shop">스토어로 이동</Card.Link>
      </Card.Body>
    </Card>
      </Col>

      <Col>
      <Card>
      <Card.Header><strong>다모여샵 SALE</strong></Card.Header>
      <Card.Body>
      <Card.Img variant="top" src={imageArray.length!=0?'http://localhost:8080/coummunityApi/getImage/'+imageArray[1].image[0]:''} />
        <Card.Title>{imageArray.length!=0?imageArray[1].name:''}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
        {imageArray.length!=0
          ?<>
          {imageArray[1].sale?<h6><Badge bg="info">sale</Badge></h6>:''} ₩{imageArray[1].sale?<del>{priceToString(imageArray[1].price)}</del>:priceToString(imageArray[1].price)} 
          {' '}<span className="my-strong" style={{color: '#C65FF9', fontSize: '30px'}}>{imageArray[1].sale?'₩'+priceToString(imageArray[1].discountPrice):''}</span>
          </>
          :''}
        </Card.Subtitle>
        <Card.Text></Card.Text>
        <Card.Link href="/productForSale">할인 목록 보기</Card.Link>
        <Card.Link href="/shop">스토어로 이동</Card.Link>
      </Card.Body>
    </Card>
      </Col>

      <Col>
      <Card className="ms-3 me-5" tyle={{ width: '18rem' }}>
      <Card.Header><strong>Let's see the calorie!</strong> (kcal)</Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item>{calories.length!=0?calories[0].type:''} | {calories.length!=0?calories[0].title:''} 
          {calories.length!=0?calories[0].unit:''} | {calories.length!=0?calories[0].calory:''}</ListGroup.Item>

          <ListGroup.Item>{calories.length!=0?calories[1].type:''} | {calories.length!=0?calories[1].title:''} 
          {calories.length!=0?calories[1].unit:''} | {calories.length!=0?calories[1].calory:''}</ListGroup.Item>

          <ListGroup.Item>{calories.length!=0?calories[2].type:''} | {calories.length!=0?calories[2].title:''} 
          {calories.length!=0?calories[2].unit:''} | {calories.length!=0?calories[2].calory:''}</ListGroup.Item>
          </ListGroup>
      </Card>
      </Col>
    </Row>
    <br/><br/><br/>
        </>
    );
}