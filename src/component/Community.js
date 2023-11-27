import '../App.css';
import '../style/style.css';
import React from 'react';
import { Container, Image, Table, Pagination, Button, InputGroup, Form, Card, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import callApi from './ApiService';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';
import Comment from './Comment';

export default function Community(){
//게시글 목록 가져오기
const [postList, setPostList] = useState([]);
sessionStorage.removeItem('update');

useEffect(()=>{ 
    callApi('http://localhost:8080/coummunityApi/communityList', 'GET')
    .then((response)=>{return response.json();}).then((json)=>setPostList(json))
    .catch((status)=>console.log(status));
  }, [])

//페이지네이션 기능
//페이지 당 포스트 개수 설정, 나눠주기
const [currentPage, setCurrentPage] = useState(1);
const [postsPerPage, setPostsPerPage] = useState(15);
const indexOfLast = currentPage * postsPerPage;
const indexOfFirst = indexOfLast - postsPerPage;
const currentPosts = postList.slice(indexOfFirst, indexOfLast);


//페이지 버튼 몇 개까지 보여줄 지 결정
const [active, setActive] = useState(1);
let items = [];
const lastNum = Math.ceil(postList.length / postsPerPage);
for (let number = 1; number <= lastNum; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active} onClick={()=>{setActive(number); setCurrentPage(number);}}>
      {number}
    </Pagination.Item>,
  );
}

//제목 누르면 상세글 보이도록
const [post, setPost] = useState(null);
const [imageUrl, setImageUrl] = useState([]);
const [postId,  setPostId] = useState('');

async function handleClick(postId){
  const response = await fetch("http://localhost:8080/coummunityApi/communityInfo/"+postId);
  callApi('http://localhost:8080/coummunityApi/addViews/'+postId, 'GET');
  const info = await response.json();
  setPost(info);

  //다중 이미지 파일이름 ;로 나누고 리스트 저장
  if(info.image != null){
    let nextUrl = info.image.split(';');
    nextUrl.pop();
    let a = [...nextUrl];
    a.shift();
    setImageUrl(a);
  }
}

//글쓰기 버튼 눌렀을 때 실행
function handleClickPost(){
  window.location = '/communityPost';
}

//글 삭제 버튼 
function handleClickDelete(postId){
  if (window.confirm("게시물을 정말로 삭제하시겠습니까?")) {
  callApi('http://localhost:8080/coummunityApi/deletePost/'+postId, 'GET')
  .then(response=>{

    //삭제 정상 응답 시
    if(response.status === 200){
      response.json().then((json)=>alert(json.msg));
      window.location = '/community';

    //삭제 bad request 발생 시(삭제 오류)
    }else{
      response.json().then((json)=>alert(json.error));
      throw Error(response.statusText);
    }
  })
  .catch(e=>{console.log(e);})       
}
}

//글 수정 버튼 - 게시물 데이터 포함해서 게시물 작성 페이지로 이동하기
function handleClickUpdate(postId){
  sessionStorage.setItem('update', postId);
  window.location = '/communityPost';
}

//전체보기
function handleViewAll(){
  window.location = '/community';
}

//일반 글만 normal
async function handleViewNormal(){
  const response = await fetch("http://localhost:8080/coummunityApi/communityListByType/normal");
  const info = await response.json();
  setPostList(info);
}

//전문 글만 pro
async function handleViewPro(){
  const response = await fetch("http://localhost:8080/coummunityApi/communityListByType/pro");
  const info = await response.json();
  setPostList(info);
}

//조회수 높은 순 views
async function handleViewManyViews(){
  const response = await fetch("http://localhost:8080/coummunityApi/communityListByType/views");
  const info = await response.json();
  setPostList(info);
}

//게시물 검색 기능
const [searchType, setSearchType] = useState('writer');
const [searchText, setSearchText] = useState('');

function handleSearchText(e){
  setSearchText(e.target.value);
}

async function handleClickSearch(){
    const response = await fetch("http://localhost:8080/coummunityApi/communityList/"+searchType+"/"+searchText);
    const info = await response.json();
    console.log(info);
    setPostList(info);
}

    return(
        <>
        <div className='my-page'>
        <Container fluid>
        <MyNavbar />
      <Image style={{marginTop: '50px'}} src='img/community.jpg' alt='community image' fluid />
        {
            (post === null)
            ?<>
        <Container fluid className='p-5'>
        <Button variant="link" onClick={handleViewAll}>전체 보기</Button>
        <Button variant="link" onClick={handleViewNormal}>일반 글만</Button>
        <Button variant="link" onClick={handleViewPro}>전문 글만</Button>
        <Button variant="link" onClick={handleViewManyViews}>조회수 높은 순</Button>

      <Table className='my-table mb-5' striped bordered hover >
      <thead>
        <tr className='my-strong'>
          <th>번호</th>
          <th>분류</th>
          <th class="col-6">제목</th>
          <th class="col-2">작성자</th>
          <th>조회수</th>
          <th class="col-2">작성일</th>
        </tr>
      </thead>
      <tbody>
        {currentPosts.map((p)=>(
        <tr>
          <td>{p.id}</td>
          {
            p.memberType=='일반'
            ? <td style={{color: 'gray'}}>[{p.memberType}]</td>
            : p.memberType=='전문' 
            ? <td>[{p.memberType}]</td>
            : <td style={{color: 'red'}}>[{p.memberType}]</td>
          }
          <td><Button variant="link" onClick={()=>{setPostId(p.id); handleClick(p.id);}}>{p.title}</Button>[{p.replies}]</td>
          <td>{p.username} {p.memberType == '전문' ? <Badge bg="light"><Image src='img/badge.png' alt='badge image' width={20}/></Badge> : <></>}</td>
          <td>{p.views}</td>
          <td>{p.date}</td>
        </tr>
        ))}
      </tbody>
    </Table>

      <div style={{paddingLeft: '43%', paddingBottom: '50px'}}>
      <Pagination variant="secondary">
      <Pagination.First onClick={()=>{setActive(1); setCurrentPage(1);}}/>
      <Pagination.Prev onClick={()=>{setActive((currentPage-1) > 0 ? currentPage-1 : 1); setCurrentPage((currentPage-1) > 0 ? currentPage-1 : 1);}}/>
      {items}
      <Pagination.Next onClick={()=>{setActive((currentPage+1)>lastNum ? lastNum : currentPage+1); setCurrentPage((currentPage+1)>lastNum ? lastNum : currentPage+1);}}/>
      <Pagination.Last onClick={()=>{setActive(lastNum); setCurrentPage(lastNum);}}/>
      </Pagination>
      </div>

      <Container style={{width: '40%'}}>
      <InputGroup className="mb-3">
    <Form.Select aria-label="Default select example" onChange={(e)=>setSearchType(e.target.value)} >
    <option>검색 분류 선택</option>
      <option value="writer">작성자</option>
      <option value="title">제목</option>
      <option value="date">작성일</option>
    </Form.Select>
        <Form.Control style={{width: '300px'}} type="text" placeholder="검색할 내용을 입력해주세요." name="searchContent" value={searchText} onChange={handleSearchText}/>
        <Button onClick={handleClickSearch} className="me-3" variant="secondary">검색</Button>   
        {
          sessionStorage.getItem('token') ? <Button variant="primary" onClick={handleClickPost}>글쓰기</Button> : ''
        }
      </InputGroup>
      </Container>
    </Container>
    </>

    :<>
<Container fluid className='p-5'>
<Button onClick={()=>{setPost(null)}} variant="link">뒤로 가기</Button>
<Card className='p-5 mb-5'>
<Card.Title style={{textAlign: 'center'}}><h2>[{post.memberType}] {post.title}</h2></Card.Title>
<Card.Subtitle className="mt-2 text-muted" style={{textAlign: 'right'}}>작성자: {post.username} | 작성일: {post.date}</Card.Subtitle><hr/>
      <Card.Body className='p-3'>
        {
        post.image != null || post.image !== 'null'
        ?
        <>
        {imageUrl.map((url, i)=>(
        <Image src={'http://localhost:8080/coummunityApi/getImage/'+url} className='m-3' width={500} />
        ))}
        <br/><br/><br/>
        </>
      :
      <></>
      }
        {post.content}
        
        {
          (post.username == sessionStorage.getItem('username') || sessionStorage.getItem('role')=='TRUE')
          ?
          <>
          <br/><br/><br/>
          <div style={{position: 'absolute', right: 0, marginRight: "30px"}}>
          <Button onClick={()=>handleClickUpdate(post.id)} className="me-3" variant="secondary">글 수정</Button>
          <Button onClick={()=>handleClickDelete(post.id)} variant="secondary">글 삭제</Button>
          </div>
          </>
          :
          <></>
        }
      </Card.Body>
</Card>
<Comment postId={postId}/>
</Container>
    </>
        }
        <MyFooter />
        </Container>
        </div>
        </>
    );
}