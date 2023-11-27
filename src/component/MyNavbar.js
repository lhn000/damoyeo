import '../App.css';
import '../style/style.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Image, Button } from 'react-bootstrap';
import { useState } from 'react';

export default function MyNavbar(){
    //로그인 유저네임 가져오기
    const currentUserName = sessionStorage.getItem('username');
    
    //네비바 카테고리 출력하기
    const TopNav = React.memo(function TopNav(){
    const menuList = [
      ["다모여!", {name: "브랜드 소개", path: "/brand"}], 
      ["내 유형 검사하기", {name: "운동 유형 검사", path: "/sportTest"}, {name: "식단 유형 검사", path: "/menuTest"}, 
        {name: "BMI 검사", path: "/bmi"}, {name: "칼로리 사전", path: "/calorie"}], 
      ["스케쥴러", {name: "나만의 스케쥴러", path: "/scheduler"}], 
      ["커뮤니티", {name: "게시판", path: "/community"}, {name: "1:1 상담", path: "/consulting"}, {name: "트레이너 매칭", path: "/trainerMatch"}], 
      ["스토어", {name: "다모여 샵", path: "/shop"}, {name: "할인 상품", path: "/productForSale"}]
    ];
    
    const [hide, setHide] = useState({
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      menu5: false,
    });
    const mouseEvent = (menuName, bool) => {
      const change = { ...hide };
      change[menuName] = bool;
      setHide(change);
    };

    return(
      <div>
      <nav className="customNav">
      <ul className="navContainer">
        {menuList.map((menu, i) => (
          <li key={i}
            className={hide[menu] ? "active" : "none"}
            onMouseEnter={() => mouseEvent(menu, true)}
            onMouseLeave={() => mouseEvent(menu, false)}
          >
            <p>{menu[0]}</p>
          </li>
        ))}
      </ul>
      <div className="detailMenu">
        {menuList.map((menu, i) => (
          <ul key={i}
            onMouseEnter={() => mouseEvent(menu, true)}
            onMouseLeave={() => mouseEvent(menu, false)}
          >
            {menu.map((sub, i)=>{
              if(i === 0) return null;
              return (<li key={i}><Link style={{textDecoration: 'none', color: 'black' }} to={sub.path} variant="body2">{sub.name}</Link></li>);
            } 
            )}
          </ul>
        ))}
      </div>
    </nav>
      </div>
    );
  });

  //로그아웃 함수
  function handleLogout(){
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("type");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("userId");
    window.location = '/';
  }

  //장바구니 클릭
  function handleClickCart(){
    sessionStorage.setItem('location', 'third');
    window.location = '/mypage';
  }

    return(
        <>
        {
            !sessionStorage.getItem('token')
            ? <>
            <Nav className="justify-content-end">
            <Nav.Item>
              <Nav.Link><Link style={{ marginRight: '10px', textDecoration: 'none', color: 'black' }} to="/signup" variant="body2">회원가입</Link></Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link><Link style={{ marginRight: '10px', textDecoration: 'none', color: 'black' }} to="/login" variant="body2">로그인</Link></Nav.Link>
            </Nav.Item>
          </Nav>
          </>
            : sessionStorage.getItem('role')!='TRUE'
            ?
            <>
            <Nav className="justify-content-end">
            <Nav.Item className='mt-2'>
              <Nav.Link><Link style={{textDecoration: 'none', color: 'black' }} to="/mypage" variant="body2">마이페이지</Link></Nav.Link>
            </Nav.Item>
            <Nav.Item className='mt-2'>
              <Nav.Link><Link style={{textDecoration: 'none', color: 'black' }} onClick={handleClickCart} variant="body2">장바구니</Link></Nav.Link>
            </Nav.Item>
            <Nav.Item className='mt-1'>
              <Nav.Link><Button onClick={handleLogout} variant="outline-dark" style={{textDecoration: 'none', color: 'black' }}>로그아웃</Button></Nav.Link>
            </Nav.Item>
          </Nav>
          <p className="text-end me-4 mt-2">{currentUserName}님, 환영합니다.</p>
          </>
          :<>
          <Nav className="justify-content-end">
            <Nav.Item className='mt-2'>
              <Nav.Link><Link style={{textDecoration: 'none', color: 'black' }} to="/adminPage" variant="body2">관리자 페이지</Link></Nav.Link>
            </Nav.Item>
            <Nav.Item className='mt-1'>
              <Nav.Link><Button onClick={handleLogout} variant="outline-dark" style={{textDecoration: 'none', color: 'black' }}>로그아웃</Button></Nav.Link>
            </Nav.Item>
          </Nav>
          <p className="text-end me-4 mt-2">{currentUserName}님, 환영합니다.</p>
          </>
          }
    
          <p className="text-center mb-10"><Link to="/" variant="body2"><Image src='img/logo.png' alt='logo image' width={250}/></Link></p>
          <TopNav />
          </>
    );
}