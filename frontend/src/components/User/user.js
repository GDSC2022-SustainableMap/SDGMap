import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { IoMdAddCircle } from "react-icons/io";
import { Modal, Carousel, Card, Stack } from "react-bootstrap";
import { BsFillPinMapFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "./user.css";
import axios from "axios";
function User(props) {
  const navigate = useNavigate();
  let [selectImage, setSelectImage] = useState(null);
  let [username, setUsername] = useState(null);
  let [numoffriend, setNumoffriend] = useState(null);
  let [numofcoin, setNumofcoin] = useState(null);
  let [biograph, setBiograph] = useState(null);
    const [userData, setUserData] = useState({});
  const [editBiograph, setEditBiograph] = useState();
const [editName,setEditName] = useState();
  //Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Badge Collection
  const [badge1, setBadge1] = useState(0);
  const [badge2, setBadge2] = useState(0);
  const [badge3, setBadge3] = useState(0);
  const [badge4, setBadge4] = useState(0);
  const [badge5, setBadge5] = useState(0);
  const [badge6, setBadge6] = useState(0);
  const [badge7, setBadge7] = useState(0);
  const [badge8, setBadge8] = useState(0);
  const [badge9, setBadge9] = useState(0);
  const [badge10, setBadge10] = useState(0);
  const [badge11, setBadge11] = useState(0);
  const [badge12, setBadge12] = useState(0);

  // equipment collection
  const [equip1, setEquip1] = useState(0);
  const [equip2, setEquip2] = useState(0);
  const [equip3, setEquip3] = useState(0);
  const [equip4, setEquip4] = useState(0);
  const [equip5, setEquip5] = useState(0);
  const [equip6, setEquip6] = useState(0);
  const [equip7, setEquip7] = useState(0);
  const [equip8, setEquip8] = useState(0);
  const [equip9, setEquip9] = useState(0);

  let rawResponse;
  const fetchUserProfile = async (e) => {
    try {
      rawResponse = (
        await axios.get("http://127.0.0.1:5000/user/profile", {
          headers: {
            Authorization: "Bearer " + props.token,
          },
        })
      ).data;
      //   console.log(rawResponse);
    } catch (error) {
      console.log(error.response)
      if (error.response.status === 401) {
          props.removeToken();
          alert("Token expired! Please login again!");
          navigate("/");
      
          return error;
       }
    }
    setUserData(rawResponse);
    setUsername(rawResponse.name);
    setNumoffriend(rawResponse.friends.friend_number);
    setNumofcoin(rawResponse.coin);
    setBiograph(rawResponse.biograph);
    console.log(rawResponse);
    return rawResponse;
  };
  const updateUserProfile = async (e) => {
    try {
      rawResponse = (
        await axios.post("http://127.0.0.1:5000/user/edit_profile", 
        {
            biograph:editBiograph,
            name:editName
        },{
          headers: {
            Authorization: "Bearer " + props.token,
          }
        })
      ).data;
      //   console.log(rawResponse);
    } catch (error) {
      console.log(error);
    }
    console.log(rawResponse);
    if(rawResponse.name){
        setUsername(rawResponse.name);
    }
    setBiograph(editBiograph);
    // setUsername(rawResponse.name);
    setShow(false);
    return rawResponse;
  };
  useEffect(() => {
    fetchUserProfile();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Carousel
  function CarouselOfVisitedStore() {
    const [index, setIndex] = useState(0);
    const [current, setCurrent] = useState(0);
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };
    const VisitedStoreList = [
      { _id: 1, name: "xxx" },
      { _id: 1, name: "abc" },
      { _id: 2, name: "def" },
      { _id: 3, name: "ghi" },
      { _id: 4, name: "jkl" },
      { _id: 5, name: "mno" },
      { _id: 6, name: "pqr" },
      { _id: 7, name: "stu" },
      { _id: 8, name: "vwx" },
      { _id: 9, name: "yza" },
    ];

    const InfoCard = ({ name, addr, price, rate }) => {
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
            電話: 沒有這個資訊
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
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{name}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                地址: {addr}
                <br />
                評分: {rate}&emsp; 電話: 沒有這個資訊
                <br />
                價格: {p}
              </Modal.Body>
              <Modal.Footer>
                <button variant="secondary">Check In</button>
                <button variant="secondary" onClick={handleClose}>
                  OK
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      );
    };
    return (
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        variant="dark"
        showIndicators={false}
      >
        {VisitedStoreList.reduce(
          (accumulator, currentValue, currentIndex, array) => {
            if (currentIndex % 2 === 0) {
              accumulator.push(array.slice(currentIndex, currentIndex + 2));
            }
            return accumulator;
          },
          []
        ).map((store) => (
          <Carousel.Item>
            <Stack direction="horizontal" className=" stack" gap={3}>
              {/* <div className='card'>
                                <div className='card-body'>
                                    <h5 className='card-title'>{store._id}</h5>
                                    <hr className='carousel-hline'/>
                                    <div className='card-text'>
                                        {store.text}!
                                    </div>
                                    <button variant="primary">Go somewhere</button>
                                </div>
                            </div> */}
              <InfoCard
                className="card-orange card"
                name={store[0].name}
                addr={store[0].formatted_address}
                price={store[0].price_level}
                rate={store[0].rating}
              />
              <InfoCard
                className="card-orange card"
                name={store[1].name}
                addr={store[1].formatted_address}
                price={store[1].price_level}
                rate={store[1].rating}
              />
            </Stack>
          </Carousel.Item>
        ))}
      </Carousel>
    );
  }

  function CarouselOfStoredStore() {
    const [index, setIndex] = useState(0);
    const [current, setCurrent] = useState(0);
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };
    const VisitedStoreList = [
      { _id: 1, name: "xxx" },
      { _id: 1, name: "abc" },
      { _id: 2, name: "def" },
      { _id: 3, name: "ghi" },
      { _id: 4, name: "jkl" },
      { _id: 5, name: "mno" },
      { _id: 6, name: "pqr" },
      { _id: 7, name: "stu" },
      { _id: 8, name: "vwx" },
      { _id: 9, name: "yza" },
    ];

    const InfoCard = ({ name, addr, price, rate }) => {
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
            電話: 沒有這個資訊
            <br />
            價格: {p}
            <br />
            <button
              className="card-button-green"
              variant="primary"
              onClick={handleShow}
            >
              More info
            </button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{name}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                地址: {addr}
                <br />
                評分: {rate}&emsp; 電話: 沒有這個資訊
                <br />
                價格: {p}
              </Modal.Body>
              <Modal.Footer>
                <button variant="secondary">Check In</button>
                <button variant="secondary" onClick={handleClose}>
                  OK
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      );
    };
    return (
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        variant="dark"
        showIndicators={false}
      >
        {VisitedStoreList.reduce(
          (accumulator, currentValue, currentIndex, array) => {
            if (currentIndex % 2 === 0) {
              accumulator.push(array.slice(currentIndex, currentIndex + 2));
            }
            return accumulator;
          },
          []
        ).map((store) => (
          <Carousel.Item>
            <Stack direction="horizontal" className=" stack" gap={3}>
              {/* <div className='card'>
                                <div className='card-body'>
                                    <h5 className='card-title'>{store._id}</h5>
                                    <hr className='carousel-hline'/>
                                    <div className='card-text'>
                                        {store.text}!
                                    </div>
                                    <button variant="primary">Go somewhere</button>
                                </div>
                            </div> */}
              <InfoCard
                className="card-green card"
                name={store[0].name}
                addr={store[0].formatted_address}
                price={store[0].price_level}
                rate={store[0].rating}
              />
              <InfoCard
                className="card-green card"
                name={store[1].name}
                addr={store[1].formatted_address}
                price={store[1].price_level}
                rate={store[1].rating}
              />
            </Stack>
          </Carousel.Item>
        ))}
      </Carousel>
    );
  }


  const greenOptions = [
    {
      id: "careforweak",
      title: "關懷弱勢",
      alt: "關懷弱勢",
      img_for_true: require("../../Badge/t_careforweak.png"),
      img_for_false: require("../../Badge/n_careforweak.png"),
    },
    {
      id: "envfriend",
      title: "友善環境",
      alt: "友善環境",
      img_for_true: require("../../Badge/t_envfriend.png"),
      img_for_false: require("../../Badge/n_envfriend.png"),
    },
    {
      id: "foodeduc",
      title: "食育教育",
      alt: "食育教育",
      img_for_true: require("../../Badge/t_foodeduc.png"),
      img_for_false: require("../../Badge/n_foodeduc.png"),
    },
    {
      id: "localgred",
      title: "在地食材",
      alt: "在地食材",
      img_for_true: require("../../Badge/t_localgred.png"),
      img_for_false: require("../../Badge/n_localgred.png"),
    },
    {
      id: "organic",
      title: "有機小農",
      alt: "有機小農",
      img_for_true: require("../../Badge/t_organic.png"),
      img_for_false: require("../../Badge/n_organic.png"),
    },
    {
      id: "ovolacto",
      title: "蛋奶素",
      alt: "蛋奶素",
      img_for_true: require("../../Badge/t_ovolacto.png"),
      img_for_false: require("../../Badge/n_ovolacto.png"),
    },
    {
      id: "petfriend",
      title: "寵物友善",
      alt: "寵物友善",
      img_for_true: require("../../Badge/t_petfriend.png"),
      img_for_false: require("../../Badge/n_petfriend.png"),
    },
    {
      id: "noplastic",
      title: "減塑",
      alt: "減塑",
      img_for_true: require("../../Badge/t_noplastic.png"),
      img_for_false: require("../../Badge/n_noplastic.png"),
    },
    {
      id: "stray",
      title: "流浪動物",
      alt: "流浪動物",
      img_for_true: require("../../Badge/t_stray.png"),
      img_for_false: require("../../Badge/n_stray.png"),
    },
    {
      id: "vegetarianism",
      title: "純素",
      alt: "純素",
      img_for_true: require("../../Badge/t_vegetarianism.png"),
      img_for_false: require("../../Badge/n_vegetarianism.png"),
    },
    {
      id: "foodagricultureeducation",
      title: "食農教育",
      alt: "食農教育",
      img_for_true: require("../../Badge/t_foodagricultureeducation.png"),
      img_for_false: require("../../Badge/n_foodagricultureeducation.png"),
    },
    {
      id: "appreciatefood",
      title: "惜食不浪費",
      alt: "惜食不浪費",
      img_for_true: require("../../Badge/t_appreciatefood.png"),
      img_for_false: require("../../Badge/n_appreciatefood.png"),
    },
    {
      id: "creativecuisine",
      title: "創意料理",
      alt: "創意料理",
      img_for_true: require("../../Badge/t_creativecuisine.png"),
      img_for_false: require("../../Badge/n_creativecuisine.png"),
    },
    {
      id: "creativevegetarian",
      title: "創新蔬食",
      alt: "創新蔬食",
      img_for_true: require("../../Badge/t_creativevegetarian.png"),
      img_for_false: require("../../Badge/n_creativevegetarian.png"),
    },
    {
      id: "sourcereduction",
      title: "源頭減量",
      alt: "源頭減量",
      img_for_true: require("../../Badge/t_sourcereduction.png"),
      img_for_false: require("../../Badge/n_sourcereduction.png"),
    },
    {
      id: "greenprocurement",
      title: "綠色採購",
      alt: "綠色採購",
      img_for_true: require("../../Badge/t_greenprocurement.png"),
      img_for_false: require("../../Badge/n_greenprocurement.png"),
    },
  ];

  return (
    <div className="user-container">
      <div className="user-lb">
        <h1>3Dcharacter</h1>
      </div>
      <div className="user-rb">
        <div className="user-rtb">
          <div className="user-rtlb">
            <div className="line">
              <div className="pack">
                <label className="user-label">Name</label>
                <p>{username}</p>
              </div>
            </div>
            <div className="line">
              <div className="pack">
                <label className="user-label">Friends</label>
                <p>{numoffriend}</p>
              </div>
              <div className="pack">
                <label className="user-label">Coins</label>
                <p className="num">{numofcoin}</p>
              </div>
            </div>
            <p className="biograph" resize="none">
              {biograph}
            </p>
          </div>

          <div className="user-rtrb">
            <button id="editbtn" variant="primary" onClick={handleShow}>
              <FiEdit size={20} />
            </button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Your Profile</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* <form className='user-form'> */}
                <div className="user-form-group">
                  <label className="user-form-label">Name</label>
                  { userData.change_name_chance >=1?<input
                    className="value"
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setEditName(e.target.value)}
                  ></input>:<input
                  className="value"
                  type="text"
                  placeholder="You can only changed your name once!"
                  disabled="true" readOnly="true"
                  style={{backgroundColor:"#efeeee"}}
                ></input>

                  }
                </div>
                <div className="user-form-group">
                  <label className="user-form-label">Photo</label>
                  <input className="value" type="file"></input>
                </div>
                {/* <div className='user-form-group'>
                                        <label className='user-form-label'>Email Address</label>
                                        <input className='value' type='email' placeholder='email address'></input>
                                    </div> */}
                {/* <div className='user-form-group'>
                                        <label className='user-form-label'>Password</label>
                                        <input className='value' type='text' placeholder='password'></input>
                                    </div> */}
                <div className="user-form-group">
                  <label className="user-form-label">Biograph</label>
                  <input
                    className="value"
                    type="text"
                    placeholder="Biograph"
                    onChange={(e) => setEditBiograph(e.target.value)}
                  ></input>
                </div>
                {/* </form> */}
              </Modal.Body>
              <Modal.Footer>
                <button id="closebtn" variant="secondary" onClick={updateUserProfile}>
                  Finish Edition
                </button>
              </Modal.Footer>
            </Modal>
            {/* {selectImage && (
                            <div>
                                <img width={'150px'} src={URL.createObjectURL(selectImage)} />
                                <button onClick={() => setSelectImage(null)}>Remove</button>
                            </div>
                        )} */}
            <img id="user-photo" src={require("./user-icon.png")} />
            {/* <label id='imagebtn'><IoMdAddCircle size='30' />
                            <input type='file' display='none' id='imgouterbtn'
                                onChange={(event) => {
                                    // console.log(event.target.files[0]);
                                    setSelectImage(event.target.files[0]);
                                }}
                            />
                        </label> */}
          </div>
        </div>
        <div className="user-rbb">
          <div className="accordion accordion-flush">
            <div className="accordion-item">
              <h2 className="accordion-header" id="flush-headingOne">
                <button
                  className="accordion-button collapsed"
                  id="btn1"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseOne"
                  aria-expanded="false"
                  aria-controls="flush-collapseOne"
                >
                  SDG Badge Collection
                </button>
              </h2>
              <div
                id="flush-collapseOne"
                className="accordion-collapse collapse"
                aria-labelledby="flush-headingOne"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="com">
                    <img
                      className="badge_left"
                      title="關懷弱勢"
                      alt="關懷弱勢"
                      onClick={() => setBadge1((prevValue) => prevValue + 1)}
                      src={
                        badge1 > 0
                          ? require("../../Badge/t_careforweak.png")
                          : require("../../Badge/n_careforweak.png")
                      }
                    />
                    <span className="amount1">{badge1}</span>
                  </div>
                  <div className="com">
                    <img
                      className="badge_left"
                      title="友善環境"
                      alt="友善環境"
                      onClick={() => setBadge2((prevValue) => prevValue + 1)}
                      src={
                        badge2 > 0
                          ? require("../../Badge/t_envfriend.png")
                          : require("../../Badge/n_envfriend.png")
                      }
                    />
                    <span className="amount1">{badge2}</span>
                  </div>
                  <div className="com">
                    <img
                      className="badge_left"
                      title="食育教育"
                      alt="食育教育"
                      onClick={() => setBadge3((prevValue) => prevValue + 1)}
                      src={
                        badge3 > 0
                          ? require("../../Badge/t_foodeduc.png")
                          : require("../../Badge/n_foodeduc.png")
                      }
                    />
                    <span className="amount1">{badge3}</span>
                  </div>
                  <div className="com">
                    <img
                      className="badge_left"
                      title="公平交易"
                      alt="公平交易"
                      onClick={() => setBadge4((prevValue) => prevValue + 1)}
                      src={
                        badge4 > 0
                          ? require("../../Badge/t_freetrade.png")
                          : require("../../Badge/n_freetrade.png")
                      }
                    />
                    <span className="amount1">{badge4}</span>
                  </div>
                  <div className="com">
                    <img
                      className="badge_left"
                      title="在地食材"
                      alt="在地食材"
                      onClick={() => setBadge5((prevValue) => prevValue + 1)}
                      src={
                        badge5 > 0
                          ? require("../../Badge/t_localgred.png")
                          : require("../../Badge/n_localgred.png")
                      }
                    />
                    <span className="amount1">{badge5}</span>
                  </div>
                  <div className="com">
                    <img
                      className="badge_left"
                      title="有機小農"
                      alt="有機小農"
                      onClick={() => setBadge6((prevValue) => prevValue + 1)}
                      src={
                        badge6 > 0
                          ? require("../../Badge/t_organic.png")
                          : require("../../Badge/n_organic.png")
                      }
                    />
                    <span className="amount1">{badge6}</span>
                  </div>
                  <div className="com">
                    <img
                      className="badge_right"
                      title="蛋奶素"
                      alt="蛋奶素"
                      onClick={() => setBadge7((prevValue) => prevValue + 1)}
                      src={
                        badge7 > 0
                          ? require("../../Badge/t_ovolacto.png")
                          : require("../../Badge/n_ovolacto.png")
                      }
                    />
                    <span className="amount2">{badge7}</span>
                  </div>
                  <div className="com">
                    <img
                      className="badge_right"
                      title="寵物友善"
                      alt="寵物友善"
                      onClick={() => setBadge8((prevValue) => prevValue + 1)}
                      src={
                        badge8 > 0
                          ? require("../../Badge/t_petfriend.png")
                          : require("../../Badge/n_petfriend.png")
                      }
                    />
                    <span className="amount2">{badge8}</span>
                  </div>
                  <div className="com">
                    <img
                      className="badge_right"
                      title="減塑"
                      alt="減塑"
                      onClick={() => setBadge9((prevValue) => prevValue + 1)}
                      src={
                        badge9 > 0
                          ? require("../../Badge/t_noplastic.png")
                          : require("../../Badge/n_noplastic.png")
                      }
                    />
                    <span className="amount2">{badge9}</span>
                  </div>
                  <div className="com">
                    <img
                      className="badge_right"
                      title="公共議題分享"
                      alt="公共議題分享"
                      onClick={() => setBadge10((prevValue) => prevValue + 1)}
                      src={
                        badge10 > 0
                          ? require("../../Badge/t_publicissue.png")
                          : require("../../Badge/n_publicissue.png")
                      }
                    />
                    <span className="amount2">{badge10}</span>
                  </div>
                  <div className="com">
                    <img
                      className="badge_right"
                      title="流浪動物"
                      alt="流浪動物"
                      onClick={() => setBadge11((prevValue) => prevValue + 1)}
                      src={
                        badge11 > 0
                          ? require("../../Badge/t_stray.png")
                          : require("../../Badge/n_stray.png")
                      }
                    />
                    <span className="amount2">{badge11}</span>
                  </div>
                  <div className="com">
                    <img
                      className="badge_right"
                      title="純素"
                      alt="純素"
                      onClick={() => setBadge12((prevValue) => prevValue + 1)}
                      src={
                        badge12 > 0
                          ? require("../../Badge/t_vegetarianism.png")
                          : require("../../Badge/n_vegetarianism.png")
                      }
                    />
                    <span className="amount2">{badge12}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="flush-headingTwo">
                <button
                  className="accordion-button collapsed"
                  id="btn2"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseTwo"
                  aria-expanded="false"
                  aria-controls="flush-collapseTwo"
                >
                  Backpack
                </button>
              </h2>
              <div
                id="flush-collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="flush-headingTwo"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="com">
                    <img
                      className="equip"
                      onClick={() => setEquip1((prevValue) => prevValue + 1)}
                      src={
                        equip1 > 0
                          ? require("../../Equipment/banana.png")
                          : require("../../Equipment/n_banana.png")
                      }
                    />
                    <span className="amount1">{equip1}</span>
                  </div>
                  <div className="com">
                    <img
                      className="equip"
                      onClick={() => setEquip2((prevValue) => prevValue + 1)}
                      src={
                        equip2 > 0
                          ? require("../../Equipment/caterpillar.png")
                          : require("../../Equipment/n_caterpillar.png")
                      }
                    />
                    <span className="amount1">{equip2}</span>
                  </div>
                  <div className="com">
                    <img
                      className="equip"
                      onClick={() => setEquip3((prevValue) => prevValue + 1)}
                      src={
                        equip3 > 0
                          ? require("../../Equipment/the_egg.png")
                          : require("../../Equipment/n_the_egg.png")
                      }
                    />
                    <span className="amount1">{equip3}</span>
                  </div>
                  <div className="com">
                    <img
                      className="equip"
                      onClick={() => setEquip4((prevValue) => prevValue + 1)}
                      src={
                        equip4 > 0
                          ? require("../../Equipment/earthworm.png")
                          : require("../../Equipment/n_earthworm.png")
                      }
                    />
                    <span className="amount1">{equip4}</span>
                  </div>
                  <div className="com">
                    <img
                      className="equip"
                      onClick={() => setEquip5((prevValue) => prevValue + 1)}
                      src={
                        equip5 > 0
                          ? require("../../Equipment/honey.png")
                          : require("../../Equipment/n_honey.png")
                      }
                    />
                    <span className="amount1">{equip5}</span>
                  </div>
                  <div className="com">
                    <img
                      className="equip"
                      onClick={() => setEquip6((prevValue) => prevValue + 1)}
                      src={
                        equip6 > 0
                          ? require("../../Equipment/grape.png")
                          : require("../../Equipment/n_grape.png")
                      }
                    />
                    <span className="amount1">{equip6}</span>
                  </div>
                  <div className="com">
                    <img
                      className="equip"
                      onClick={() => setEquip7((prevValue) => prevValue + 1)}
                      src={
                        equip7 > 0
                          ? require("../../Equipment/nuts.png")
                          : require("../../Equipment/n_nuts.png")
                      }
                    />
                    <span className="amount1">{equip7}</span>
                  </div>
                  <div className="com">
                    <img
                      className="equip"
                      onClick={() => setEquip8((prevValue) => prevValue + 1)}
                      src={
                        equip8 > 0
                          ? require("../../Equipment/ant.png")
                          : require("../../Equipment/n_ant.png")
                      }
                    />
                    <span className="amount1">{equip8}</span>
                  </div>
                  <div className="com">
                    <img
                      className="equip"
                      onClick={() => setEquip9((prevValue) => prevValue + 1)}
                      src={
                        equip9 > 0
                          ? require("../../Equipment/red_fruit.png")
                          : require("../../Equipment/n_red_fruit.png")
                      }
                    />
                    <span className="amount1">{equip9}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="flush-headingThree">
                <button
                  className="accordion-button collapsed "
                  id="btn3"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseThree"
                  aria-expanded="false"
                  aria-controls="flush-collapseThree"
                >
                  Visited Store Collection
                </button>
              </h2>
              <div
                id="flush-collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="flush-headingThree"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body" id="accordion-body3">
                  <CarouselOfVisitedStore />
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="flush-headingFour">
                <button
                  className="accordion-button collapsed"
                  id="btn4"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseFour"
                  aria-expanded="false"
                  aria-controls="flush-collapseFour"
                >
                  Stored Store Collection
                </button>
              </h2>
              <div
                id="flush-collapseFour"
                className="accordion-collapse collapse"
                aria-labelledby="flush-headingFour"
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
  );
}

export default User;
