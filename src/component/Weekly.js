import React from "react";
import { useState, useEffect } from "react";
import callApi from "./ApiService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ImStarEmpty, ImStarHalf, ImStarFull } from "react-icons/im";
import { FaHandsClapping } from "react-icons/fa6";
import { format } from 'date-fns';
import {ko} from 'date-fns/locale';
import { FcSportsMode, FcPaid } from "react-icons/fc";
import { FaPlus } from "react-icons/fa6";
import { Button, ListGroup, Row, Col, Container, Form } from 'react-bootstrap';


export default function Weekly(){
    const [todoList, setTodoList] = useState([]);
    const [selectedOption, setSelectedOption] = useState("식단");
    const [goal, setGoal] = useState("");
    const [interval, setInterval] = useState(1);
    const [deadline, setDeadline] = useState(null);
    const [percentageResult, setPercentageResult] = useState(0);
    const dateParam = format(new Date(), 'yyyy-MM-dd');
    const formattedDate = format(new Date(), 'EEEE',{ locale: ko });

    useEffect(() => {
      callApi(
        "http://localhost:8080/weeklySchedulerApi/getAll/" + dateParam,
        "GET"
      )
        .then((response) => response.json())
        .then((json) => {
          setTodoList(json.data);
          const counts0 = json.data[0].counts[0];
          const counts2 = json.data[0].counts[2];
          const result = ((counts0 / counts2) * 100).toFixed(2);
          console.log("Result:", result);
          setPercentageResult(result);
        })
        .catch((status) => console.log(status));
    }, []);
  
    function deleteTodo(e) {
      const todoId = e.target.value;
      callApi(
        "http://localhost:8080/weeklySchedulerApi/deleteSchedule/" + todoId,
        "POST"
      )
        .then((response) => response.json())
        .then((json) => {
          alert(json.msg);
          setTodoList(json.data);
        })
        .catch((status) => console.log(status));
    }
    function checkToTrue(e) {
      const todoId = e.target.value;
      callApi("http://localhost:8080/goalApi/addGoal/" + todoId, "POST")
        .then((response) => response.json())
        .then((json) => {
          setTodoList(json.data);
          window.location = '/scheduler';
        })
        .catch((status) => console.log(status));
    }
  
    function addTodo() {
      const message = {
        type: selectedOption,
        goal: goal,
        period: interval,
        dueDate: deadline,
      };
      if (goal !== null && deadline !== null) {
        fetch("http://localhost:8080/weeklySchedulerApi/addSchedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
          body: JSON.stringify(message),
        })
          .then((response) => response.json())
          .then((json) => {
            alert(json.msg);
            setTodoList(json.data);
          })
          .catch((status) => console.log(status));
      }else{
        alert("누락된 정보가 있습니다."); // null 이 있을  때
      }
    setSelectedOption("");
    setGoal("");
    setInterval(1);
    setDeadline("");
    }

    function handleOptionChange(event) {
      setSelectedOption(event.target.value);
    }
  
    function handleGoalChange(event) {
      if (event.target.value === null) {
        alert("목표를 입력하세요.");
      }
      setGoal(event.target.value);
    }
  
    function handleIntervalChange(event) {
      setInterval(event.target.value);
    }
  
    function handleDateChange(date) {
      if (date === null) {
        alert("날짜를 입력하세요.");
      }
      setDeadline(date);
    }

    //스케쥴 추가 눌렀을 때 폼 보이도록
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [visibleSport, setVisibleSport] = useState(false);

    function handleAddScheduleMenu(){
        setVisibleMenu(!visibleMenu);
    }

    function handleAddScheduleSport(){
        setVisibleSport(!visibleSport);
    }

    return(
        <>
        <div className="p-5 mt-5">
        <span><h4>오늘의 성취율:  
        {todoList.map((message, index) => (
            message.counts.map((count, index) => {
              if (index === 0 || index === 2) {
                return (
                    <>
                    <strong className="my-strong" style={{fontSize: '35px'}}> {' '} {count}{index===0?' / ':''}</strong>
                    </>
                );
              }
              return null;
            })
            
        ))} {' '}
        {
            percentageResult==0
            ?<ImStarEmpty/>
            :percentageResult>0 && percentageResult<100
            ?<ImStarHalf/>
            :percentageResult==100
            ?<><ImStarFull/><FaHandsClapping/></>
            :<></>
        }           
        </h4></span>
        <p>(완료한 일의 개수 / 해야 하는 일의 개수)</p>       
        
        <br/><br/>
        <h5><strong className="my-strong">{dateParam}</strong> {formattedDate}</h5>
        <hr /><br/>
        <h5><FcPaid/> 식단</h5>
        {todoList.map((message, index) => (
          <div key={index}>
            <div>
              {message.todoListByMenu.map((todoMenu, index) => {
                if (todoMenu.disabled === false && todoMenu.checked === false) {
                  return (
                    <ListGroup>
                      <ListGroup.Item>
                        <Row>
                            <Col sm={10}>{todoMenu.goal}</Col>
                            <Col>
                            <Button variant="light" className="me-2" onClick={checkToTrue} value={todoMenu.id}>완료</Button>
                            <Button variant="secondary" onClick={deleteTodo} value={todoMenu.id}>삭제</Button>
                            </Col>
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>
                  );
                }
                return null; // 이 조건을 만족하지 않을 때는 null을 반환합니다.
              })}
              <ListGroup>
                <ListGroup.Item>
                <div onClick={handleAddScheduleMenu}><FaPlus/> 스케쥴 추가</div>
                {visibleMenu && 
                      <Container className="p-3 pt-4">
                      <Container className="mb-3"> 
                        <label>분류<br/>
                          <input type="radio" value="식단" checked={selectedOption === "식단"} onChange={handleOptionChange}/> 식단</label>
                          {' '}
                        <label>
                          <input type="radio" value="운동" checked={selectedOption === "운동"} onChange={handleOptionChange}/> 운동</label>
                      </Container>
                      <Container className="mb-2">
                      <Form>
      <Row className="mb-4">
        <Form.Group as={Col} controlId="formGridGoal">
          <Form.Label>스케쥴</Form.Label>
          <Form.Control type="text" placeholder="스케쥴을 입력하세요." value={goal} onChange={handleGoalChange}/>
        </Form.Group>
        <Form.Group as={Col} controlId="formGridPeriod">
          <Form.Label>주기</Form.Label>
          <Form.Select aria-label="Default select example" value={interval} onChange={handleIntervalChange}>
      <option value={1}>매일</option>
      <option value={7}>일주일</option>
      <option value={30}>한 달</option>
    </Form.Select>
        </Form.Group>
        <Form.Group as={Col} controlId="formGridDue">
          <Form.Label>마감일</Form.Label><br/>
          <DatePicker selected={deadline} onChange={handleDateChange} dateFormat="yyyy년 MM월 dd일"/>
        </Form.Group>
      </Row>
</Form>
<Button type="submit" onClick={addTodo}>일정 추가</Button>
</Container>
</Container>
}
                </ListGroup.Item>
              </ListGroup>
            </div>
          </div>
        ))}

        <br/><br/>
        <h5><FcSportsMode/> 운동</h5>
        {todoList.map((message, index) => (
          <div key={index}>
            <div>
              {message.todoListBySport.map((sport, index) => {
                if (sport.disabled === false && sport.checked === false) {
                  return (
                        <ListGroup>
                            <ListGroup.Item>
                            <Row>
                                <Col sm={10}>{sport.goal}</Col>
                                <Col>
                                <Button variant="light" className="me-2" onClick={checkToTrue} value={sport.id}>완료</Button>
                                <Button variant="secondary" onClick={deleteTodo} value={sport.id}>삭제</Button>
                                </Col>
                            </Row>
                            
                            </ListGroup.Item>
                        </ListGroup>
                  );
                }
                return null; // 이 조건을 만족하지 않을 때는 null을 반환합니다.
              })}
               <ListGroup>
                <ListGroup.Item>
                <div onClick={handleAddScheduleSport}><FaPlus/> 스케쥴 추가</div>
                {visibleSport && 
                      <Container className="p-3 pt-4">
                      <Container className="mb-3"> 
                        <label>분류<br/>
                          <input type="radio" value="식단" checked={selectedOption === "식단"} onChange={handleOptionChange}/> 식단</label>
                          {' '}
                        <label>
                          <input type="radio" value="운동" checked={selectedOption === "운동"} onChange={handleOptionChange}/> 운동</label>
                      </Container>
                      <Container className="mb-2">
                      <Form>
      <Row className="mb-4">
        <Form.Group as={Col} controlId="formGridGoal">
          <Form.Label>스케쥴</Form.Label>
          <Form.Control type="text" placeholder="스케쥴을 입력하세요." value={goal} onChange={handleGoalChange}/>
        </Form.Group>
        <Form.Group as={Col} controlId="formGridPeriod">
          <Form.Label>주기</Form.Label>
          <Form.Select aria-label="Default select example" value={interval} onChange={handleIntervalChange}>
      <option value={1}>매일</option>
      <option value={7}>일주일</option>
      <option value={30}>한 달</option>
    </Form.Select>
        </Form.Group>
        <Form.Group as={Col} controlId="formGridDue">
          <Form.Label>마감일</Form.Label><br/>
          <DatePicker selected={deadline} onChange={handleDateChange} dateFormat="yyyy년 MM월 dd일"/>
        </Form.Group>
      </Row>
</Form>
<Button type="submit" onClick={addTodo}>일정 추가</Button>
</Container>
</Container>
}
                </ListGroup.Item>
              </ListGroup>
            </div>
          </div>
        ))}
      </div>
      </>
    );
}