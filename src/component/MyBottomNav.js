import '../App.css';
import '../style/style.css';
import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';

export default function MyBottomNav(){
    return(
<>
<Row className="justify-content-md-center mb-5">
        <Col xs lg="2">
          <Card border="light" style={{ width: '15rem', marginTop: '20px'}}>
            <Card.Img variant="top" src="img/mainIcon01.png" style={{marginBottom: '25px'}}/>
            <Card.Body>
              <Card.Title style={{textAlign: 'center', fontWeight: 'bold'}}>전화 상담</Card.Title>
              <Card.Text style={{textAlign: 'center', fontSize: '25px'}}>1588-5000</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs lg="2">
        <Card style={{ width: '15rem', marginTop: '20px'}}>
            <Card.Img variant="top" src="img/mainIcon02.jpg" />
            <Card.Body>
              <Card.Title style={{textAlign: 'center', fontWeight: 'bold'}}>오늘의 신상품</Card.Title>
              <div className="d-grid gap-2">
              <Button variant="light" onClick={()=>window.location='/shop'}>스토어로 이동</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs lg="2">

        <Card style={{ width: '15rem', marginTop: '20px'}}>
            <Card.Img variant="top" src="img/mainIcon03.jpg"  />
            <Card.Body>
              <Card.Title style={{textAlign: 'center', fontWeight: 'bold'}}>꿀팁 공유</Card.Title>
              <div className="d-grid gap-2">
              <Button variant="light" onClick={()=>window.location='/community'}>커뮤니티 가기</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs lg="2">
        <Card style={{ width: '15rem', marginTop: '20px'}}>
            <Card.Img variant="top" src="img/mainIcon04.jpg"/>
            <Card.Body>
              <Card.Title style={{textAlign: 'center', fontWeight: 'bold'}}>트레이너 채팅</Card.Title>
              <div className="d-grid gap-2">
              <Button variant="light" onClick={()=>window.location='/trainerMatch'}>채팅 하기</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br/><br/><br/>
</>
    );
}