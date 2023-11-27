import '../App.css';
import '../style/style.css';
import React from 'react';
import { useState, useEffect } from "react";
import { Container, Image, Tab, Row, Col, Nav, Form, InputGroup, Button, Table } from 'react-bootstrap';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';
import callApi from "./ApiService";
import { FcDataConfiguration, FcExport, FcInspection } from "react-icons/fc";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { FcDocument } from "react-icons/fc";


export default function AdminPage(){
    const [username, setUsername] = useState(null);
    const [postList, setPostList] = useState([]);
    const [commentList, setCommentList] = useState([]);
    const [eventKey, setEventKey] = useState("first");
    const [userList, setUserList] = useState([]);

    useEffect(()=>{ 
        callApi('http://localhost:8080/adminApi/findAllUser', 'GET')
        .then((response)=>{return response.json();}).then((json)=>setUserList(json))
        .catch((status)=>console.log(status));
      }, [])

    function handleContentChange(event) {
        setUsername(event.target.value);
      }

      //유저 네임 조회할 때 버튼
      function clickToFindUser() {

        callApi("http://localhost:8080/adminApi/findUser/" + username, "GET")
          .then((response) => response.json())
          .then((json) => {
            setUserList(json.data);
            setUsername(json.data.username);
          })
          .catch((status) => console.log(status));
    
        callApi("http://localhost:8080/adminApi/findPostByuser/" + username, "GET")
          .then((response) => response.json())
          .then((json) => {
            setPostList(json.data);
          })
          .catch((status) => console.log(status));

        callApi(
          "http://localhost:8080/adminApi/findCommentByuser/" + username,
          "GET"
        )
          .then((response) => response.json())
          .then((json) => {
            setCommentList(json.data);
          })
          .catch((status) => console.log(status));
      }

      function handleGetoutClick(e) {
        const confirmation = window.confirm('해당 유저를 탈퇴 처리 하시겠습니까?');

        if (confirmation) {
        const userId = e;
        callApi("http://localhost:8080/adminApi/resign/" + userId, "DELETE")
          .then((response) => response.json())
          .then((json) => {
            alert(json.msg);
          })
          .catch((status) => console.log(status));
        }
        window.location = '/adminpage';
      }

      //게시물,댓글 관리 이동 클릭
      function handleCheckPostClick(username) {
        setEventKey("second");
        setUsername(username);
        callApi(
            "http://localhost:8080/adminApi/findPostByuser/" + username,
            "GET"
          )
            .then((response) => response.json())
            .then((json) => {
              setPostList(json.data);
            })
            .catch((status) => console.log(status));

            callApi(
                "http://localhost:8080/adminApi/findCommentByuser/" + username,
                "GET"
              )
                .then((response) => response.json())
                .then((json) => {
                  setCommentList(json.data);
                })
                .catch((status) => console.log(status));
      }

      //주문내역 관리 이동 클릭
      const [orderingList, setOrderingList] = useState([]);

      function handleCheckOrderingClick(username){
        setEventKey("third");
        setUsername(username);
        callApi(
            "http://localhost:8080/adminApi/findOrderingByuser/" + username,
            "GET"
          )
            .then((response) => response.json())
            .then((json) => {
              setOrderingList(json);
              console.log(json);
            })
            .catch((status) => console.log(status));
      }


      //게시물 삭제
      async function handlePostDelete(id, username) {
        const listIdParam = id;
        
        if (window.confirm("해당 유저의 게시물을 정말로 삭제하시겠습니까?")) {
        await callApi(
          "http://localhost:8080/adminApi/deletePost/" + listIdParam,
          "GET"
        )
          .then((response) => response.json())
          .then((json) => {
            alert(json.msg);
          })
          .catch((status) => console.log(status));

        await callApi(
          "http://localhost:8080/adminApi/findPostByuser/" + username,
          "GET"
        )
          .then((response) => response.json())
          .then((json) => {
            setPostList(json.data);
          })
          .catch((status) => console.log(status));
        }
      }

      //댓글 삭제
      function handleCommentDelete(commentId, memberId) {
        const submitData = { commentId, memberId };
        if (window.confirm("해당 유저의 댓글을 정말로 삭제하시겠습니까?")) {
          callApi(
            "http://localhost:8080/adminApi/deleteComment/", "POST", submitData
          )
            .then((response) => response.json())
            .then((json) => {
              if (json) {
                alert("댓글이 정상적으로 삭제되었습니다.");
                setCommentList(json);
              }
            });
        }
      }

      //엔터키
      function handleKeyDown(event){
        if(event.key === 'Enter'){
            clickToFindUser(event);
        }
    }

    //일반만 조회
    function handleClickNormal(){
        callApi("http://localhost:8080/adminApi/findAllUserByType/일반", "GET")
        .then((response) => response.json())
        .then((json) => {
          setUserList(json);
        })
        .catch((status) => console.log(status));
    }

    //전문만 조회
    function handleClickPro(){
        callApi("http://localhost:8080/adminApi/findAllUserByType/전문", "GET")
        .then((response) => response.json())
        .then((json) => {
          setUserList(json);
        })
        .catch((status) => console.log(status));
    }

    //주문 내역 조회 페이지
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

//숫자 세자리마다 콤마
function priceToString(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//주문 내역 삭제 버튼
function handleDeleteOrdering(payment){

  if (window.confirm("해당 주문 내역을 정말로 삭제하시겠습니까?")) {
  callApi("http://localhost:8080/adminApi/deleteOrdering/"+payment, "GET")
  .then((response) => {
    if(response.status === 200){
      //삭제 정상 응답
      response.json().then((json)=>{
        if(json.msg){
          alert(json.msg);
          callApi(
            "http://localhost:8080/adminApi/findOrderingByuser/" + username, "GET"
          )
            .then((response) => response.json())
            .then((json) => {
              setOrderingList(json);
            })
            .catch((status) => console.log(status));
        }
      })
    }else{
      //삭제 실패 응답
      response.json().then((json)=>{
        if(json.error){
          alert(json.error);
        }
      })
    }
  })
  .catch((status) => console.log(status));
}
}

    return(
        <>
        <div className='my-page'>
        <Container fluid>
        <MyNavbar />
        <Image style={{marginTop: '50px'}} src='img/adminPage.jpg' alt='adminPage image' fluid />

        <Container fluid className="p-5">
            <Tab.Container id="left-tabs-example" activeKey={eventKey} onSelect={(key) => setEventKey(key)}>
              <Row>
        <Col sm={2}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="first">회원/트레이너 관리</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">커뮤니티 관리</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third">주문 관리</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={10}>
          <Tab.Content>
            <Tab.Pane eventKey="first">
                <Container>
                <h2>회원/트레이너 관리</h2><hr/>
                <Container className='pt-3 pb-5'> 
                <p>-회원 조회</p>
                <Button variant="outline-secondary" id="button-addon4" className='me-2' onClick={handleClickNormal}> 일반 회원만 조회 </Button>
                <Button variant="outline-secondary" id="button-addon4" onClick={handleClickPro} > 전문 회원만 조회  </Button>
                <InputGroup className="mb-3 mt-3" style={{width: '500px'}}>
                <Form.Control type="text" id="memberSearch" aria-describedby="memberSearch" placeholder="조회할 유저 네임을 입력해주세요."
                 onChange={handleContentChange} onKeyDown={(e)=>handleKeyDown(e)}/>
                <Button variant="outline-secondary" id="button-addon4" onClick={() => clickToFindUser(username)}> 조회 </Button>
                </InputGroup>
                </Container>
                <Container>
                <p>-회원 목록</p>
                <Table striped bordered hover style={{textAlign: 'center'}}>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>구분</th>
                            <th>유저 네임</th>
                            <th>이메일</th>
                            <th>게시물/댓글 관리</th>
                            <th>주문내역 관리</th>
                            <th>탈퇴</th>
                        </tr>
                    </thead>
                    <tbody>
                    {userList.map((p) => (
                                <tr>
                                  <td>{p.id}</td>
                                  <td>{p.type}</td>
                                  <td>{p.username}</td>
                                  <td>{p.email}</td>
                                  <td>
                                    <Button variant="Button" onClick={()=>handleCheckPostClick(p.username)}> <FcDataConfiguration size={25}/> 이동</Button>
                                  </td>
                                  <td><Button variant="Button" onClick={()=>handleCheckOrderingClick(p.username)}> <FcInspection size={25}/> 이동</Button> </td>
                                  <td>
                                    <Button variant="Button" onClick={(event) => handleGetoutClick(p.id) }>
                                      <FcExport size={25}/>
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                    </tbody>
                </Table>
                </Container>
                </Container>
            </Tab.Pane>

            <Tab.Pane eventKey="second">
            <Container>
                <h2>커뮤니티 관리</h2><hr/><br/>
                <Container>
                <p>-게시물/댓글 목록</p>
                <Table striped bordered hover style={{textAlign: 'center'}}>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>구분</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>작성일</th>
                            <th>조회수</th>
                            <th>댓글수</th>
                            <th>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                    {postList.map((p) => (
                                <tr>
                                  <td>{p.id}</td>
                                  <td>{p.memberType}</td>
                                  <td>{p.title}</td>
                                  <td>{p.username}</td>
                                  <td>{p.date.split("T")[0]}</td>
                                  <th>{p.views}</th>
                                  <th>{p.replies}</th>
                                  <td>
                                    <Button
                                      variant="Button"
                                      onClick={() =>
                                        handlePostDelete(p.id, p.username)
                                      }>
                                      <RiDeleteBack2Fill size={25}/>
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                    </tbody>
                </Table>
                </Container>
                <br/>
                <Container>
                          <p>-댓글 목록</p>
                          <Table
                            striped
                            bordered
                            hover
                            style={{ textAlign: "center" }}>
                            <thead>
                              <tr>
                                <th>번호</th>
                                <th>게시글 번호</th>
                                <th>내용</th>
                                <th>작성일</th>
                                <th>삭제</th>
                              </tr>
                            </thead>
                            <tbody>
                              {commentList.map((p) => (
                                <tr>
                                  <td>{p.id}</td>
                                  <td>{p.communityId}</td>
                                  <td>{p.content}</td>
                                  <td>{p.commentDate.split("T")[0]}</td>
                                  <td>
                                    <Button variant="Button" onClick={() => handleCommentDelete(p.id, p.memberId) }>
                                      <RiDeleteBack2Fill size={25}/>
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Container>
                </Container>

            </Tab.Pane>

            <Tab.Pane eventKey="third">
            <Container>
                <h2>주문 관리</h2><hr/><br/>
                <Container>
      {
        detailOrdering==null
        ?<>
    <Container>
                <p>주문 목록</p>
                <Table striped bordered hover style={{textAlign: 'center'}}>
                  <thead>
                    <tr>
                    <td>주문자</td>
                      <td style={{width: '200px'}}>주문 번호</td>
                      <td style={{width: '150px'}}>주문 일자</td>
                      <td style={{width: '450px'}}>주문 상품</td>
                      <td style={{width: '150px'}}>총 금액 (원)</td>
                      <td style={{width: '100px'}}>상세 확인</td>
                      <td style={{width: '100px'}}>삭제</td>
                    </tr>
                  </thead>
                  <tbody>
                    
                    {keysOfPayment.map((o)=>(
                    <tr>
                    <td>{groupedOrderingList[o][0].username}</td>
                    <td>{o}</td>
                    <td>{groupedOrderingList[o][0].orderDate}</td>
                    <td>{groupedOrderingList[o].length==1?groupedOrderingList[o][0].name:groupedOrderingList[o][0].name+' 외 '+ (groupedOrderingList[o].length-1)+'개'}</td>
                    <td>{groupedOrderingList[o].length==1?priceToString(groupedOrderingList[o][0].salePrice):priceList.map((p)=>{if(p.payment==o){return priceToString(p.total);}return null;})}</td>
                    <td><FcDocument size={20} onClick={()=>handleClickDetail(groupedOrderingList[o])}/></td>
                    <td><RiDeleteBack2Fill size={25} onClick={()=>handleDeleteOrdering(o)}/></td>
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
                </Container>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
    </Container>
        <MyFooter />
        </Container>
        </div>
        </>
    );
}