import '../App.css';
import '../style/style.css';
import React from 'react';
import { Container, Image, Form, Row, Col, Button, Card, Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';
import callApi from './ApiService';
import DaumPostcode from "react-daum-postcode";
import { BsBagCheck } from "react-icons/bs";
import { useLocation } from 'react-router-dom';

export default function CartOrderingPage(){
    //장바구니 페이지에서 전송된 데이터 받기
    const location = useLocation();

    const [cartList, setCartList] = useState(
        location.state?.cartList
      );
      console.log(cartList);

    //인풋창 입력
    const [phone, setPhone] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [payment, setPayment] = useState(false);

    function handlePhone(e){
        setPhone(e.target.value);
    }
    
    function handleDetailAddress(e){
        setDetailAddress(e.target.value);
    }

    //다음 주소 api 컴포넌트
    const [popup, setPopup] = useState(false);
    const [enroll_company, setEnroll_company] = useState({address:'', zonecode:'',});

    const Post = (props) => {
        const complete = (data) =>{
            let fullAddress = data.address;
            let extraAddress = '';
    
            if (data.addressType === 'R') {
                if (data.bname !== '') {
                    extraAddress += data.bname;
                }
                if (data.buildingName !== '') {
                    extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
                }
                fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
            }
    
            props.setcompany({
                ...props.company,
                address:fullAddress,
                zonecode:data.zonecode,
            })
            setPopup(!popup);
        }
    
        return (
            <div>
                <DaumPostcode className="postmodal" onComplete={complete} autoClose/>
            </div>
        );
    };

    const handleComplete = (data) => {
        setPopup(!popup);
    }

    const handleInput = (e) => {
	setEnroll_company({
    	...enroll_company,
        [e.target.name]:e.target.value,
    })
}   

//이메일 받아오기
const [email, setEmail] = useState('');

useEffect(()=>{ 
    callApi('http://localhost:8080/memberApi/findEmail/'+sessionStorage.getItem('userId'), 'GET')
    .then((response)=>{return response.json();}).then((json)=>setEmail(json.email))
    .catch((status)=>console.log(status));
  }, [])


  //체크 박스 상태 관리
  const [checked, setChecked] = useState(false);

  function handleChangeChecked(){
    setChecked(!checked);
  }

  //입력창 유효성 검사
  function checkValidate(){
    //인풋창 입력 안한 경우
    if(phone==null || phone=='' || detailAddress==null || detailAddress=='' || email==null || email=='' 
    || enroll_company.zonecode==null || enroll_company.zonecode=='' || enroll_company.address==null || enroll_company.address==''){
        throw new Error('inputRequired');
    }

    //체크박스 체크 안한 경우
    if(checked==false){
        throw new Error('checkedRequired');
    }
}

  //결제하기 버튼
  function handleClickPayment(e){
    try{
        checkValidate();

        //결제 창으로 이동
            /* 1. 가맹점 식별하기 */
            const { IMP } = window;
            IMP.init('imp17166604');
        
            /* 2. 결제 데이터 정의하기 */
            const data = {
              pg: 'TC0ONETIME',                           // PG사
              pay_method: 'card',                           // 결제수단
              merchant_uid: `mid_${new Date().getTime()}`,   // 주문번호
              amount: 1,                                 // 결제금액
              name: '아임포트 결제 데이터 분석',                  // 주문명
              buyer_name: '홍길동',                           // 구매자 이름
              buyer_tel: '01012341234',                     // 구매자 전화번호
              buyer_email: 'example@example',               // 구매자 이메일
              buyer_addr: '신사동 661-16',                    // 구매자 주소
              buyer_postcode: '06018',                      // 구매자 우편번호
            };
        
            /* 4. 결제 창 호출하기 */
            IMP.request_pay(data, callback);
          
        
          /* 3. 콜백 함수 정의하기 */
          function callback(response) {
            const {
              success,
              merchant_uid,
              error_msg,
            } = response;
        
            if (success) {
              //주문 테이블에 넣어주기
              for(let c of cartList){
                const orderingData = 
                {
                  productId: c.productId, 
                  memberId: sessionStorage.getItem('userId'),
                  orderDate: null,
                  salePrice: c.salePrice,
                  amount: c.amount,
                  payment: merchant_uid,
                  address: enroll_company.address+' '+detailAddress,
                  phone,
                  username: sessionStorage.getItem('username'),
                  zoneCode: enroll_company.zonecode,
                  name: c.productName
                };
                callApi('http://localhost:8080/shopApi/addOrdering', 'POST', orderingData)
              }
              setPayment(true);
              callApi('http://localhost:8080/shopApi/deleteCartAll', 'GET');
              alert('주문 및 결제가 정상적으로 완료되었습니다.');

            } else {
              alert(`결제가 실패했습니다. : ${error_msg}`);
            }
          }

    }catch(e){
        switch(e.message){
            case 'inputRequired':
                alert('모든 창을 입력해주세요.');
                break;
            case 'checkedRequired':
                alert('주문 정보 확인 여부에 체크해주세요.');
                break;   
            default:
                break;
        }
    }
    e.preventDefault();
  }

//총 금액 계산
let total = 0;
for(let c of cartList){
    total += c.amount*c.salePrice;
}

  //숫자 세자리마다 콤마
  function priceToString(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//주문내역 보기 버튼
function handleClickOrdering(){
    sessionStorage.setItem('location', 'second');
    window.location = '/mypage';
}

return(
<div className='my-page'>
        <Container fluid>
        <MyNavbar />
      <Image style={{marginTop: '50px'}} src='img/shop.jpg' alt='shop image' fluid />

      <Container className='p-5 mt-5 mb-5'>
      {
        payment==false
        ?<>
        <h2>주문하기 <span style={{fontSize: '18px', opacity: '0.8'}}>-주문 정보 입력</span></h2> 
      <hr/>
      <Form className='p-5'>
      <Row className="mb-5">
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>주문자 이름</Form.Label>
          <Form.Control type="text" placeholder="이름을 입력해주세요." value={sessionStorage.getItem('username')}/>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>휴대폰 번호 (-제외 숫자만 입력)</Form.Label>
          <Form.Control type="text" placeholder="연락처를 입력해주세요." value={phone} onChange={handlePhone}/>
        </Form.Group>
      </Row>

      <Form.Group className="mb-5" controlId="formGridAddress2" >
        <Form.Label>이메일</Form.Label>
        <Form.Control type="email" placeholder="이메일을 입력해주세요." value={email}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGridAddress1">
        <Form.Label>배송받을 주소</Form.Label>
        <Button variant="primary" className='ms-3' onClick={handleComplete}>주소 검색</Button>
      </Form.Group>

      {popup && <Post company={enroll_company} setcompany={setEnroll_company}></Post>}

      <Row className="mb-5">
        <Form.Group controlId="formGridCity" style={{width: '200px'}}>
          <Form.Label>우편번호</Form.Label>
          <Form.Control placeholder="주소를 검색해주세요." onChange={handleInput} value={enroll_company.zonecode}/>
        </Form.Group>

        <Form.Group controlId="formGridState" style={{width: '500px'}}>
          <Form.Label>도로명 주소</Form.Label>
          <Form.Control placeholder="주소를 검색해주세요." onChange={handleInput} value={enroll_company.address}/>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridZip">
          <Form.Label>상세 주소</Form.Label>
          <Form.Control type="text" placeholder="상세 주소를 입력해주세요." value={detailAddress} onChange={handleDetailAddress}/>
        </Form.Group>
      </Row>

      <h4>주문 상품 정보</h4>
      <Table style={{textAlign: 'center'}}>
      <thead>
        <tr>
          <th>주문 상품명</th>
          <th>상품 수량 (개)</th>
          <th>상품 금액 (원)</th>
        </tr>
      </thead>
      <tbody>
        {cartList.map((c)=>(
            <tr>
          <td>{c.productName}</td>
          <td>{c.amount}</td>
          <td>{priceToString(c.amount*c.salePrice)}</td>
        </tr>
        ))}
      </tbody>
    </Table><br/>
      <h4>총 결제 금액 | ₩{priceToString(total)}</h4>

    <Container className='my-div2'>
      <Form.Group className="mb-3 mt-5" id="formGridCheckbox">
        <Form.Check type="checkbox" label="주문 정보를 확인했습니다." checked={checked} onChange={handleChangeChecked}/>
      </Form.Group>
      </Container>
      <Container className='my-div2'>
      <Button variant="primary" size='lg' onClick={handleClickPayment}>결제하기</Button>
      </Container>
    </Form>
        </>
        :<>
      <Container>
      <Card className='p-5'>
      <Card.Title style={{textAlign: 'center'}}><h2><BsBagCheck/> 주문이 완료되었습니다</h2></Card.Title><hr/>
      <Card.Body className='p-5' style={{textAlign: 'center'}}>

    <Row className='mb-5'>
        <Col xs={3}>
      <p>주문자 이름</p><br/>
      <p>배송지</p>
        </Col>
        <Col style={{textAlign: 'left'}}>
      <h4>{sessionStorage.getItem('username')}</h4><br/>
      <h4>{enroll_company.address} {detailAddress}</h4>
        </Col>
      </Row>
      <br/><br/>
      <h5 style={{opacity: '0.6'}}>주문 상품 정보</h5><br/>
      <Table style={{textAlign: 'center'}}>
      <thead>
        <tr>
          <th>주문 상품명</th>
          <th>상품 수량 (개)</th>
          <th>상품 금액 (원)</th>
        </tr>
      </thead>
      <tbody>
        {cartList.map((c)=>(
            <tr>
          <td>{c.productName}</td>
          <td>{c.amount}</td>
          <td>{priceToString(c.salePrice)}</td>
        </tr>
        ))}
      </tbody>
    </Table>    
      <h4 style={{textAlign: 'right'}}>총 결제 금액 | ₩{priceToString(total)}</h4>    
      <br/><br/><br/><br/>
      <Button className="me-2" variant="primary" onClick={()=>{window.location = '/shop';}}>쇼핑몰로 가기</Button>
      <Button variant="primary" onClick={handleClickOrdering}>주문내역 보기</Button>
      </Card.Body>
      </Card>
      </Container>
        </>
      }
      </Container>
      <MyFooter />
      </Container>
      </div>
    );
}