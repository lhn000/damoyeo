import '../App.css';
import '../style/style.css';
import React from 'react';
import { Container, Image, Button, InputGroup, Form, Table } from 'react-bootstrap';
import { useState } from 'react';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';
import '../style/style.css';
import callApi from './ApiService';

export default function Calorie(){
    const [foods, setFoods] = useState([]);
    const [sports, setSports] = useState([]);
    const [input, setInput] = useState('');
    const [searchList, setSearchList] = useState([]);
    const [showSportsList, setShowSportsList] = useState(false);
    const [showFoodsList, setShowFoodsList] = useState(false); 
          
    const content = '음식';
    const content2 = '운동';

    const foodUrl = 'http://localhost:8080/calorieApi/dictionaryFind/'+content;
    const searchUrl = 'http://localhost:8080/calorieApi/dictionary/'+input;

    function handleFoodList() {
        // 운동 칼로리 목록 초기화
        setSports([]);
        setSearchList([]);
        
        // 음식 목록을 토글 (보이면 숨김, 숨기면 보임)
        if (showFoodsList) {
            setFoods([]); // 음식 목록 초기화
        } else {
            callApi(foodUrl, "GET")
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw Error(response.statusText);
                    }
                })
                .then((json) => {
                    setFoods(json);
                })
                .catch((e) => {
                    console.log("*********");
                    console.log(e);
                    console.log("*********");
                    setFoods([]); // 에러가 발생한 경우 음식 목록을 빈 배열로 업데이트
                });
        }
        // 음식 목록의 가시성을 토글
        setShowFoodsList(!showFoodsList);
      }

    const sportsUrl = 'http://localhost:8080/calorieApi/dictionaryFind/'+content2;

    function handleSportsList() {
        setFoods([]);
        setSearchList([]);
        
        // 스포츠 목록을 토글 (보이면 숨김, 숨기면 보임)
        if (showSportsList) {
          setSports([]); // 스포츠 목록 초기화
          

        } else {
          callApi(sportsUrl, "GET")
            .then((response) => {
              if (response.status === 200) {
                return response.json();
              } else {
                throw Error(response.statusText);
              }
            })
            .then((json) => {
              setSports(json);
            })
            .catch((e) => {
              console.log("*********");
              console.log(e);
              console.log("*********");
              setSports([]); // 에러가 발생한 경우 스포츠 목록을 빈 배열로 업데이트
            });
        }
      
        // 스포츠 목록의 가시성을 토글
        setShowSportsList(!showSportsList);
      
        // '음식 칼로리' 목록 초기화
        setFoods([]);
      }


// 1. 검색어를 URL에 추가하고 API를 호출하는 함수
function handleSearchList() {
    setSports([]);
    setFoods([]);

    if (input === '') {
        // 검색어가 비어있으면 아무 작업도 하지 않음
        return;
    }

    // 칼로리 검색
    callApi(searchUrl, "GET")
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then((json) => {
            // 검색 결과 중에서 검색어와 일치하는 것만 필터링하여 저장
            console.log(json);
            setSearchList(json);
        })
        .catch((e) => {
            console.log("음식 검색 중 에러 발생");
            console.log(e);
            setSearchList([]); // 에러가 발생한 경우 음식 목록을 빈 배열로 업데이트
        });
        setInput('');
}

    function handleChange(e){
      setInput(e.target.value);
    }

    const handleEnterKeyPress = (e) => {
      if (e.key === 'Enter') {
          handleSearchList(); // 엔터 키를 누를 때 데이터 가져오기
      }
  };

    return(
        <div className='my-page'>
        <Container fluid>

        <MyNavbar />
      <Image style={{marginTop: '50px'}} src='img/dictionary.jpg' alt='dictionary image' fluid />

      <Container className="my-div">
      <Container>

        <Container className='mb-5'>
            <Button className="me-3" size="lg" onClick={handleFoodList}>음식 칼로리</Button>
            <Button size="lg" onClick={handleSportsList}>운동 칼로리</Button>
        </Container>

            <Container className='mt-5' style={{textAlign: 'left'}}>
            <h2>칼로리 찾기</h2><hr/>
            <InputGroup className="mt-5" style={{width: '500px', marginLeft: '30%', marginBottom: '100px'}}>
            <Form.Control type="text" placeholder="검색할 내용을 입력해주세요." aria-label="searchContent" aria-describedby="basic-addon3" name="searchContent"
            value={input} onChange={handleChange} onKeyPress={handleEnterKeyPress} />
            <Button onClick={handleSearchList} variant="secondary" id="button-addon3" >검색</Button>
            </InputGroup>
            </Container>

            <Container className='mt-5 mb-5' style={{textAlign: 'left'}}>
            <h2>칼로리 찾기 결과</h2><hr/>
            <Table>
            {
                foods.length!=0
                ?
                <thead>
                <tr>
                    <th>번호</th>
                    <th>분류</th>
                    <th>이름</th>
                    <th>칼로리</th>
                    <th>단위</th>
                </tr>
                </thead>
                :<></>
            }
                {foods.map((f, i)=>(
                <tbody>
                <tr>
                <td>{i+1}</td>
                <td>{f.type}</td>
                <td>{f.title}</td>
                <td>{f.calory}</td>
                <td>{f.unit}</td>
                </tr>
                </tbody>
                ))}
            </Table>
     
            <Table>
            {
                sports.length!=0
                ?
                <thead>
                <tr>
                    <th>번호</th>
                    <th>분류</th>
                    <th>이름</th>
                    <th>칼로리</th>
                    <th>단위</th>
                </tr>
                </thead>
                :<></>
            }
                {sports.map((s, i)=>(
                <tbody>
                <tr>
                <td>{i+1}</td>
                <td>{s.type}</td>
                <td>{s.title}</td>
                <td>{s.calory}</td>
                <td>{s.unit}</td>
                </tr>
                </tbody>
                ))}
            </Table>

             <Table>
             {
                searchList.length!=0
                ?
                <thead>
                <tr>
                    <th>번호</th>
                    <th>분류</th>
                    <th>이름</th>
                    <th>칼로리</th>
                    <th>단위</th>
                </tr>
                </thead>
                :<></>
            }
                {searchList.map((c, i)=>(
                <tbody>
                <tr>
                <td>{i+1}</td>
                <td>{c.type}</td>
                <td>{c.title}</td>
                <td>{c.calory}</td>
                <td>{c.unit}</td>
                </tr>
                </tbody>
                ))}
            </Table> 
            </Container>
        </Container>
      </Container>
      
      <MyFooter />
      </Container>
      </div>
    );
}