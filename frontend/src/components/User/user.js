import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { BsFillPinMapFill } from "react-icons/bs";
import { IoMdAddCircle } from "react-icons/io";
import { Modal, Carousel, Card, Stack } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./user.css";
import { MDBSpinner } from "mdb-react-ui-kit";
import axios from "axios";
import useToken from "../../hooks/token";

let BACKEND_URL;
if (process.env.REACT_APP_ENV === "development") {
  BACKEND_URL = "http://localhost:5000";
} else {
  BACKEND_URL = "https://q--xwnb.de.r.appspot.com";
}

function User(props) {
  const navigate = useNavigate();
  const { getToken, removeToken } = useToken();
  const [userImage, setUserImage] = useState([]);
  const [username, setUsername] = useState(null);
  const [numoffriend, setNumoffriend] = useState(null);
  const [numofcoin, setNumofcoin] = useState(null);
  const [biograph, setBiograph] = useState(null);
  const [userData, setUserData] = useState({});
  const [editBiograph, setEditBiograph] = useState("");
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userSave, setUserSave] = useState([]);
  const [userLog, setUserLog] = useState([]);
  const [userPosition, setUserPosition] = useState([]);
  //Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setEditImage(userImage);
  };

  let rawResponse;
  const fetchUserProfile = async (e) => {
    try {
      setLoading(true);
      rawResponse = (
        await axios.get(BACKEND_URL+"/user/profile", {
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
    setNumoffriend(rawResponse.friend_number);
    setNumofcoin(rawResponse.coin);
    setBiograph(rawResponse.biograph);
    console.log(rawResponse);

    let imgRawResponse;
    try {
      imgRawResponse = (
        await axios.get(BACKEND_URL+"/user/get_image", {
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
    setUserImage(imgRawResponse);
    setEditImage(imgRawResponse);
    // console.log(imgRawResponse);
    setLoading(false);
    return rawResponse;
  };
  let saveResponse;
  const fetchUserSave = async () => {
    let t = getToken();
    try {
      setLoading(true);
      saveResponse = (
        await axios.get(BACKEND_URL+"/user/track_usersave", {
          headers: {
            Authorization: "Bearer " + t,
          },
        })
      ).data;
      //   console.log(rawResponse);
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 401) {
        removeToken();
        alert("Token expired! Please login again!");
        navigate("/");

        return error;
      }
    }
    console.log(saveResponse);
    setUserSave(Object.values(saveResponse.save_spots));

    setLoading(false);
  };

  let logResponse;
  const fetchUserLog = async () => {
    let t = getToken();
    try {
      setLoading(true);
      logResponse = (
        await axios.get(BACKEND_URL+"/user/track_userlog", {
          headers: {
            Authorization: "Bearer " + t,
          },
        })
      ).data;
      //   console.log(rawResponse);
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 401) {
        removeToken();
        alert("Token expired! Please login again!");
        navigate("/");

        return error;
      }
    }
    setUserLog(Object.values(logResponse)[0]);

    setLoading(false);
  };

  const updateUserProfile = async (e) => {
    setLoading(true);
    if (editName.length > 0 || editBiograph.length > 0) {
      try {
        rawResponse = (
          await axios.post(
            BACKEND_URL+"/user/edit_profile",
            {
              biograph: editBiograph,
              name: editName,
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

      if (
        rawResponse.msg_name &&
        rawResponse.msg_name === "Name changed sucessfully!"
      ) {
        setUsername(editName);
      }
      if (
        rawResponse.msg_biograph &&
        rawResponse.msg_biograph === "Biograph changed sucessfully!"
      ) {
        setBiograph(editBiograph);
      }
    }
    setEditName("");
    setEditBiograph("");
    // console.log(userImage.substring(userImage.indexOf(",")+1,userImage.length))
    let imgRawResponse;
    if (editImage !== userImage) {
      try {
        imgRawResponse = (
          await axios.post(
            BACKEND_URL+"/user/upload_image",
            {
              base64_image: editImage.substring(
                editImage.indexOf(",") + 1,
                editImage.length
              ),
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
      setUserImage(imgRawResponse.data);
      // setEditImage(imgRawResponse.data);
    }

    setShow(false);
    setLoading(false);
    // return rawResponse;
  };

  const showLocation = (position) => {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    // alert(
    //   "Latitude: " +
    //     position.coords.latitude +
    //     "\nLongitude: " +
    //     position.coords.longitude
    // );
    setUserPosition([latitude, longitude]);
  };
  const errorHandler = (err) => {
    if (err.code === 1) {
      alert("Error: Access is denied!");
    } else if (err.code === 2) {
      alert("Error: Position is unavailable!");
    }
  };

  useEffect(() => {
    async function fetchAllData() {
      await fetchUserProfile();
      await fetchUserSave();
      await fetchUserLog();
    }
    // fetchUserProfile();
    // fetchUserSave();
    fetchAllData();
    if (navigator.geolocation) {
      var options = { timeout: 60000 };
      navigator.geolocation.getCurrentPosition(
        showLocation,
        errorHandler,
        options
      );
    } else {
      alert("Geolocation not supported by this browser.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setEditImage(reader.result);
      // console.log(reader.result);
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

    const InfoCard = ({ name, addr, price, rate, phone, place_id }) => {
      let p = "";
      for (let i = 0; i < price; i++) {
        p = p + "$";
      }
      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
      const handleCheckin = async () => {
        try {
          setLoading(true);
          const t = getToken();
          rawResponse = (
            await axios.post(
              BACKEND_URL+"/map/check_in",
              {
                place_id: place_id,
                user_lat: userPosition[0],
                user_lng: userPosition[1],
                scope: 1000,
              },
              {
                headers: {
                  Authorization: "Bearer " + t,
                },
              }
            )
          ).data;
        } catch (error) {
          console.log(error.response);
          if (error.response.status === 401) {
            removeToken();
            alert("Token expired or you have not logined! Please login again!");
            navigate("/signin");

            return error;
          }
        }
        if (rawResponse.msg === "You should come to this place to check in!") {
          alert("You should come to this place to check in!");
        } else if (rawResponse.msg === "You have checked in successfully!") {
          alert("You have checked in successfully!");
        }

        setLoading(false);
        return rawResponse;
      };
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
              更多資訊
            </button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{name}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                地址: {addr}
                <br />
                評分: {rate}&emsp; 電話: {phone}
                <br />
                價格: {p}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCheckin}>
                  {loading ? <MDBSpinner size="sm" /> : <BsFillPinMapFill />}
                  打卡
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  關閉頁面
                </Button>
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
        {!loading &&
          userLog &&
          userLog
            .reduce((accumulator, currentValue, currentIndex, array) => {
              if (currentIndex % 2 === 0) {
                accumulator.push(array.slice(currentIndex, currentIndex + 2));
              } else if (
                currentIndex % 2 === 1 &&
                currentIndex + 2 > array.length &&
                currentIndex < array.length - 1
              ) {
                accumulator.push(array.slice(currentIndex, currentIndex + 1));
              }
              return accumulator;
            }, [])
            .map((store, index) =>
              store.length === 2 ? (
                <Carousel.Item key={index}>
                  <Stack direction="horizontal" className=" stack" gap={4}>
                    <InfoCard
                      className="card-orange card"
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
                  <Stack direction="horizontal" className=" stack" gap={4}>
                    <InfoCard
                      className="card-orange card"
                      name={store[0].name}
                      addr={store[0].formatted_address}
                      price={store[0].price_level}
                      rate={store[0].rating}
                      phone={store[0].formatted_phone_number}
                      place_id={store[0].place_id}
                    />
                  </Stack>
                </Carousel.Item>
              )
            )}
      </Carousel>
    );
  }

  function CarouselOfStoredStore() {
    const [index, setIndex] = useState(0);
    // const [current, setCurrent] = useState(0);
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };

    const InfoCard = ({ name, addr, price, rate, place_id, phone }) => {
      let p = "";
      for (let i = 0; i < price; i++) {
        p = p + "$";
      }
      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
      const handleCheckin = async () => {
        try {
          setLoading(true);
          const t = getToken();
          rawResponse = (
            await axios.post(
              BACKEND_URL+"/map/check_in",
              {
                place_id: place_id,
                user_lat: userPosition[0],
                user_lng: userPosition[1],
                scope: 1000,
              },
              {
                headers: {
                  Authorization: "Bearer " + t,
                },
              }
            )
          ).data;
        } catch (error) {
          console.log(error.response);
          if (error.response.status === 401) {
            removeToken();
            alert("Token expired or you have not logined! Please login again!");
            navigate("/signin");

            return error;
          }
        }
        if (rawResponse.msg === "You should come to this place to check in!") {
          alert("You should come to this place to check in!");
        } else if (rawResponse.msg === "You have checked in successfully!") {
          alert("You have checked in successfully!");
        }
        console.log(rawResponse);
        setLoading(false);
        return rawResponse;
      };

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
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{name}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                地址: {addr}
                <br />
                評分: {rate}&emsp; 電話: {phone}
                <br />
                價格: {p}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCheckin}>
                  {loading ? <MDBSpinner size="sm" /> : <BsFillPinMapFill />}
                  打卡
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  關閉頁面
                </Button>
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
        {!loading &&
          userSave &&
          userSave
            .reduce((accumulator, currentValue, currentIndex, array) => {
              if (currentIndex % 2 === 0) {
                accumulator.push(array.slice(currentIndex, currentIndex + 2));
              } else if (
                currentIndex % 2 === 1 &&
                currentIndex + 2 > array.length &&
                currentIndex < array.length - 1
              ) {
                accumulator.push(array.slice(currentIndex, currentIndex + 1));
              }
              return accumulator;
            }, [])
            .map((store, index) =>
              store.length === 2 ? (
                <Carousel.Item key={index}>
                  <Stack direction="horizontal" className=" stack" gap={4}>
                    <InfoCard
                      className="card-green card"
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
                  <Stack direction="horizontal" className=" stack" gap={4}>
                    <InfoCard
                      className="card-green card"
                      name={store[0].name}
                      addr={store[0].formatted_address}
                      price={store[0].price_level}
                      rate={store[0].rating}
                      phone={store[0].formatted_phone_number}
                      place_id={store[0].place_id}
                    />
                  </Stack>
                </Carousel.Item>
              )
            )}
      </Carousel>
    );
  }

  const greenOptions = [
    {
      id: "publicissue",
      title: "公共議題分享",
      alt: "公共議題分享",
      img_for_true: require("../../Badge/t_publicissue.png"),
      img_for_false: require("../../Badge/n_publicissue.png"),
      num: loading && userData ? 0 : userData.badges.publicissue,
    },
    {
      id: "freetrade",
      title: "公平交易",
      alt: "公平交易",
      img_for_true: require("../../Badge/t_freetrade.png"),
      img_for_false: require("../../Badge/n_freetrade.png"),
      num: loading && userData ? 0 : userData.badges.freetrade,
    },
    {
      id: "careforweak",
      title: "關懷弱勢",
      alt: "關懷弱勢",
      img_for_true: require("../../Badge/t_careforweak.png"),
      img_for_false: require("../../Badge/n_careforweak.png"),
      num: loading && userData ? 0 : userData.badges.careforweak,
    },
    {
      id: "envfriend",
      title: "友善環境",
      alt: "友善環境",
      img_for_true: require("../../Badge/t_envfriend.png"),
      img_for_false: require("../../Badge/n_envfriend.png"),
      num: loading ? 0 : userData.badges.envfriend,
    },
    {
      id: "foodeduc",
      title: "食育教育",
      alt: "食育教育",
      img_for_true: require("../../Badge/t_foodeduc.png"),
      img_for_false: require("../../Badge/n_foodeduc.png"),
      num: loading ? 0 : userData.badges.foodeduc,
    },
    {
      id: "localgred",
      title: "在地食材",
      alt: "在地食材",
      img_for_true: require("../../Badge/t_localgred.png"),
      img_for_false: require("../../Badge/n_localgred.png"),
      num: loading ? 0 : userData.badges.localgred,
    },
    {
      id: "organic",
      title: "有機小農",
      alt: "有機小農",
      img_for_true: require("../../Badge/t_organic.png"),
      img_for_false: require("../../Badge/n_organic.png"),
      num: loading ? 0 : userData.badges.organic,
    },
    {
      id: "ovolacto",
      title: "蛋奶素",
      alt: "蛋奶素",
      img_for_true: require("../../Badge/t_ovolacto.png"),
      img_for_false: require("../../Badge/n_ovolacto.png"),
      num: loading ? 0 : userData.badges.ovolacto,
    },
    {
      id: "petfriend",
      title: "寵物友善",
      alt: "寵物友善",
      img_for_true: require("../../Badge/t_petfriend.png"),
      img_for_false: require("../../Badge/n_petfriend.png"),
      num: loading ? 0 : userData.badges.petfriend,
    },
    {
      id: "noplastic",
      title: "減塑",
      alt: "減塑",
      img_for_true: require("../../Badge/t_noplastic.png"),
      img_for_false: require("../../Badge/n_noplastic.png"),
      num: loading ? 0 : userData.badges.noplastic,
    },
    {
      id: "stray",
      title: "流浪動物",
      alt: "流浪動物",
      img_for_true: require("../../Badge/t_stray.png"),
      img_for_false: require("../../Badge/n_stray.png"),
      num: loading ? 0 : userData.badges.stray,
    },
    {
      id: "vegetarianism",
      title: "純素",
      alt: "純素",
      img_for_true: require("../../Badge/t_vegetarianism.png"),
      img_for_false: require("../../Badge/n_vegetarianism.png"),
      num: loading ? 0 : userData.badges.vegetarianism,
    },
    {
      id: "foodagricultureeducation",
      title: "食農教育",
      alt: "食農教育",
      img_for_true: require("../../Badge/t_foodagricultureeducation.png"),
      img_for_false: require("../../Badge/n_foodagricultureeducation.png"),
      num: loading ? 0 : userData.badges.foodagricultureeducation,
    },
    {
      id: "appreciatefood",
      title: "惜食不浪費",
      alt: "惜食不浪費",
      img_for_true: require("../../Badge/t_appreciatefood.png"),
      img_for_false: require("../../Badge/n_appreciatefood.png"),
      num: loading ? 0 : userData.badges.appreciatefood,
    },
    {
      id: "creativecuisine",
      title: "創意料理",
      alt: "創意料理",
      img_for_true: require("../../Badge/t_creativecuisine.png"),
      img_for_false: require("../../Badge/n_creativecuisine.png"),
      num: loading ? 0 : userData.badges.creativecuisine,
    },
    {
      id: "creativevegetarian",
      title: "創新蔬食",
      alt: "創新蔬食",
      img_for_true: require("../../Badge/t_creativevegetarian.png"),
      img_for_false: require("../../Badge/n_creativevegetarian.png"),
      num: loading ? 0 : userData.badges.creativevegetarian,
    },
    {
      id: "sourcereduction",
      title: "源頭減量",
      alt: "源頭減量",
      img_for_true: require("../../Badge/t_sourcereduction.png"),
      img_for_false: require("../../Badge/n_sourcereduction.png"),
      num: loading ? 0 : userData.badges.sourcereduction,
    },
    {
      id: "greenprocurement",
      title: "綠色採購",
      alt: "綠色採購",
      img_for_true: require("../../Badge/t_greenprocurement.png"),
      img_for_false: require("../../Badge/n_greenprocurement.png"),
      num: loading ? 0 : userData.badges.greenprocurement,
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
        <img
          className="vircharacter"
          src={require("../../character/bear.gif")}
        ></img>
      </div>
      <div className="user-rb">
        <div className="user-rtb">
          <div className="user-rtlb">
            <div className="line">
              <div className="pack">
                <label className="user-label">名稱</label>
                <p>{username}</p>
              </div>
            </div>
            <div className="line">
              <div className="pack">
                <label className="user-label">朋友</label>
                <p>{numoffriend}</p>
              </div>
              {/* <div className="pack">
                <label className="user-label">Coins</label>
                <p className="num">{numofcoin}</p>
              </div> */}
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
                <Modal.Title>編輯個人頁面</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* <form className='user-form'> */}
                <div className="user-form-group">
                  <label className="user-form-label">Name</label>
                  {userData.change_name_chance &&
                  userData.change_name_chance >= 1 ? (
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
                      disabled={true}
                      readOnly={true}
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
                  <label className="user-form-label">簡介</label>
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
                {loading ? (
                  <button
                    id="closebtn"
                    variant="secondary"
                    disabled={true}
                    style={{
                      backgroundColor: "rgb(239, 238, 238)",
                      cursor: "not-allowed",
                    }}
                  >
                    <div>
                      <MDBSpinner size="sm" />
                      Loading
                    </div>
                  </button>
                ) : (
                  <button
                    id="closebtn"
                    variant="secondary"
                    onClick={updateUserProfile}
                  >
                    Finish Edition
                  </button>
                )}
              </Modal.Footer>
            </Modal>
            {/* {selectImage && (
                            <div>
                                <img width={'150px'} src={URL.createObjectURL(selectImage)} />
                                <button onClick={() => setSelectImage(null)}>Remove</button>
                            </div>
                        )} */}
            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <MDBSpinner />
              </div>
            ) : userImage ? (
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
                  {loading ? (
                    <></>
                  ) : (
                    greenOptions.map((e, index) => (
                      <div className="com" key={index}>
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
                  到訪過的店家
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
                  id="btn3"
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
  );
}

export default User;
