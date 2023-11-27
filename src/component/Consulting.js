import React, { useRef, useState, useEffect } from "react";
import callApi from "./ApiService";
import { RiDeleteBin6Line, RiQuestionnaireLine } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import { SiAnswer } from "react-icons/si";
import { LiaReplyd } from "react-icons/lia";
import MyFooter from "./MyFooter";
import MyNavbar from "./MyNavbar";
import { Container, Image, Table, Pagination, Button, Form } from "react-bootstrap";

export default function Consulting(){
    const [trainerList, SetTrainerList] = useState([]);
    const sname = sessionStorage.getItem("username");
  
    const [writer, setWriter] = useState([]);
    const [title, setTitle] = useState([]);
    const [content, setContent] = useState([]);
    const [viewList, setViewList] = useState([]);
    const [senderName, setSenderName] = useState(sname);
    const [trainerName, setTrainerName] = useState(null);
    const [pmgId, SetPmgId] = useState(null);
    const [role, SetRole] = useState(null);
  
    //페이지네이션 기능
    //페이지 당 포스트 개수 설정, 나눠주기
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(15);
  
    //페이지 버튼 몇 개까지 보여줄 지 결정
    const [active, setActive] = useState(1);
    let items = [];
    const lastNum = Math.ceil(viewList.length / postsPerPage);
    for (let number = 1; number <= lastNum; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === active}
          onClick={() => {
            setActive(number);
            setCurrentPage(number);
          }}>
          {number}
        </Pagination.Item>
      );
    }
  
    useEffect(() => {
      callApi("http://localhost:8080/trainerApi/userOrTrainer", "GET")
        .then((response) => response.json())
        .then((json) => {
          SetRole(json.object.role);
          console.log(json.object.role);
          setWriter(sname);
        })
        .catch((status) => console.log(status));
  
      callApi("http://localhost:8080/trainerApi/getAll", "GET")
        .then((response) => response.json())
        .then((json) => {
          console.log(json.data)
          SetTrainerList(json.data);
        })
        .catch((status) => console.log(status));
  
      callApi("http://localhost:8080/postMessageApi/getAllByUserId", "GET")
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          setViewList(json.data);
        })
        .catch((status) => console.log(status));
    }, []);
  
    const addPostMsg = async (e) => {
      console.log("senderName111:" + senderName);
      const message = {
        senderName: role === "TRUE" ? trainerName : senderName,
        recieveName: role === "TRUE" ? senderName : trainerName,
        title: title,
        content: content,
        date: new Date(),
      };
      console.log("trainerName:" + trainerName);
      console.log("senderName:" + senderName);
  
      if (title !== null && content !== null) {
        fetch("http://localhost:8080/postMessageApi/sendMessage", {
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
            callApi("http://localhost:8080/postMessageApi/getAllByUserId", "GET")
              .then((response) => response.json())
              .then((json) => {
                setViewList(json.data);
              })
              .catch((status) => console.log(status));
          })
          .catch((status) => console.log(status));
      }
      setTitle("");
      setSenderName("");
      setContent("");
    };
    async function handleAnswerClick(e) {
      //트레이너가 답글 쓰는 상황
      await callApi("http://localhost:8080/postMessageApi/getPmg/" + e, "GET")
        .then((response) => response.json())
        .then((json) => {
          setSenderName(json.data[0].senderName);
          setTrainerName(json.data[0].recieveName);
          setTitle("[RE]:" + json.data[0].title);
        })
        .catch((status) => console.log(status));
    }
    function editPostMsg(e) {
      console.log(pmgId);
      const message = {
        senderName: writer,
        recieveName: trainerName,
        title: title,
        content: content,
        date: new Date(),
        postMsgId: pmgId,
      };
      fetch("http://localhost:8080/postMessageApi/doEdit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        body: JSON.stringify(message),
      })
        .then((response) => response.json())
        .then((json) => {
          setViewList(json.data);
        })
        .catch((status) => console.log(status));
      setTitle("");
      setContent("");
    }
    function handleContentChange(event) {
      if (event.target.value === null) {
        alert("내용를 입력하세요.");
      }
      setContent(event.target.value);
    }
    function handleTitleChange(event) {
      if (event.target.value === null) {
        alert("제목를 입력하세요.");
      }
      setTitle(event.target.value);
    }
    function handleDeleteClick(event) {
      callApi("http://localhost:8080/postMessageApi/deletePmg/" + event, "DELETE")
        .then((response) => response.json())
        .then((json) => {
          setViewList(json.data);
          alert(json.msg);
        })
        .catch((status) => console.log(status));
    }
    function handleEditClick(event) {
      callApi("http://localhost:8080/postMessageApi/editPmg/" + event, "GET")
        .then((response) => response.json())
        .then((json) => {
          console.log(json)
          setTitle(json.data[0].title);
          setContent(json.data[0].content);
          setTrainerName(json.data[0].recieveName);
          SetPmgId(json.data[0].postMsgId);
        })
        .catch((status) => console.log(status));
    }

    return(
        <>
      <div className="my-page">
        <Container fluid>
          <MyNavbar />
          <Image
            style={{ marginTop: "50px" }}
            src="img/trainer.jpg"
            alt="trainer image"
            fluid
          />
          {role === "TRUE" ? ( //트레이너 접속 시
            <>
              <Container
                 className="pt-3 mt-5"
                 style={{ width: "800px", marginTop: "100px"
                }}>
                <Container className="mt-5 mb-3" style={{ textAlign: "center" }}>
                  <h3 style={{textAlign: 'left'}}><LiaReplyd size={40}/>답변 남기기</h3>

                  <Form.Control
                    type="text"
                    placeholder="유저."
                    aria-label="searchContent"
                    aria-describedby="basic-addon3"
                    value={senderName}
                  /><br/>
                  <Container>
                    <Form.Control className="p-3"
                      type="text"
                      placeholder="제목을 입력해주세요."
                      aria-label="searchContent"
                      aria-describedby="basic-addon3"
                      name="searchContent"
                      value={title}
                      onChange={handleTitleChange}
                    />
                  </Container>
                  <Container className="mb-3">
                    <Form.Control className="pt-5 pb-5"
                      type="text"
                      placeholder="내용을 입력해주세요."
                      aria-label="searchContent"
                      aria-describedby="basic-addon3"
                      name="searchContent"
                      value={content}
                      onChange={handleContentChange}
                    />
                  </Container>
                  <Button type="submit" onClick={addPostMsg} className="mb-5" variant="outline-info">
                    답변하기
                  </Button>
                </Container>
              </Container>
              <Container className="mt-5" style={{ textAlign: "center" }}>
                <Table className="my-table mb-5" striped bordered hover>
                  <thead>
                    <tr className="my-strong">
                      <th>번호</th>
                      <th class="col-1">발신자</th>
                      <th class="col-2">제목</th>
                      <th class="col-6">내용</th>
                      <th class="col-1">수신자</th>
                      <th class="col-6">작성일</th>

                      <th>답변</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewList.map((p) => (
                      <tr>
                        <td>{p.postMsgId}</td>
                        <td>{p.senderName}</td>
                        {p.title.includes('[RE]:')?<td style={{color: 'red'}}>{p.title}</td>:<td>{p.title}</td>}
                        <td>{p.content}</td>
                        <td>{p.recieveName}</td>
                        <td>{p.date}</td>

                        <td>
                          <Button
                            variant="Button"
                            onClick={(event) => handleAnswerClick(p.postMsgId)}>
                            <SiAnswer size="25" color="Hotpink" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Container>
            </>
          ) : (
            <>
              <Container
                className="pt-3 mt-5"
                style={{ width: "800px", marginTop: "100px" }}>
                <Container className="mt-5 mb-3" style={{ textAlign: "center" }}>
                  <h3 style={{textAlign: 'left'}}><RiQuestionnaireLine/> 문의 남기기</h3>
                  <Form.Select 
                    aria-label="Default select example"
                    onChange={(e)=>{setTrainerName(e.target.value); console.log(e.target.value)}} >
                    <option>문의를 남길 트레이너를 선택해주세요.</option>
                    {trainerList.map((message, index) => (
                      <option key={index} value={message.userName}>{message.userName}</option>
                    ))}
                  </Form.Select><br/>
                  <Container>
                    <Form.Control className="p-3"
                      type="text"
                      placeholder="제목을 입력해주세요."
                      aria-label="searchContent"
                      aria-describedby="basic-addon3"
                      name="searchContent"
                      value={title}
                      onChange={handleTitleChange} 
                    />
                  </Container>
                  <Container className="mb-3">
                    <Form.Control className="pt-5 pb-5"
                      type="text"
                      placeholder="내용을 입력해주세요."
                      aria-label="searchContent"
                      aria-describedby="basic-addon3"
                      name="searchContent"
                      value={content}
                      onChange={handleContentChange}
                    />
                  </Container>
                  <Button className="mb-5 me-2" type="submit" onClick={addPostMsg} variant="outline-info">
                    쪽지 보내기
                  </Button>
                  <Button className="mb-5" type="submit" onClick={editPostMsg} variant="secondary">
                    수정하기
                  </Button>
                </Container>
              </Container>
              <Container className="mt-5" style={{ textAlign: "center" }}>
                <Table className="my-table mb-5" striped bordered hover>
                  <thead>
                    <tr className="my-strong">
                      <th>번호</th>
                      <th class="col-1">발신자</th>
                      <th class="col-2">제목</th>
                      <th class="col-6">내용</th>
                      <th class="col-1">수신자</th>
                      <th class="col-6">작성일</th>
                      <th>수정</th>
                      <th>삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewList.map((p) => (
                      <tr>
                        <td>{p.postMsgId}</td>
                        <td>{p.senderName}</td>
                        {p.title.includes('[RE]:')?<td style={{color: 'red'}}>{p.title}</td>:<td>{p.title}</td>}
                        <td>{p.content}</td>
                        <td>{p.recieveName}</td>
                        <td>{p.date}</td>
                        <td>
                          <Button
                            variant="Button"
                            onClick={(event) => handleEditClick(p.postMsgId)}>
                            <BiEditAlt size="25" color="Hotpink" />
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="Button"
                            onClick={(event) => handleDeleteClick(p.postMsgId)}>
                            <RiDeleteBin6Line size="25" color="Hotpink" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Container>
            </>
          )}
          
          <Container fluid className="p-5">
            <div style={{ paddingLeft: "48%", paddingBottom: "50px" }}>
              <Pagination variant="secondary">
                <Pagination.First
                  onClick={() => {
                    setActive(1);
                    setCurrentPage(1);
                  }}
                />
                <Pagination.Prev
                  onClick={() => {
                    setActive(currentPage - 1 > 0 ? currentPage - 1 : 1);
                    setCurrentPage(currentPage - 1 > 0 ? currentPage - 1 : 1);
                  }}
                />
                {items}
                <Pagination.Next
                  onClick={() => {
                    setActive(
                      currentPage + 1 > lastNum ? lastNum : currentPage + 1
                    );
                    setCurrentPage(
                      currentPage + 1 > lastNum ? lastNum : currentPage + 1
                    );
                  }}
                />
                <Pagination.Last
                  onClick={() => {
                    setActive(lastNum);
                    setCurrentPage(lastNum);
                  }}
                />
              </Pagination>
            </div>
          </Container>
          <MyFooter />
        </Container>
      </div>
    </>
    );
}