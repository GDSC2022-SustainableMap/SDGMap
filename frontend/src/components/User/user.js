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
  const [userImage, setUserImage] = useState([]);
  const [username, setUsername] = useState(null);
  const [numoffriend, setNumoffriend] = useState(null);
  const [numofcoin, setNumofcoin] = useState(null);
  const [biograph, setBiograph] = useState(null);
  const [userData, setUserData] = useState({});
  const [editBiograph, setEditBiograph] = useState();
  const [editName, setEditName] = useState();
  const [loading, setLoading] = useState(true);
  //Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      console.log(error.response);
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
    setLoading(false);
    return rawResponse;
  };
  const updateUserProfile = async (e) => {
    try {
      rawResponse = (
        await axios.post(
          "http://127.0.0.1:5000/user/edit_profile",
          {
            biograph: editBiograph,
            name: editName,
            // image: userImage
          },
          {
            headers: {
              Authorization: "Bearer " + props.token,
            },
          }
        )
      ).data;
      //   console.log(rawResponse);
    } catch (error) {
      console.log(error);
    }
    console.log(rawResponse);
    if (rawResponse.name) {
      setUsername(rawResponse.name);
    }
    setBiograph(editBiograph);
    // setUsername(rawResponse.name);
    setShow(false);
    // return rawResponse;
  };
  useEffect(() => {
    fetchUserProfile();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setUserImage(reader.result);
      console.log(reader.result);
    };

    reader.readAsDataURL(file);
  };
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
      num: loading ? 0 : userData.badges.關懷弱勢,
    },
    {
      id: "envfriend",
      title: "友善環境",
      alt: "友善環境",
      img_for_true: require("../../Badge/t_envfriend.png"),
      img_for_false: require("../../Badge/n_envfriend.png"),
      num: loading ? 0 : userData.badges.友善環境,
    },
    {
      id: "foodeduc",
      title: "食育教育",
      alt: "食育教育",
      img_for_true: require("../../Badge/t_foodeduc.png"),
      img_for_false: require("../../Badge/n_foodeduc.png"),
      num: loading ? 0 : userData.badges.食育教育,
    },
    {
      id: "localgred",
      title: "在地食材",
      alt: "在地食材",
      img_for_true: require("../../Badge/t_localgred.png"),
      img_for_false: require("../../Badge/n_localgred.png"),
      num: loading ? 0 : userData.badges.在地食材,
    },
    {
      id: "organic",
      title: "有機小農",
      alt: "有機小農",
      img_for_true: require("../../Badge/t_organic.png"),
      img_for_false: require("../../Badge/n_organic.png"),
      num: loading ? 0 : userData.badges.有機小農,
    },
    {
      id: "ovolacto",
      title: "蛋奶素",
      alt: "蛋奶素",
      img_for_true: require("../../Badge/t_ovolacto.png"),
      img_for_false: require("../../Badge/n_ovolacto.png"),
      num: loading ? 0 : userData.badges.蛋奶素,
    },
    {
      id: "petfriend",
      title: "寵物友善",
      alt: "寵物友善",
      img_for_true: require("../../Badge/t_petfriend.png"),
      img_for_false: require("../../Badge/n_petfriend.png"),
      num: loading ? 0 : userData.badges.寵物友善,
    },
    {
      id: "noplastic",
      title: "減塑",
      alt: "減塑",
      img_for_true: require("../../Badge/t_noplastic.png"),
      img_for_false: require("../../Badge/n_noplastic.png"),
      num: loading ? 0 : userData.badges.減塑,
    },
    {
      id: "stray",
      title: "流浪動物",
      alt: "流浪動物",
      img_for_true: require("../../Badge/t_stray.png"),
      img_for_false: require("../../Badge/n_stray.png"),
      num: loading ? 0 : userData.badges.流浪動物,
    },
    {
      id: "vegetarianism",
      title: "純素",
      alt: "純素",
      img_for_true: require("../../Badge/t_vegetarianism.png"),
      img_for_false: require("../../Badge/n_vegetarianism.png"),
      num: loading ? 0 : userData.badges.純素,
    },
    {
      id: "foodagricultureeducation",
      title: "食農教育",
      alt: "食農教育",
      img_for_true: require("../../Badge/t_foodagricultureeducation.png"),
      img_for_false: require("../../Badge/n_foodagricultureeducation.png"),
      num: loading ? 0 : userData.badges.食農教育,
    },
    {
      id: "appreciatefood",
      title: "惜食不浪費",
      alt: "惜食不浪費",
      img_for_true: require("../../Badge/t_appreciatefood.png"),
      img_for_false: require("../../Badge/n_appreciatefood.png"),
      num: loading ? 0 : userData.badges.惜食不浪費,
    },
    {
      id: "creativecuisine",
      title: "創意料理",
      alt: "創意料理",
      img_for_true: require("../../Badge/t_creativecuisine.png"),
      img_for_false: require("../../Badge/n_creativecuisine.png"),
      num: loading ? 0 : userData.badges.創意料理,
    },
    {
      id: "creativevegetarian",
      title: "創新蔬食",
      alt: "創新蔬食",
      img_for_true: require("../../Badge/t_creativevegetarian.png"),
      img_for_false: require("../../Badge/n_creativevegetarian.png"),
      num: loading ? 0 : userData.badges.創新蔬食,
    },
    {
      id: "sourcereduction",
      title: "源頭減量",
      alt: "源頭減量",
      img_for_true: require("../../Badge/t_sourcereduction.png"),
      img_for_false: require("../../Badge/n_sourcereduction.png"),
      num: loading ? 0 : userData.badges.源頭減量,
    },
    {
      id: "greenprocurement",
      title: "綠色採購",
      alt: "綠色採購",
      img_for_true: require("../../Badge/t_greenprocurement.png"),
      img_for_false: require("../../Badge/n_greenprocurement.png"),
      num: loading ? 0 : userData.badges.綠色採購,
    },
  ];
  const backpackItems = [
    {
      id: "banana",
      title: "香蕉",
      alt: "香蕉",
      img_for_true: require("../../Equipment/banana.png"),
      img_for_false: require("../../Equipment/n_banana.png"),
      num: loading ? 0 : userData.backpack.banana,
    },
    {
      id: "caterpillar",
      title: "毛毛蟲",
      alt: "毛毛蟲",
      img_for_true: require("../../Equipment/caterpillar.png"),
      img_for_false: require("../../Equipment/n_caterpillar.png"),
      num: loading ? 0 : userData.backpack.caterpillar,
    },
    {
      id: "the_egg",
      title: "蛋",
      alt: "蛋",
      img_for_true: require("../../Equipment/the_egg.png"),
      img_for_false: require("../../Equipment/n_the_egg.png"),
      num: loading ? 0 : userData.backpack.the_egg,
    },
    {
      id: "earthworm",
      title: "地球蟲",
      alt: "地球蟲",
      img_for_true: require("../../Equipment/earthworm.png"),
      img_for_false: require("../../Equipment/n_earthworm.png"),
      num: loading ? 0 : userData.backpack.earthworm,
    },
    {
      id: "grape",
      title: "葡萄",
      alt: "葡萄",
      img_for_true: require("../../Equipment/grape.png"),
      img_for_false: require("../../Equipment/n_grape.png"),
      num: loading ? 0 : userData.backpack.grape,
    },
    {
      id: "honey",
      title: "蜂蜜",
      alt: "蜂蜜",
      img_for_true: require("../../Equipment/honey.png"),
      img_for_false: require("../../Equipment/n_honey.png"),
      num: loading ? 0 : userData.backpack.honey,
    },
    {
      id: "ant",
      title: "螞蟻",
      alt: "螞蟻",
      img_for_true: require("../../Equipment/ant.png"),
      img_for_false: require("../../Equipment/n_ant.png"),
      num: loading ? 0 : userData.backpack.ant,
    },
    {
      id: "red_fruit",
      title: "紅水果",
      alt: "紅水果",
      img_for_true: require("../../Equipment/red_fruit.png"),
      img_for_false: require("../../Equipment/n_red_fruit.png"),
      num: loading ? 0 : userData.backpack.red_fruit,
    },
    {
      id: "nuts",
      title: "堅果",
      alt: "堅果",
      img_for_true: require("../../Equipment/nuts.png"),
      img_for_false: require("../../Equipment/n_nuts.png"),
      num: loading ? 0 : userData.backpack.nuts,
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
                  {userData.change_name_chance >= 1 ? (
                    <input
                      className="value"
                      type="text"
                      placeholder="Username"
                      onChange={(e) => setEditName(e.target.value)}
                    ></input>
                  ) : (
                    <input
                      className="value"
                      type="text"
                      placeholder="You can only changed your name once!"
                      disabled="true"
                      readOnly="true"
                      style={{ backgroundColor: "#efeeee" }}
                    ></input>
                  )}
                </div>
                <div className="user-form-group">
                  <label className="user-form-label">Photo</label>
                  <input
                    className="value"
                    type="file"
                    onChange={handleImageChange}
                  ></input>
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
                <button
                  id="closebtn"
                  variant="secondary"
                  onClick={updateUserProfile}
                >
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
            {userImage.length >= 1 ? (
              <img id="user-photo" alt="user" src={userImage} />
            ) : (
              <img
                id="user-photo"
                alt="user"
                src={require("./user-icon.png")}
              />
            )}

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
                  {loading ? (
                    <></>
                  ) : (
                    greenOptions.map((e, index) => (
                      <div className="com">
                        <img
                          className={index < 8 ? "badge_left" : "badge_right"}
                          title={e.title}
                          alt={e.alt}
                          src={e.num > 0 ? e.img_for_true : e.img_for_false}
                        />
                        <span className={index < 8 ? "amount1" : "amount2"}>
                          {e.num}
                        </span>
                      </div>
                    ))
                  )}
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
                  {loading ? (
                    <></>
                  ) : (
                    backpackItems.map((e, index) => (
                      <div className="com">
                        <img
                          className="equip"
                          title={e.title}
                          alt={e.alt}
                          src={e.num > 0 ? e.img_for_true : e.img_for_false}
                        />
                        <span className="amount1">{parseInt(e.num)}</span>
                      </div>
                    ))
                  )}
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
