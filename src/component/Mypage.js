import '../App.css';
import '../style/style.css';
import React from 'react';
import { Container, Image, Card, Nav, Tab, Row, Col, Form, InputGroup, Button, Table, ButtonGroup, ButtonToolbar, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import callApi from './ApiService';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';
import { FcSportsMode, FcPaid, FcViewDetails } from "react-icons/fc";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsFillBagHeartFill } from "react-icons/bs";
import { FcDocument } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { LuMessagesSquare } from "react-icons/lu";
import { format } from 'date-fns';


export default function Mypage(){

  //마이페이지 접속 유저 회원정보 가져오기
  const [result, setResult] = useState([]);
  const username = sessionStorage.getItem('username');

  useEffect(() => {
    callApi('http://localhost:8080/mypageApi/getUser/' + username, 'GET')
      .then((response) => response.json())
      .then((json) => {
        setResult(json);
      })
      .catch((status) => console.log(status));
  }, []);

  //회원 탈퇴
  function handleDeleteUser(){
    const confirmation = window.confirm('탈퇴하시겠습니까?');

    if (confirmation) {
      callApi('http://localhost:8080/mypageApi/resign', 'DELETE')
        .then(response => {
          if (response.status === 200) {
            response.json().then(json => {
              alert(json.msg);
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("username");
              sessionStorage.removeItem("type");
              sessionStorage.removeItem("role");
              sessionStorage.removeItem("userId");
              window.location = '/';
            });
          } else {
            alert(response.json().error);
          }
        }).catch((error) => {
          alert('계정 삭제 중 오류가 발생했습니다.');
          console.error(error);
        });
    }
  }

  //비밀번호 변경
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //비밀번호 변경 버튼 누를 시 모달창 띄우기
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  //모달 창에서 변경 버튼 클릭 시 실행하는 함수
  function handleUpdatePassword(){
    if (newPassword === confirmPassword) {
      callApi('http://localhost:8080/memberApi/pwdEdit', 'POST', {
        password: newPassword,
      })
        .then((response) => {
          if (response.status === 200) {
            response.json().then(json => {
              console.log(json);
              alert(json.data);
              setNewPassword('');
              setConfirmPassword('');
              setShow(false);
            });
          } else {
            alert('비밀번호 업데이트에 실패했습니다.');
          }
        })
        .catch((error) => {
          alert('비밀번호 업데이트 중 오류가 발생했습니다.');
          console.error(error);
        });
    } else {
      alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    }
  }
  
  //프로필 변경 모달창 띄우기
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  //프로필 사진 변경 
  const [file, setFile] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  function handleImageUpload(event) {
    setFile(event.target.files[0]);
    setSelectedImage(URL.createObjectURL(event.target.files[0]));
  }

  //프로필 변경 모달창 내 변경 버튼 클릭
  async function uploadImage() {
    if (file) {
      try {
        const token = sessionStorage.getItem('token');
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(`http://localhost:8080/mypageApi/uploadImage`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token,
          },
        });

        if (response.status === 200) {
          localStorage.setItem('selectedImage', selectedImage);
          alert('프로필 사진이 성공적으로 업로드되었습니다.');
          window.location = '/mypage';

        } else {
          alert('프로필 사진 업로드 실패.');
        }
      } catch (error) {
        alert('프로필 사진 업로드 중 오류가 발생했습니다.');
        console.error(error);
      }
    } else {
      alert('프로필 사진을 선택하세요.');
    }
  }


  //다른 페이지 이동 확인
  const [activeKey, setActiveKey] = useState(sessionStorage.getItem('location')?sessionStorage.getItem('location'):"first");

      //접속 유저 장바구니 목록 가져오기
      const userId = sessionStorage.getItem("userId");
      const [cartList, setCartList] = useState([]);
  
      useEffect(()=>{ 
          callApi('http://localhost:8080/shopApi/getAllCart/'+userId, 'GET')
          .then((response)=>{return response.json();}).then((json)=>{
              setCartList(json);
          })
          .catch((status)=>console.log(status));
          return ()=>{sessionStorage.removeItem('location');}
        }, [])
        
        
  //총 금액 계산
  let total = 0;
  for(let c of cartList){
      total += c.amount*c.salePrice;
  }

  
      //장바구니 삭제 버튼
      function handleClickDelete(productId){
          callApi('http://localhost:8080/shopApi/deleteCart/'+productId, 'GET').then(response=>{
  
      //삭제 정상 응답 시
      if(response.status === 200){
        response.json().then((json)=>alert(json.msg));
        sessionStorage.setItem('location', 'third');
        window.location = '/mypage';
  
      //삭제 bad request 발생 시(삭제 오류)
      }else{
        alert('상품을 삭제하지 못했습니다.')
        throw Error(response.statusText);
      }
    })
    .catch(e=>{console.log(e);}) 
        }
  
  
  //수량 업다운 버튼
  function handleChangeAmount(productId, e){
      setCartList(
          cartList.map((obj) => {
            if (obj.id == productId) {
              return {
                ...obj,
                amount: e.target.value < 1 ? 1 : e.target.value,
              };
            } else return obj;
          })
        );
  }
  
  //수량 변경 버튼 - db 저장
  function handleSetUpdate(productId){
      let updateProduct = null;
      cartList.map((cart)=>{
          if (cart.id == productId) {
              updateProduct = cart;
          }else return null;
      })
  
      callApi('http://localhost:8080/shopApi/updateCart', 'POST', updateProduct)
              .then(response=>{
                  if(response.status === 200){
                    response.json().then((json)=>alert(json.msg))
                    sessionStorage.setItem('location', 'third');
                    window.location = '/mypage';
  
                  }else{
                      alert('수량 변경에 실패했습니다.');
                  }
              })
              .catch(e=>{console.log(e);})
  }
  
  //숫자 세자리마다 콤마
  function priceToString(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  //주문 내역 가져오기
  const [orderingList, setOrderingList] = useState([]);

  useEffect(()=>{ 
    callApi('http://localhost:8080/shopApi/getAllOrdering/'+userId, 'GET')
    .then((response)=>{return response.json();}).then((json)=>{
      setOrderingList(json);
    })
    .catch((status)=>console.log(status));
  }, [])

  //가져온 배열 주문번호 별로 그룹화한 객체 생성
  const groupedOrderingList = orderingList.reduce((acc, curr) => {  
    const { payment } = curr;                        
    if (acc[payment]) {
        acc[payment].push(curr);  
    }else {
        acc[payment] = [curr];             
    }
    return acc;                          
  }, {});

  //주문번호 키값만 뽑아 놓기
  const keysOfPayment = Object.keys(groupedOrderingList);

  //주문내역 상세확인 버튼
  const [detailOrdering, setDetailOrdering] = useState(null);
  let detailOrderingTotalPrice = 0;
   
  function handleClickDetail(orderList){
    setDetailOrdering(orderList);
  }
  
   //상세 주문 총액 저장
   if(detailOrdering != null){
    for(let o of detailOrdering){
      detailOrderingTotalPrice += o.salePrice;
    }  
   }

  //주문내역별 주문 총액 저장
  let groupedTotalPrice = 0;
  let priceList = [];

  keysOfPayment.map((o)=>{
    if(groupedOrderingList[o].length>1){
      for(let l of groupedOrderingList[o]){
        groupedTotalPrice += l.salePrice;
      }
      priceList.push({payment: o, total: groupedTotalPrice});
      groupedTotalPrice = 0;
    }
    return null;
  })

  //모두 주문하기 버튼
  const navigate = useNavigate();

  function handleClickOrderAll(){
      navigate("/cartOrderingPage", {
        state: {
          cartList: cartList
        }
      });
  }

  //1:1 상담 내역 조회
  const sname = sessionStorage.getItem("username");
  const [writer, setWriter] = useState([]);
  const [viewList, setViewList] = useState([]);
  const [role, SetRole] = useState(null);
    
  useEffect(() => {
    callApi("http://localhost:8080/trainerApi/userOrTrainer", "GET")
      .then((response) => response.json())
      .then((json) => {
        SetRole(json.object.role);
        console.log(json.object.role);
        setWriter(sname);
      })
      .catch((status) => console.log(status));

    callApi("http://localhost:8080/trainerApi/getAll", "GET")
      .then((response) => response.json())
      .then((json) => {
        console.log(json.data)
      })
      .catch((status) => console.log(status));

    callApi("http://localhost:8080/postMessageApi/getAllByUserId", "GET")
      .then((response) => response.json())
      .then((json) => {
        setViewList(json.data);
      })
      .catch((status) => console.log(status));
  }, []);

  //주문 내역 기간별 조회 기능
  //오늘,일주일,한달,3개월 버튼 클릭
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const today = new Date();

  function todaySearch() {
    const formatedDate = formatDate(today);
    const formatedDate1 = formatDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000));
    findOrderByPeriod(formatedDate, formatedDate1);
  }

  function sevenDaySearch() {
    const formatedDate = formatDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000));
    const beforeWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const formatedDate7 = formatDate(beforeWeek);
    findOrderByPeriod(formatedDate7, formatedDate);
  }

  function oneMonthSearch() {
    const formatedDate = formatDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000));
    const beforeMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const formatedDate30 = formatDate(beforeMonth);
    findOrderByPeriod(formatedDate30, formatedDate);
  }

  function threeMonthSearch() {
    const formatedDate = formatDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000));
    const threeMonthsAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 3,
      today.getDate()
    );
    const formatedMonth30 = formatDate(threeMonthsAgo);
    findOrderByPeriod(formatedMonth30, formatedDate);
  }

  //날짜 상세입력 조회
  function formatDate(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // 한 자리 숫자일 경우 앞에 0을 추가합니다.
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return `${year}-${month}-${day}`;
  }

  function handleStartDateChange(e) {
    console.log(e);
    setStartDate(e);
  }
  
  function handleEndDateChange(e) {
    console.log(e);
    setEndDate(e);
  }

  function findOrderByPeriod(start, end) {
    callApi(
      "http://localhost:8080/shopApi/getAllOrderingByPeriod/" + start + "/" + end, "GET"
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        setOrderingList(json);
      })
      .catch((status) => console.log(status));
  }

  function findByPeriod(s, en) {
    findOrderByPeriod(s, en);
  }


    return(
        <div className='my-page'>
        <Container fluid>
        <MyNavbar />
      <Image style={{marginTop: '50px'}} src='img/myPage.jpg' alt='myPage image' fluid />

      <Container fluid className='p-5'>
      <Card className='m-5'>
        <Card.Body>
      <Tab.Container id="left-tabs-example" activeKey={activeKey} onSelect={(key)=>setActiveKey(key)}>
      <Row>
        <Col sm={2}>
          <Nav variant="pills" className="flex-column" style={{textAlign: 'center'}}>
            <Nav.Item>
               <Image className="m-5" src={result.img==null?"img/profile.png":'http://localhost:8080/coummunityApi/getImage/'+result.img} 
               roundedCircle width={250} height={250} alt='profile image'/>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="first">회원 정보</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">주문 내역</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third">장바구니</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="fourth">1:1 상담 내역</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={10}>
          <Tab.Content>
            <Tab.Pane eventKey="first">
            <Container className='p-5'>
                <h2>회원 정보 조회</h2><hr/>

                <Container style={{textAlign: 'center'}} className='mt-5'>
                <div><h3> <FcPaid/>
                 나의 식단 유형은 <strong className='my-strong'>{result.mNickname}</strong> <h6 className='ms-5'>
                  <i>-{result.menuType==null?'테스트를 통해 나의 식단 유형을 알아보세요!':result.menuType}</i></h6>
              </h3></div><br/>
                <div><h3><FcSportsMode/> 
                나의 운동 유형은 <strong className='my-strong'>{result.sNickname}</strong> <h6 className='ms-5'>
                  <i>-{result.sportType==null?'테스트를 통해 나의 운동 유형을 알아보세요!':result.sportType}</i></h6>
                </h3></div>
                </Container><br/>

<Container className='pt-5' style={{marginLeft: '30%'}}>
      <InputGroup className="mb-3" style={{width: '500px'}} size='lg'>
        <InputGroup.Text id="basic-addon1">회원 구분</InputGroup.Text>
        <Form.Control style={{textAlign: 'center'}} aria-label="Username" aria-describedby="basic-addon1" value={result.type} readOnly/>
      </InputGroup>

      <InputGroup className="mb-3" style={{width: '500px'}} size='lg'>
        <InputGroup.Text id="basic-addon2">유저 네임</InputGroup.Text>
        <Form.Control style={{textAlign: 'center'}} aria-label="Username" aria-describedby="basic-addon2" value={result.username} readOnly/>
      </InputGroup>

      <InputGroup className="mb-3" style={{width: '500px'}} size='lg'>
        <InputGroup.Text id="basic-addon3">이메일</InputGroup.Text>
        <Form.Control style={{textAlign: 'center'}} aria-label="Username" aria-describedby="basic-addon3" value={result.email} readOnly/>
      </InputGroup>

      <Container className='mt-5 mb-5' style={{marginLeft: '60px'}}>
      <Button variant="outline-secondary" id="button-addon4" className='me-3' onClick={handleShow}>비밀번호 변경</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>비밀번호 변경</Modal.Title>
        </Modal.Header>
        <Modal.Body className='mt-3 mb-3'>
        <label>변경할 비밀번호</label>
        <Form.Control type="password" name="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}/><br/>
        <label>비밀번호 확인</label>
        <Form.Control type="password" name="checkPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>닫기</Button>
          <Button variant="primary" onClick={handleUpdatePassword}>변경하기</Button>
        </Modal.Footer>
      </Modal>

      <Button variant="outline-secondary" id="button-addon4" className='me-3' onClick={handleShow2}>프로필 사진 변경</Button>
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>프로필 사진 변경</Modal.Title>
        </Modal.Header>
        <Modal.Body className='mt-3 mb-3'>
        <p>변경할 사진 선택</p>
        <Form.Control id="input-file" className="mb-3" type="file" aria-label="image" aria-describedby="basic-addon2" onChange={handleImageUpload} />
        <Container>
        {selectedImage && <Image src={selectedImage} alt='선택한 이미지' width={450}/>}
        </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>닫기</Button>
          <Button variant="primary" onClick={uploadImage}>변경하기</Button>
        </Modal.Footer>
      </Modal>

      <Button variant="outline-secondary" id="button-addon5" onClick={handleDeleteUser} >회원 탈퇴</Button>
      </Container>
</Container>      
<br/><hr/>
<h5><FcViewDetails/> 나의 유형 검사 결과</h5><br/>
<Card>
      <Card.Header>식단 유형 검사</Card.Header>
      <Card.Body className='p-3'>
      <div style={{textAlign: 'center'}} dangerouslySetInnerHTML={{ __html: result.mContent==null?'식단 유형 검사 결과가 없습니다.':result.mContent }}></div>
      </Card.Body>
    </Card>
    <br/>
    <Card>
      <Card.Header>운동 유형 검사</Card.Header>
      <Card.Body className='p-3'>
      <div style={{textAlign: 'center'}} dangerouslySetInnerHTML={{ __html: result.sContent==null?'운동 유형 검사 결과가 없습니다.':result.sContent }}></div>
      </Card.Body>
    </Card>

            </Container>
            </Tab.Pane>

            <Tab.Pane eventKey="second">
            <Container className='p-5'>
                <h2>주문 내역 조회</h2><hr/><br/>
      {
        detailOrdering==null
        ?<>
<Container style={{marginBottom: '100px'}}>
     <p>주문 검색</p>
     <ButtonToolbar aria-label="Toolbar with Button groups">
        <ButtonGroup className="me-2" aria-label="First group">
          <Button variant="secondary" onClick={todaySearch}>오늘</Button>{' '}
          <Button variant="secondary" onClick={sevenDaySearch}>일주일</Button>{' '}
          <Button variant="secondary" onClick={oneMonthSearch}>한달</Button>{' '}
          <Button variant="secondary" onClick={threeMonthSearch}>3개월</Button>
        </ButtonGroup>
        <InputGroup>
          <Form.Control type="date" placeholder="Input group example" aria-label="Input group example" aria-describedby="btnGroupAddon" 
          onChange={(e)=>handleStartDateChange(e.target.value)}/>
          ~
          <Form.Control type="date" placeholder="Input group example" aria-label="Input group example" aria-describedby="btnGroupAddon"
          onChange={(e)=>handleEndDateChange(e.target.value)}/>
          <Button variant="outline-secondary" id="button-addon5" onClick={()=>findByPeriod(startDate, endDate)}>검색</Button>
        </InputGroup>
      </ButtonToolbar>
    <br/>
    <Form.Text id="passwordHelpBlock" muted>
        기본적으로 최근 3개월 간의 자료가 조회되며, 기간 검색 시 3개월 이전의 지난 주문내역을 조회하실 수 있습니다.
      </Form.Text>
    </Container>      
    <Container>
                <p>주문 목록</p>
                <Table striped bordered hover style={{textAlign: 'center'}}>
                  <thead>
                    <tr>
                      <td style={{width: '150px'}}>주문 번호</td>
                      <td style={{width: '200px'}}>주문 일자</td>
                      <td style={{width: '400px'}}>주문 상품</td>
                      <td style={{width: '150px'}}>총 금액 (원)</td>
                      <td style={{width: '100px'}}>상세 확인</td>
                    </tr>
                  </thead>
                  <tbody>
                    {keysOfPayment.map((o)=>(
                    <tr>
                    <td>{o}</td>
                    <td>{format(new Date(groupedOrderingList[o][0].orderDate), 'yyyy-MM-dd HH:mm:ss')}</td>
                    <td>{
                    groupedOrderingList[o].length==1
                    ?groupedOrderingList[o][0].name
                    :groupedOrderingList[o][0].name+' 외 '+ (groupedOrderingList[o].length-1)+'개'
                    }</td>
                    <td>{
                    groupedOrderingList[o].length==1
                    ?priceToString(groupedOrderingList[o][0].salePrice)
                    :priceList.map((p)=>{if(p.payment==o){return priceToString(p.total);}return null;})
                    }</td>
                    <td><FcDocument size={20} onClick={()=>handleClickDetail(groupedOrderingList[o])}/></td>
                    </tr>
                    ))}
                  </tbody>
                </Table>
    </Container>
        </>
        :<>
<Container style={{marginBottom: '100px'}}>
<p>주문 상세 확인 <Button variant='link' onClick={()=>setDetailOrdering(null)}>뒤로 가기</Button></p> 
          <br/>
      <h5 style={{opacity: '0.6'}}>주문자 정보</h5><br/>
      <Table style={{textAlign: 'center'}}>
        <tbody>
        <tr>
          <td>주문자 이름</td>
          <td>{detailOrdering[0].username}</td>
        </tr>
        <tr>
          <td>배송지</td>
          <td>{detailOrdering[0].address}</td>
        </tr>
        </tbody>
    </Table>
    <br/> <br/>
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
        {detailOrdering.map((d)=>(
           <tr>
           <td>{d.name}</td>
           <td>{d.amount}</td>
           <td>{priceToString(d.salePrice)}</td>
         </tr>
        ))}
      </tbody>
    </Table>    
      <h4 style={{textAlign: 'right'}}>총 결제 금액 | ₩{priceToString(detailOrderingTotalPrice)}</h4>
</Container>
        </>
      }
            </Container>
            </Tab.Pane>

            <Tab.Pane eventKey="third">
            <Container className='p-5'>
                <h2>나의 장바구니</h2><hr/>
                <Container>
                <p><BsFillBagHeartFill/> 찜한 상품 목록</p>
                {
                    cartList.length!=0
                    ?<>
                  <Table striped bordered hover style={{textAlign: 'center'}}>
                  <thead>
                    <tr>
                      <td>번호</td>
                      <td>상품 정보</td>
                      <td>수량 (개)</td>
                      <td>금액 (원)</td>
                      <td>삭제</td>
                    </tr>
                  </thead>
                  <tbody>
                    {cartList.map((cart, i)=>(
                    <tr>
                    <td>{i+1}</td>
                    <td>{cart.productName}</td>
                    <td>
                    <input type="number" style={{width: '50px'}} value={cart.amount} onChange={(e)=>handleChangeAmount(cart.id, e)}/>
                    <Button className="ms-3" variant="secondary" size='sm' onClick={()=>handleSetUpdate(cart.id)}>변경</Button>
                    </td>
                    <td>{priceToString(cart.amount * cart.salePrice)}</td>
                    <td><RiDeleteBin5Line size={20} onClick={()=>handleClickDelete(cart.id)}/></td>
                    </tr>
                    ))}
                  </tbody>
                </Table>
                <h2 style={{textAlign: 'right'}}>총 금액 | ₩{priceToString(total)}</h2>
                <Container className='my-div2'>
                <Button variant="outline-info" onClick={handleClickOrderAll}>모두 주문하기</Button>
                </Container>
                    </>
                    :
                    <>
                    <Container>
                    <p style={{opacity: '0.5'}}>장바구니가 비어있습니다.</p>
                    </Container>
                    </>
                }
    </Container>
            </Container>
            </Tab.Pane>
            <Tab.Pane eventKey="fourth">
            <Container className='p-5'>
                <h2>1:1 상담 내역 조회</h2><hr/><br/>
                <p><LuMessagesSquare/> 1:1 질문 내역</p>
                {role === "TRUE" ? ( //트레이너 접속 시
            <>
              <Container style={{ textAlign: "center" }}>
                <Table className="my-table mb-5" striped bordered hover>
                  <thead>
                    <tr className="my-strong">
                      <th>번호</th>
                      <th class="col-1">발신자</th>
                      <th class="col-2">제목</th>
                      <th class="col-6">내용</th>
                      <th class="col-1">수신자</th>
                      <th class="col-6">작성일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewList.map((p) => (
                      <tr>
                        <td>{p.postMsgId}</td>
                        <td>{p.senderName}</td>
                        {p.title.includes('[RE]:')?<td style={{color: 'red'}}>{p.title}</td>:<td>{p.title}</td>}
                        <td>{p.content}</td>
                        <td>{p.recieveName}</td>
                        <td>{p.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Container>
            </>
          ) : (
            <>
              <Container style={{ textAlign: "center" }}>
                <Table className="my-table mb-5" striped bordered hover>
                  <thead>
                    <tr className="my-strong">
                      <th>번호</th>
                      <th class="col-1">발신자</th>
                      <th class="col-2">제목</th>
                      <th class="col-6">내용</th>
                      <th class="col-1">수신자</th>
                      <th class="col-6">작성일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewList.map((p) => (
                      <tr>
                        <td>{p.postMsgId}</td>
                        <td>{p.senderName}</td>
                        {p.title.includes('[RE]:')?<td style={{color: 'red'}}>{p.title}</td>:<td>{p.title}</td>}
                        <td>{p.content}</td>
                        <td>{p.recieveName}</td>
                        <td>{p.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Container>
            </>
          )}
            </Container>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
    </Card.Body>
    </Card>
    </Container>
    
      <MyFooter />
        </Container>
        </div>
    );
}