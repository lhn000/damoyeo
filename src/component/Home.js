import '../App.css';
import '../style/style.css';
import React from 'react';
import { Container } from 'react-bootstrap';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';
import MyCarouselAndWiseSaying from './MyCarouselAndWiseSaying';
import MyCard from './MyCard';
import MyBottomNav from './MyBottomNav';

export default function Home() {
  return (
    <div className='my-page'>
      <Container fluid>
      <MyNavbar />
      <MyCarouselAndWiseSaying />
      <MyCard />
      <MyBottomNav />
      <MyFooter />
    </Container>
    </div>
  );
}
