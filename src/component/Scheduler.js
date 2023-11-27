import '../App.css';
import '../style/style.css';
import React from 'react';
import { Container, Image, Tab, Tabs } from 'react-bootstrap';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';
import Weekly from './Weekly';
import Monthly from './Monthly';

export default function Scheduler(){
    return(
        <>
         <div className='my-page'>
        <Container fluid>
        <MyNavbar />
      <Image style={{marginTop: '50px'}} src='img/scheduler.jpg' alt='scheduler image' fluid />

    <Container className='p-5' style={{marginTop: '80px', marginBottom: '80px'}}>
    <Tabs defaultActiveKey="weekly" id="fill-tab-example" fill  style={{fontFamily: 'cafe', fontSize: '18px'}}>
      <Tab eventKey="weekly" title="나의 오늘 할 일">
            <Weekly />
      </Tab>
      <Tab className='p-5' style={{marginTop: '50px', marginBottom: '50px'}} eventKey="monthly" title="나의 월간 성취표">
            <Monthly />
      </Tab>
    </Tabs>
    </Container>

      <MyFooter />
        </Container>
        </div>
        </>
    );
}