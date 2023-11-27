import '../App.css';
import '../style/style.css';
import React from 'react';
import { Button, ListGroup, Col, Row, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, isSameDay, addDays } from 'date-fns';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FcSportsMode, FcPaid } from "react-icons/fc"
import { ImNeutral2, ImSmile2, ImCool2, ImWink2, ImHappy2, ImGrin2 } from "react-icons/im";
import callApi from './ApiService';

const RenderHeader = ({ currentMonth, prevMonth, nextMonth }) => {
    return (
        <div className="header row">
            <div className="col col-start">
                <span className="text">
                    <span className="text month my-strong" style={{fontSize: '25px'}}>{format(currentMonth, 'M')}월 </span>{format(currentMonth, 'yyyy')}
                </span>
            </div>
            <div className="col col-end mb-5" style={{marginLeft: '75%'}}>
                <Button variant="light" onClick={prevMonth}><IoIosArrowBack /></Button>
                <Button variant="light" onClick={nextMonth}><IoIosArrowForward /></Button>
            </div>
        </div>
    );
};

const RenderDays = () => {
    const days = [];
    const date = ['Sun', 'Mon', 'Thu', 'Wed', 'Thrs', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
        days.push(
            <div className="col" key={i} style={{textAlign: 'center'}}>
                {date[i]}
            </div>,
        );
    }
    return <div className="days row mb-5" style={{backgroundColor: 'lightgrey'}}>{days}</div>;
};

const RenderCells = ({ currentMonth, selectedDate, onDateClick, groupedGoalList }) => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';
    let f = '';

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, 'd');
            f = format(day, 'yyyy-MM-dd');

            //날짜별 배열을 운동, 식단 타입별로 다시 나누기
            let menuGoalList = [];
            let sportGoalList = [];

            if(groupedGoalList[f]!=undefined){
                for(let g of groupedGoalList[f]){
                    if(g.type=='식단'){
                        menuGoalList.push(g);
                    }else{
                        sportGoalList.push(g);
                    }
                }
            }

            const cloneDay = day;
            days.push(
                <div style={{height: '100px'}}
                    className={`ms-3 mb-3 col cell ${
                        !isSameMonth(day, monthStart)
                            ? 'disabled'
                            : isSameDay(day, selectedDate)
                            ? 'selected'
                            : format(currentMonth, 'M') !== format(day, 'M')
                            ? 'not-valid'
                            : 'valid'
                    }`}
                    key={day} onClick={() => onDateClick(cloneDay)} >
                    <span className={format(currentMonth, 'M') !== format(day, 'M') ? 'text not-valid': ''}>
                        {formattedDate}
                    </span>
                    <div className='ps-5'>
                    {menuGoalList.length>0?<><FcPaid /> {menuGoalList.length}</>:''} <br/>
                    {sportGoalList.length>0?<><FcSportsMode /> {sportGoalList.length}</>:''}
                    </div>
                </div>,
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className="row" key={day}>
                {days}
            </div>,
        );
        days = [];
    }
    return <div className="body" >{rows}</div>;
};

export default function Monthly(){
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    //클릭한 날짜에 완료 스케쥴 목록 가져오기 기능
    const [goalListByClickDate, setGoalListByClickDate] = useState([]);

    const onDateClick = (day) => {
        setSelectedDate(day);

        callApi('http://localhost:8080/monthlySchedulerApi/get/'+day, 'GET')
        .then((response)=>{
          if(response.status === 200){
            response.json().then((json)=>{
                setGoalListByClickDate(json.data[0].goalListByClickDate);
            })
          }
          }).catch((status)=>console.log(status));
    };

    //날짜별 전체 goal 가져오기 기능
    const fMonth = format(currentMonth, 'M');
    console.log(fMonth);
    const [goalList, setGoalList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [scheduleCount, setSchedultCount] = useState(0);

    useEffect(()=>{ 
        callApi('http://localhost:8080/monthlySchedulerApi/getAll/'+fMonth, 'GET')
        .then((response)=>{
          if(response.status === 200){
            response.json().then((json)=>{
                console.log(json)
                setGoalList(json.data[0].totalList); 
                setTotalCount(json.data[0].scheduleCount); 
                setSchedultCount(json.data[0].totalCount);
            })
          }
          }).catch((status)=>console.log(status));
      }, [currentMonth])

      //가져온 배열 날짜별로 그룹화한 객체 생성
      const groupedGoalList = goalList.reduce((acc, curr) => {  
        const { achieveDate } = curr;                        
        if (acc[achieveDate]) {
            acc[achieveDate].push(curr);  
        }else {
            acc[achieveDate] = [curr];             
        }
        return acc;                          
      }, {});

      //월간 성취율 계산
      let percentage = scheduleCount/totalCount*100;
      console.log(scheduleCount);
      if (isNaN(percentage)) { // 값이 없어서 NaN값이 나올 경우
        percentage = 0;
       }

    
    return(
        <>
       <div className="calendar mb-3">
            <RenderHeader currentMonth={currentMonth} prevMonth={prevMonth} nextMonth={nextMonth} />
            <p>월간 성취율: {percentage.toFixed(2)}% {
            percentage==0
            ?<ImNeutral2/>
            :percentage<20
            ?<ImSmile2/>
            :percentage>=20 && percentage<40
            ?<ImCool2/>
            :percentage>=40 && percentage<60
            ?<ImHappy2/>
            :percentage>=60 && percentage<80
            ?<ImWink2/>
            :<ImGrin2/>
            } </p>
            <RenderDays />
            <RenderCells currentMonth={currentMonth} selectedDate={selectedDate} onDateClick={onDateClick} groupedGoalList={groupedGoalList}/>
        </div>

        <div>
        <hr/><br/><h2>완료한 스케쥴 목록</h2><br/>
        <Row>
        <Col>
        <Form.Label htmlFor="basic-url" className='my-strong'>식단 <FcPaid /></Form.Label>
        <ListGroup as="ol" numbered>
            {goalListByClickDate.map((g, i)=>{
                if(g.type=='식단'){
                    return <ListGroup.Item as="li">{g.goal}</ListGroup.Item>
                }else{
                    return <></>
                }
            })}    
    </ListGroup>
        </Col>
        <Col>
        <Form.Label htmlFor="basic-url" className='my-strong'>운동 <FcSportsMode /></Form.Label>
        <ListGroup as="ol" numbered>
        {goalListByClickDate.map((g, i)=>{
                if(g.type=='운동'){
                    return <ListGroup.Item as="li">{g.goal}</ListGroup.Item>
                }else{
                    return <></>
                }
            })}    
    </ListGroup>
        </Col>
      </Row>
        </div>
        </>
    );
}