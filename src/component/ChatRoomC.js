import React, { useRef, useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import '../App.css';
import '../style/style.css';
import { Button, Image, Container, InputGroup, Form } from "react-bootstrap";
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';

const ChatRoomC = () => {
  const trainerName = sessionStorage.getItem('trainer');
  const roomName = "["+trainerName+"] 님의 오픈 채팅방";

  const [messages, setMessages] = useState([]);
  const writer = sessionStorage.getItem("username") || "코딩하는 라이언";
  const [messageInput, setMessageInput] = useState("");
  const [inputEnabled, setInputEnabled] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    clientRef.current = new Client({
      brokerURL: "ws://localhost:8080/ws/chat",
    });

    clientRef.current.onConnect = (frame) => {
      clientRef.current.subscribe(`/topic/chatC/${roomName}`, (message) => {
        const response = JSON.parse(message.body);
        console.log("Response:", response);
        setMessages((prevMessages) => [...prevMessages, response]);
      });
    };

    clientRef.current.onWebSocketError = (error) => {
      console.error("Error with websocket", error);
    };

    clientRef.current.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    clientRef.current.activate();
    return () => {
      clientRef.current.deactivate(); // 열리는 중이면 닫기 전까지 잠시 기다려줌.
    };
  }, []);

  const disconnect = () => {
    clientRef.current.publish({
      destination: `/app/endC/${roomName}`,
      headers: {},
      body: writer,
    });

    setTimeout(() => {
      clientRef.current.deactivate();
      setInputEnabled(false);
    }, 1500);
    
    window.location = '/trainerMatch';
  };

  const sendMessage = () => {
    const messageObject = {
      writer: writer,
      message: messageInput,
      date: "2023-10-26",
    };

    clientRef.current.publish({
      destination: `/app/chatC/${roomName}`,
      headers: {},
      body: JSON.stringify(messageObject),
    });
    setMessageInput("");
  };
  const enter = () => {
    clientRef.current.publish({
      destination: `/app/helloC/${roomName}`,
      headers: {},
      body: writer,
    });
    setInputEnabled(true);
  };

  return (
    <>
    <div className='my-page'>
        <Container fluid>
        <MyNavbar />
      <Image style={{marginTop: '50px'}} src='img/matching.jpg' alt='matching image' fluid />


      <Container className='p-5 mt-5 mb-5'>
      <div className="chat-room">
      <div className="">
        <div className="">
          <h2>{roomName}</h2><br/>
          {messages.map((message, index) => {
            if (message.speaker === writer) {
              return (
                <Container>
                <div className="me" key={index}>
                  {message.writer && (
                    <div>{message.writer}님이 입장하셨습니다!</div>
                  )}

                  <div>{message.speaker}</div>
                  <div className="contain">
                    <div>{message.date}</div>
                    <div>{message.message}</div>
                  </div>
                  {message.outer && (
                    <div>{message.outer}님이 퇴장하셨습니다!</div>
                  )}
                </div>
                </Container>
              );
            }
            return (
              // 사용자이름과 다른 경우
              <Container>
              <div className="others" key={index} >
                {message.writer && (
                  <div>{message.writer}님이 입장하셨습니다!</div>
                )}

                <div>{message.speaker}</div>
                <div className="contain">
                  <div>{message.message}</div>
                  <div>{message.date}</div>
                </div>
                {message.outer && (
                  <div>{message.outer}님이 퇴장하셨습니다!</div>
                )}
              </div>
              </Container>
            );
          })}
        </div>
      </div>

      <div className="input">
      <InputGroup className="mb-3">
        <Form.Control style={{width: '500px'}} type="text" placeholder="채팅할 내용을 입력해주세요." name="content" 
        value={messageInput} onChange={(e) => setMessageInput(e.target.value)} disabled={!inputEnabled}/>
        <Button variant="warning" onClick={sendMessage} disabled={!inputEnabled}>Send</Button>   
      </InputGroup>

        <Container className="my-div2">
        <Button variant="warning" onClick={enter} size="lg">채팅 참가하기</Button>
        <Button variant="warning" onClick={disconnect} size="lg">채팅 나가기</Button>
        </Container>
      </div>
    </div>
      </Container>

<MyFooter />
  </Container>
  </div>
    </>
  );
};

export default ChatRoomC;
