import '../App.css';
import '../style/style.css';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import callApi from "./ApiService";
import { Button, Image, Container, Row, Col } from "react-bootstrap";
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';

export default function TrainerMatch(){
  const [trainerList, SetTrainerList] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);

  useEffect(() => {
    callApi("http://localhost:8080/trainerApi/getAll", "GET")
      .then((response) => response.json())
      .then((json) => {
        SetTrainerList(json.data);
        const urls = json.data.map((trainer) => trainer.img || "");
        setImageUrl(urls);
      })
      .catch((status) => console.log(status));
  }, []);
  const dd = imageUrl[0];
  console.log(dd);

    return(
        <>
         <div className='my-page'>
        <Container fluid>
        <MyNavbar />
      <Image style={{marginTop: '50px'}} src='img/matching.jpg' alt='matching image' fluid />

      <Container className='p-5 mt-5'>
        {trainerList.map((message, index) => (
          <Row className='mb-5'>
          <Col sm={3} className='me-3'><Image src={"http://localhost:8080/trainerApi/getImage/" + imageUrl[index]} width={300}/></Col>
          <Col className='me-5'>
          <Container className='pt-5'>
          <div className="pb-2" style={{fontFamily: "cafe"}}><h2 style={{textAlign: 'center'}}>{message.userName}</h2></div><hr/>
          <h5 style={{textAlign: 'center'}}><div dangerouslySetInnerHTML={{ __html: message.introduce }}></div></h5><hr/>
          <p style={{textAlign: 'center'}}><div dangerouslySetInnerHTML={{ __html: message.experience }}></div></p><br/>
          </Container>
          </Col>
          <Col sm={3} className='pt-5 mt-5 ps-5' >
          <Link to={`/chat${index+1}`}>
            <Button className="p-4" variant="dark" size="lg" onClick={()=>sessionStorage.setItem('trainer', message.userName)}>
              {message.userName} 님의 오픈 채팅방 가기</Button>
          </Link>
          </Col>
          </Row>
        ))}
      </Container>

      <MyFooter />
        </Container>
        </div>
    </>
    );
}