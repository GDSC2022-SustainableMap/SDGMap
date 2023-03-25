import Table from "react-bootstrap/Table";
import "./community.css";
import { React, useState, useEffect } from "react";
import { Modal, Carousel, Card, Stack } from "react-bootstrap";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBSpinner,
} from "mdb-react-ui-kit";
import Badges from "../Badge/badge";
import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";
import "./leaderboard.css";
import axios from "axios";
import useToken from "../../hooks/token";
import { useNavigate } from "react-router-dom";

function FriendProfile(data) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { getToken, removeToken } = useToken();
  const navigate = useNavigate();
  // Modal of Edition
  // const [show, setShow] = useState(false);
  // const handleShow = () => setShow(true);

  // Carousel1
  function CarouselOfVisitedStore() {
    const [index, setIndex] = useState(0);
    const [current, setCurrent] = useState(0);
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };

    const InfoCard = ({ name, addr, price, rate, phone }) => {
      let p = "";
      for (let i = 0; i < price; i++) {
        p = p + "$";
      }
      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
      return (
        <div className="card">
          <b>{name}</b>
          <hr />
          地址: {addr}
          <br />
          評分: {rate}&emsp;
          <div>
            電話: {phone}
            <br />
            價格: {p}
            <br />
            <button
              className="card-button-orange"
              variant="primary"
              onClick={handleShow}
            >
              More info
            </button>
          </div>
        </div>
      );
    };
    return (
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        variant="dark"
        showindicators="false"
      >
        {data &&
          data.data.user_log.log_spots
            .reduce((accumulator, currentValue, currentIndex, array) => {
              if (currentIndex % 2 === 0) {
                accumulator.push(array.slice(currentIndex, currentIndex + 2));
              } else if (currentIndex % 2 === 1 && currentIndex + 2 > array.length && currentIndex < array.length - 1) {
                accumulator.push(array.slice(currentIndex, currentIndex + 1));
              }
              return accumulator;
            }, [])
            .map((store, index) => (
              store.length === 2 ? (
                <Carousel.Item key={index}>
                  <Stack direction="horizontal" className=" stack" gap={4} style={{margin:"0 4%"}}>
                    <InfoCard className="card-orange card"
                      name={store[0].name}
                      addr={store[0].formatted_address}
                      price={store[0].price_level}
                      rate={store[0].rating}
                      phone={store[0].formatted_phone_number}
                      place_id={store[0].place_id}
                    />
                    <InfoCard
                      className="card-orange card"
                      name={store[1].name}
                      addr={store[1].formatted_address}
                      price={store[1].price_level}
                      rate={store[1].rating}
                      phone={store[1].formatted_phone_number}
                      place_id={store[1].place_id}
                    />

                  </Stack>
                </Carousel.Item>
              ) : (
                <Carousel.Item>
                  <Stack direction="horizontal" className=" stack" gap={4} style={{margin:"0 4%"}}>
                    <InfoCard className="card-orange card"
                      name={store[0].name}
                      addr={store[0].formatted_address}
                      price={store[0].price_level}
                      rate={store[0].rating}
                      phone={store[0].formatted_phone_number}
                      place_id={store[0].place_id}
                    />
                  </Stack>
                </Carousel.Item>
              )))}
      </Carousel>
    );
  }
  // Carousel2
  function CarouselOfStoredStore() {
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };

    const InfoCard = ({ name, addr, price, rate, phone }) => {
      let p = "";
      for (let i = 0; i < price; i++) {
        p = p + "$";
      }
      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);

      return (
        <div className="card">
          <b>{name}</b>
          <hr />
          地址: {addr}
          <br />
          評分: {rate}&emsp;
          <div>
            電話: {phone}
            <br />
            價格: {p}
            <br />
            <button
              className="card-button-green"
              variant="primary"
              onClick={handleShow}
            >
              更多資訊
            </button>
          </div>
        </div>
      );
    };
    return (
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        variant="dark"
        showindicators="false"
      >
        {data &&
          data.data.user_save.save_spots
            .reduce((accumulator, currentValue, currentIndex, array) => {
              if (currentIndex % 2 === 0) {
                accumulator.push(array.slice(currentIndex, currentIndex + 2));
              } else if (currentIndex % 2 === 1 && currentIndex + 2 > array.length && currentIndex < array.length - 1) {
                accumulator.push(array.slice(currentIndex, currentIndex + 1));
              }
              return accumulator;
            }, [])
            .map((store, index) => (
              store.length === 2 ? (
                <Carousel.Item key={index}>
                  <Stack direction="horizontal" className=" stack" gap={4} style={{margin:"0 4%"}}>
                    <InfoCard className="card-green card"
                      name={store[0].name}
                      addr={store[0].formatted_address}
                      price={store[0].price_level}
                      rate={store[0].rating}
                      phone={store[0].formatted_phone_number}
                      place_id={store[0].place_id}
                    />
                    <InfoCard
                      className="card-green card"
                      name={store[1].name}
                      addr={store[1].formatted_address}
                      price={store[1].price_level}
                      rate={store[1].rating}
                      phone={store[1].formatted_phone_number}
                      place_id={store[1].place_id}
                    />
  
                  </Stack>
                </Carousel.Item>
              ) : (
                <Carousel.Item>
                  <Stack direction="horizontal" className=" stack" gap={4} style={{margin:"0 4%"}}>
                    <InfoCard className="card-green card"
                      name={store[0].name}
                      addr={store[0].formatted_address}
                      price={store[0].price_level}
                      rate={store[0].rating}
                      phone={store[0].formatted_phone_number}
                      place_id={store[0].place_id}
                    />
                  </Stack>
                </Carousel.Item>
              )))}
      </Carousel>
    );
  }
  // Add Friend

  const AddFriend = async () => {
    let rawResponse;
    let t = getToken();
    try {
      rawResponse = (
        await axios.post(
          "http://127.0.0.1:5000/user/add_friend",
          {
            friend_email: data.data.user_data.email,
          },
          {
            headers: {
              Authorization: "Bearer " + t,
            },
          }
        )
      ).data;
      //   console.log(rawResponse);
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 502) {
        alert(error.response.data.msg);
      }
      if (error.response.status === 401) {
        removeToken();
        alert("Token expired! Please login again!");
        navigate("/");

        return error;
      }
    }
    alert(rawResponse.msg);
    console.log(rawResponse);
    return rawResponse;
  };

  //Delete Friend
  const DelFriend = async () => {
    let rawResponse;
    let t = getToken();
    try {
      rawResponse = (
        await axios.post(
          "http://127.0.0.1:5000/user/delete_friend",
          {
            friend_email: data.data.user_data.email,
          },
          {
            headers: {
              Authorization: "Bearer " + t,
            },
          }
        )
      ).data;
      //   console.log(rawResponse);
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 502) {
        alert(error.response.data.msg);
      }
      if (error.response.status === 401) {
        removeToken();
        alert("Token expired! Please login again!");
        navigate("/");

        return error;
      }
    }
    if (rawResponse) {
      alert(rawResponse.msg);
      console.log(rawResponse);
    }

    return rawResponse;
  }
  const greenOptions = [
    {
      id: "publicissue",
      title: "公共議題分享",
      alt: "公共議題分享",
      img_for_true: require("../../Badge/t_publicissue.png"),
      img_for_false: require("../../Badge/n_publicissue.png"),
      num: !data ? 0 : data.data.user_data.badges.publicissue,
    },
    {
      id: "freetrade",
      title: "公平交易",
      alt: "公平交易",
      img_for_true: require("../../Badge/t_freetrade.png"),
      img_for_false: require("../../Badge/n_freetrade.png"),
      num: !data ? 0 : data.data.user_data.badges.freetrade,
    },
    {
      id: "careforweak",
      title: "關懷弱勢",
      alt: "關懷弱勢",
      img_for_true: require("../../Badge/t_careforweak.png"),
      img_for_false: require("../../Badge/n_careforweak.png"),
      num: !data ? 0 : data.data.user_data.badges.careforweak,
    },
    {
      id: "envfriend",
      title: "友善環境",
      alt: "友善環境",
      img_for_true: require("../../Badge/t_envfriend.png"),
      img_for_false: require("../../Badge/n_envfriend.png"),
      num: !data ? 0 : data.data.user_data.badges.envfriend,
    },
    {
      id: "foodeduc",
      title: "食育教育",
      alt: "食育教育",
      img_for_true: require("../../Badge/t_foodeduc.png"),
      img_for_false: require("../../Badge/n_foodeduc.png"),
      num: !data ? 0 : data.data.user_data.badges.foodeduc,
    },
    {
      id: "localgred",
      title: "在地食材",
      alt: "在地食材",
      img_for_true: require("../../Badge/t_localgred.png"),
      img_for_false: require("../../Badge/n_localgred.png"),
      num: !data ? 0 : data.data.user_data.badges.localgred,
    },
    {
      id: "organic",
      title: "有機小農",
      alt: "有機小農",
      img_for_true: require("../../Badge/t_organic.png"),
      img_for_false: require("../../Badge/n_organic.png"),
      num: !data ? 0 : data.data.user_data.badges.organic,
    },
    {
      id: "ovolacto",
      title: "蛋奶素",
      alt: "蛋奶素",
      img_for_true: require("../../Badge/t_ovolacto.png"),
      img_for_false: require("../../Badge/n_ovolacto.png"),
      num: !data ? 0 : data.data.user_data.badges.ovolacto,
    },
    {
      id: "petfriend",
      title: "寵物友善",
      alt: "寵物友善",
      img_for_true: require("../../Badge/t_petfriend.png"),
      img_for_false: require("../../Badge/n_petfriend.png"),
      num: !data ? 0 : data.data.user_data.badges.petfriend,
    },
    {
      id: "noplastic",
      title: "減塑",
      alt: "減塑",
      img_for_true: require("../../Badge/t_noplastic.png"),
      img_for_false: require("../../Badge/n_noplastic.png"),
      num: !data ? 0 : data.data.user_data.badges.noplastic,
    },
    {
      id: "stray",
      title: "流浪動物",
      alt: "流浪動物",
      img_for_true: require("../../Badge/t_stray.png"),
      img_for_false: require("../../Badge/n_stray.png"),
      num: !data ? 0 : data.data.user_data.badges.stray,
    },
    {
      id: "vegetarianism",
      title: "純素",
      alt: "純素",
      img_for_true: require("../../Badge/t_vegetarianism.png"),
      img_for_false: require("../../Badge/n_vegetarianism.png"),
      num: !data ? 0 : data.data.user_data.badges.vegetarianism,
    },
    {
      id: "foodagricultureeducation",
      title: "食農教育",
      alt: "食農教育",
      img_for_true: require("../../Badge/t_foodagricultureeducation.png"),
      img_for_false: require("../../Badge/n_foodagricultureeducation.png"),
      num: !data ? 0 : data.data.user_data.badges.foodagricultureeducation,
    },
    {
      id: "appreciatefood",
      title: "惜食不浪費",
      alt: "惜食不浪費",
      img_for_true: require("../../Badge/t_appreciatefood.png"),
      img_for_false: require("../../Badge/n_appreciatefood.png"),
      num: !data ? 0 : data.data.user_data.badges.appreciatefood,
    },
    {
      id: "creativecuisine",
      title: "創意料理",
      alt: "創意料理",
      img_for_true: require("../../Badge/t_creativecuisine.png"),
      img_for_false: require("../../Badge/n_creativecuisine.png"),
      num: !data ? 0 : data.data.user_data.badges.creativecuisine,
    },
    {
      id: "creativevegetarian",
      title: "創新蔬食",
      alt: "創新蔬食",
      img_for_true: require("../../Badge/t_creativevegetarian.png"),
      img_for_false: require("../../Badge/n_creativevegetarian.png"),
      num: !data ? 0 : data.data.user_data.badges.creativevegetarian,
    },
    {
      id: "sourcereduction",
      title: "源頭減量",
      alt: "源頭減量",
      img_for_true: require("../../Badge/t_sourcereduction.png"),
      img_for_false: require("../../Badge/n_sourcereduction.png"),
      num: !data ? 0 : data.data.user_data.badges.sourcereduction,
    },
    {
      id: "greenprocurement",
      title: "綠色採購",
      alt: "綠色採購",
      img_for_true: require("../../Badge/t_greenprocurement.png"),
      img_for_false: require("../../Badge/n_greenprocurement.png"),
      num: !data ? 0 : data.data.user_data.badges.greenprocurement,
    },
  ];
  return (
    <div>
      <MDBBtn
        className="green-btn"
        color="secondary"
        rounded
        size="sm"
        onClick={handleShow}
      >
        Visit
      </MDBBtn>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        style={{ padding: "0" }}
      >
        <Modal.Header closeButton />
        <Modal.Body>
          <div className="leaderboard-container">
            <div style={{ justifyContent: "right" }}>
              <button id="addfriendbtn" onClick={AddFriend} name="增加好友">
                <AiOutlineUserAdd size={36} />
              </button>
              <button id="delfriendbtn" onClick={DelFriend} name="刪除好友">
                <AiOutlineUserDelete size={36} />
              </button>
            </div>
            <div className="board-rb">
              <div className="board-rtb">
                <div className="board-rtlb">
                  <div className="line">
                    <div className="pack">
                      <label className="board-label">名字</label>
                      <p>{data.data.user_data.name}</p>
                    </div>
                  </div>
                  <div className="line">
                    <div className="pack">
                      <label className="board-label">朋友</label>
                      <p>{data.data.user_data.friend_number}</p>
                    </div>
                  </div>
                  <p className="biograph" resize="none">
                    {data.data.user_data.biograph}
                  </p>
                </div>

                <div className="board-rtrb">
                  <img
                    id="user-photo"
                    alt="user"
                    src={
                      data.data.user_pic
                        ? data.data.user_pic
                        : require("./user-icon.png")
                    }
                  />
                </div>
              </div>
              <div className="board-rbb">
                <div className="accordion accordion-flush">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingOne">
                      <button
                        className="accordion-button collapsed"
                        id="f-btn1"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseOne"
                        aria-expanded="false"
                        aria-controls="flush-collapseOne"
                      >
                        永續發展徽章收集
                      </button>
                    </h2>
                    <div
                      id="flush-collapseOne"
                      className="accordion-collapse collapse"
                      aria-labelledby="flush-headingOne"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div className="accordion-body">
                        {greenOptions.map((e, index) => (
                          <div className="com" key={index}>
                            <img
                              className={
                                index < 8 ? "badge_left" : "badge_right"
                              }
                              title={e.title}
                              alt={e.alt}
                              src={e.num > 0 ? e.img_for_true : e.img_for_false}
                            />
                            <span className={index < 8 ? "amount1" : "amount2"}>
                              {e.num}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingTwo">
                      <button
                        className="accordion-button collapsed"
                        id="f-btn2"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseTwo"
                        aria-expanded="false"
                        aria-controls="flush-collapseTwo"
                      >
                        到訪店家
                      </button>
                    </h2>
                    <div
                      id="flush-collapseTwo"
                      className="accordion-collapse collapse"
                      aria-labelledby="flush-headingTwo"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div className="accordion-body">
                        <CarouselOfVisitedStore />
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="flush-headingThree">
                      <button
                        className="accordion-button collapsed "
                        id="f-btn3"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseThree"
                        aria-expanded="false"
                        aria-controls="flush-collapseThree"
                      >
                        收藏店家
                      </button>
                    </h2>
                    <div
                      id="flush-collapseThree"
                      className="accordion-collapse collapse"
                      aria-labelledby="flush-headingThree"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div className="accordion-body" id="accordion-body3">
                        <CarouselOfStoredStore />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

function Leaderboard() {

  // Modal of VisitFriendProfile
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState();


  let rawResponse;
  //search by 名字, ex: 墨咖啡
  const fetchLeaderBoard = async () => {
    try {
      setLoading(true);
      rawResponse = (await axios.get("http://127.0.0.1:5000/user/leaderboard"))
        .data;
    } catch (e) {
      console.error(e);
      return {};
    }

    setLeaderboardData(rawResponse.users);
    setLoading(false);

    console.log(rawResponse.users);
    return rawResponse;
  };

  useEffect(() => {
    fetchLeaderBoard();
  }, []);

  const UserRow = ({ id, data }) => {
    return (
      <tr key={id}>
        <td>{id + 1}</td>
        <td>
          <div className="d-flex align-items-center">
            <img
              src={data.user_pic ? data.user_pic : require("./user-icon.png")}
              alt=""
              style={{ width: "45px", height: "45px" }}
              className="rounded-circle"
            />
            <div className="ms-3">
              <p className="fw-bold mb-1">{data.user_data.name}</p>
              <p className="text-muted mb-0">{data.user_data.email}</p>
            </div>
          </div>
        </td>
        <td>
          <Badges data={data.user_data.badges} />
        </td>
        <td>{data.user_data.coin}</td>
        <td>
          <FriendProfile data={data} />
        </td>
        <td />
      </tr>
    )
  }
  return (
    <div className="leaderboard-container">
      <MDBTable align="middle" hover>
        <MDBTableHead >
          <tr>
            <th scope="col">排名</th>
            <th scope="col">玩家</th>
            <th scope="col">徽章</th>
            <th scope="col">徽章數量</th>
            <th scope="col">了解更多</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {loading ?
            <tr>
              <td colSpan={5}>
                <MDBSpinner className='mx-2' color='info'>
                  <span className='visually-hidden'>Loading...</span>
                </MDBSpinner>
              </td>
            </tr>  
            :
            leaderboardData &&
            leaderboardData.map((item, index) => (
              <UserRow key={index} id={index} data={item}></UserRow>
            ))}
        </MDBTableBody>
      </MDBTable>
    </div>
  );
}

export default Leaderboard;
