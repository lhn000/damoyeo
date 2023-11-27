import '../App.css';
import '../style/style.css';
import React from 'react';
import { Button, Container, Image, Card, Row, Col, Badge, Carousel, Form, InputGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';
import callApi from './ApiService';

export default function Shop(){

//식품, 운동 용품, 모두 보기 버튼 클릭
async function handleClickFood(){
  const response = await fetch("http://localhost:8080/shopApi/getAllByType/식품");
  const info = await response.json();
  setProductList(info);
}

async function handleClickSport(){
  const response = await fetch("http://localhost:8080/shopApi/getAllByType/운동");
  const info = await response.json();
  setProductList(info);
}

function handleClickAll(){
  window.location = '/shop';
}

//상품 목록 가져오기
const [productList, setProductList] = useState([]);
let foodList = [];
let sportList = [];

useEffect(()=>{ 
    callApi('http://localhost:8080/shopApi/getAllProduct', 'GET')
    .then((response)=>{return response.json();}).then((json)=>{
      setProductList(json);
    })
    .catch((status)=>console.log(status));
  }, [])

  for(let p of productList){
    if(p.type=='식품'){
        foodList.push(p);
    }else if(p.type=='운동'){
        sportList.push(p);
    }
  }

  //상품 다중이미지 배열화 저장
  let imageArray = [];

  for(let p of productList){
    let nextImages = p.image.split(';');
    nextImages.pop();
    let nextP = {...p, image: nextImages};
    imageArray.push(nextP);
    }

  function Cards(){
    const rows = [];

    for(let i=0; i<imageArray.length; i+=3){
        const rowCards = imageArray.slice(i, i+3);
        const row = (
            <>
            <Row>
                {
                rowCards.map((card)=>(
        <Col>
        <Card>
      <Card.Img onClick={()=>handleClick(card.id)} variant="top" src={'http://localhost:8080/coummunityApi/getImage/'+card.image[0]} />
      <Card.Body>
        <Card.Title className='mb-3' onClick={()=>handleClick(card.id)}>{card.name}</Card.Title>
        <Card.Text>
        <h4 className='my-strong'>{card.sale?<h6><Badge bg="info">sale</Badge></h6>:''} ₩{card.sale?<del>{priceToString(card.price)}</del>:priceToString(card.price)} 
        {' '}<span className="my-strong" style={{color: '#C65FF9', fontSize: '30px'}}>{card.sale?'₩'+priceToString(card.discountPrice):''}</span></h4>
        </Card.Text>
        <Container className='my-div2'>
        <Button onClick={()=>handleClickCart(card)} className="me-2" variant="light">장바구니 담기</Button>
        <Button variant="secondary" onClick={()=>handleClickPayment(card)}>바로 결제</Button>
        </Container>
      </Card.Body>
    </Card>
    </Col>
    ))}
    </Row><br/><br/><hr/><br/><br/></>
    );
    rows.push(row);
    }
    return rows;
  }

//상세페이지로 이동
const [product, setProduct] = useState(null);
const [imageUrl, setImageUrl] = useState([]);

async function handleClick(id){
    const response = await fetch("http://localhost:8080/shopApi/getProduct/"+id);
    const info = await response.json();
    setProduct(info);

  //다중 이미지 파일이름 ;로 나누고 리스트 저장
  if(info.image != null){
    let nextUrl = info.image.split(';');
    nextUrl.pop();
    setImageUrl(nextUrl);
  }
}

//상세 페이지 내 기능
//수량 버튼
const [amount, setAmount] = useState(1);

function handleChangeAmount(e){
    setAmount(e.target.value);
}

function handleClickMinus(){
  if(amount > 1){
    const nextAmount = amount - 1;
    setAmount(nextAmount);
  }else{
    setAmount(1);
  }
}

function handleClickPlus(){
    const nextAmount = amount + 1;
    setAmount(nextAmount);
}

//장바구니 담기
function handleClickCart(product){
  const productData = {productId: product.id, memberId: null, amount, salePrice: (product.sale)?product.discountPrice:product.price};

  callApi('http://localhost:8080/shopApi/addCart', 'POST', productData)
            .then(response=>{
                if(response.status === 200){
                  response.json().then((json)=>alert(json.msg));
                  setAmount(1);

                }else{
                    alert('로그인이 필요합니다.');
                    window.location = '/login';
                }
            })
            .catch(e=>{console.log(e);})
}

//총 금액 계산
let total = 0;
if(product!=null){
  total = amount*(product.sale?product.discountPrice:product.price);
}

//숫자 세자리마다 콤마
function priceToString(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//바로 결제
function handleClickPayment(product){
  sessionStorage.setItem('productId', product.id);
  sessionStorage.setItem('productAmount', amount);
  if(sessionStorage.getItem('token')){
    window.location = '/orderingPage';
  }else{
    alert('로그인이 필요합니다.');
    window.location = '/login';
  }
}

    return(
        <div className='my-page'>
        <Container fluid>
        <MyNavbar />
      <Image style={{marginTop: '50px'}} src='img/shop.jpg' alt='shop image' fluid />
      {
        product == null
        ?
        <>
        <Container className='my-div'>
      <Button onClick={handleClickAll} className='me-3' size='lg' variant="outline-secondary">모두 보기</Button>
        <Button onClick={handleClickFood} className='me-3' size='lg' variant="outline-secondary">식품</Button>
        <Button onClick={handleClickSport} size='lg' variant="outline-secondary">운동 용품</Button>
      </Container>
      
      <Container className='p-5'>
        <Cards />
      </Container>
        </>
        :
        <>
        <Container fluid className='p-5'>
        <Button onClick={()=>{setProduct(null); setAmount(1);}} variant="link">뒤로 가기</Button>    
        <Card>
      <Card.Header style={{textAlign: 'center'}}>상세 페이지</Card.Header>
      <Card.Body>
        <Card.Text> 
            <Row>
                <Col>
                <Carousel>
                  {imageUrl.map((image)=>(
                    <Carousel.Item>
                    <Image src={'http://localhost:8080/shopApi/getImage/'+image} className='m-5' width={700} />
                    </Carousel.Item>
                  ))}
    </Carousel>
                </Col>
                <Col>
                <Container className='p-5'>
                <h1 style={{textAlign: 'center'}}>{product.name}</h1>
                <hr/><br/>
                <h4>상품 소개</h4>
                <p>{product.description}</p><br/><br/>
                <h4>가격</h4>
                <h4 className='my-strong'>{product.sale?<h6><Badge bg="info">sale</Badge></h6>:''} ₩{product.sale?<del>{priceToString(product.price)}</del>:priceToString(product.price)}
                {' '}<span className="my-strong" style={{color: '#C65FF9', fontSize: '30px'}}>{product.sale?'₩'+priceToString(product.discountPrice):''}</span></h4><br/><br/>

                <h4>수량</h4>
                <InputGroup style={{width: '300px'}}>
                <Form.Control type="text" name="amount" value={amount} onChange={handleChangeAmount} readOnly/>
                <Button className="me-1" onClick={handleClickMinus} variant="light">-</Button>
                <Button onClick={handleClickPlus} variant="light">+</Button>
                </InputGroup><br/><br/>

                <h4 style={{textAlign: 'right'}}>총 금액 |<span style={{fontSize: '50px'}}> ₩{priceToString(total)}</span></h4>

                <Container className='my-div2 mt-5 pt-5'>
                <Button className="me-2" variant="primary" size='lg' onClick={()=>handleClickCart(product)}>장바구니 담기</Button>
                <Button variant="primary" size='lg' onClick={()=>handleClickPayment(product)}>바로 결제</Button>
                </Container>
                </Container>
                </Col>
            </Row>
        </Card.Text>
      </Card.Body>
    </Card>
</Container>
        </>
      }
      
      <MyFooter />
      </Container>
      </div>
    );
}