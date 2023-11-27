import '../App.css';
import '../style/style.css';
import React from 'react';
import { Container, Image, Button, Table, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';

export default function Bmi(){
  //bmi 계산 기능
  const [year, setYear] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [message, setMessage] = useState(''); //결과 텍스트 출력

  const handleYear = (e) => {
    setYear(e.target.value);
  };
  const handleHeight = (e) => {
    setHeight(e.target.value);
  };
  const handleWeight = (e) => {
    setWeight(e.target.value);
  };
  const handleGender = (e) => {
    setGender(e.target.value);
  };

  //빈칸 유효성 검사 함수
  function checkValidate(){
    if(year==null || year=='' || height==null || height=='' || weight==null || weight=='' || gender==null || gender==''){
        throw new Error();
    }
  }

  //결과 보기 버튼 눌렀을 때 실행되는 함수
  let handleResult = (event) => {
    try{
        checkValidate();

        let a = height;
        let b = weight;
        let result2 = a * a;
        let result3 = b / result2;
    
        let result4 = Math.round(result3 * 100000) / 10.0;
    
        if (result4 <= 18.5) {
            const nextMessage = '당신의 BMI 지수는'+ result4 + '으로 저체중입니다.';
            setMessage(nextMessage);
    
        } else if (result4 <= 25.0) {
            const nextMessage = '당신의 BMI 지수는'+ result4 + '으로 정상입니다.';
            setMessage(nextMessage);
        
        } else if (result4 <= 30.0) {
            const nextMessage = '당신의 BMI 지수는'+ result4 + '으로 과체중입니다.';
            setMessage(nextMessage);
    
        } else {
            const nextMessage = '당신의 BMI 지수는'+ result4 + '으로 비만입니다.';
            setMessage(nextMessage);
        }

    }catch(e){
        alert('모든 항목을 입력해주세요.');
    }
    event.preventDefault(); 
  }


    return(
        <div className='my-page'>
        <Container fluid>

        <MyNavbar />
      <Image style={{marginTop: '50px'}} src='img/bmi.jpg' alt='bmi image' fluid />
      <Container className="my-div">
        
      <Table bordered size="sm">
        <tbody>
        <tr>
          <th className='my-strong' style={{width: '20%', height: '100px', backgroundColor: 'lightGrey'}}><h5>성별</h5></th>
          <td>    
            <Form> 
        <div key={`inline-radio`} style={{fontSize: '18px'}}>
          <Form.Check type='radio' inline label="여자" name="gender" id='inline-radio-1' value="female" onChange={handleGender}/>
          <Form.Check type='radio' inline label="남자" name="gender" id='inline-radio-2' value="male" onChange={handleGender}/>
        </div>
    </Form>
    </td>

        </tr>
        <tr>
          <th className='my-strong' style={{width: '20%', height: '100px', backgroundColor: 'lightGrey'}}><h5>태어난 년도</h5></th>
          <td>
            <InputGroup style={{fontSize: '18px'}}>
            <Form.Control className='ms-3' type="text" placeholder="태어난 년도를 입력해주세요. ex) 1996" name="year" value={year} onChange={handleYear}/>
            <Form.Label className='m-3'>년</Form.Label>
            </InputGroup>
        </td>

        </tr>
        <tr>
          <th className='my-strong' style={{width: '20%', height: '100px', backgroundColor: 'lightGrey'}}><h5>키</h5></th>
          <td>
          <InputGroup style={{fontSize: '18px'}}>
            <Form.Control className='ms-3' type="text" placeholder="키를 입력해주세요. ex) 160" name="height" value={height} onChange={handleHeight}/>
            <Form.Label className='m-3'>cm</Form.Label>
            </InputGroup>
          </td>
        </tr>
        <tr>
          <th className='my-strong' style={{width: '20%', height: '100px', backgroundColor: 'lightGrey'}}><h5>몸무게</h5></th>
          <td>
          <InputGroup style={{fontSize: '18px'}}>
            <Form.Control className='ms-3' type="text" placeholder="몸무게를 입력해주세요. ex) 50" name="weight" value={weight} onChange={handleWeight} />
            <Form.Label className='m-3'>kg</Form.Label>
            </InputGroup>
          </td>
        </tr>
        </tbody>
    </Table>
      </Container>
        
      <Container>
      <h3>▶ BMI 지수란?</h3>
      <h5>나이, 신장, 체중만으로 비만을 판정하는 비만 지수</h5>
      </Container>

      <Container className='mt-5'>
      <h1>{message}</h1>
      </Container>

      <Container className="my-div">
      <Button onClick={handleResult} className="mb-5" variant="secondary" id="button-addon1" size="lg">결과 보기</Button>
      </Container>
      
      <MyFooter />
      </Container>
      </div>
    );
}