import React, { useState, useEffect } from "react";
import { Key } from "../../key"; // 引入 API key
import GoogleMapReact from "google-map-react";
import axios from "axios";
import "./map.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Stars from "./Stars";
import { BsFillGeoAltFill, BsSearch, BsFillPinMapFill } from "react-icons/bs";
import { Layout, theme, Input, Select, Table, Checkbox, Drawer } from "antd";
import { MDBBtn, MDBIcon, MDBSpinner} from "mdb-react-ui-kit";
import Badges from "../Badge/badge";
import { useNavigate } from "react-router-dom";
import useToken from "../../hooks/token";
import greenOptions from "./greepOptions";
// Map
const SimpleMap = (props) => {
  const { getToken, removeToken } = useToken();
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchType, setSearchType] = useState("Name");
  // 建立 state，供地圖本身做參考，以改變地圖視角
  const [currentCenter, setCurrentCenter] = useState(props.center);
  //table loading
  const [loading, setLoading] = useState(false);
  //sider collapse or not
  const [collapsed, setCollapsed] = useState(false);
  const [userPosition, setUserPosition] = useState([]);
  const [checkBoxValue, setCheckBoxValue] = useState([]);

  // Cafe Marker
  const Marker = ({ text, addr, price, rate, data }) => {
    const [open, setOpen] = useState(false);
    const [size, setSize] = useState();
    const showDefaultDrawer = () => {
      setSize("default");
      setOpen(true);
    };
    const onClose = () => {
      setOpen(false);
    };

    return (
      <div style={{ cursor: "pointer" }}>
        <Drawer
          title={`地點資訊`}
          placement="right"
          size={size}
          onClose={onClose}
          open={open}
        >
          <InfoBlock
            name={text}
            addr={addr}
            price={price}
            rate={rate}
            data={data}
          />
        </Drawer>
        <div onClick={showDefaultDrawer}>
          <BsFillGeoAltFill size={30} color="#61C0BF" />
          <div className="location_name">{text}</div>
        </div>
      </div>
    );
  };

  let rawResponse;
  //search by 名字, ex: 墨咖啡
  const findByName = async () => {
    try {
      setLoading(true);
      rawResponse = (
        await axios.post("http://127.0.0.1:5000/map/name_search", {
          target_place: inputText,
        })
      ).data;
    } catch (e) {
      console.error(e);
      return {};
    }

    setPlaces([rawResponse]);
    setLoading(false);
    setCurrentCenter([
      rawResponse.geometry.location.lat,
      rawResponse.geometry.location.lng,
    ]);
    console.log([rawResponse]);
    return rawResponse;
  };

  //search by location, ex: 24.801798905507397,120.97159605610153
  const findByLocation = async () => {
    try {
      setLoading(true);
      const newData = {};
      let count = 0;
      for (const key in greenIndicators) {
        if (greenIndicators[key] === true) {
          newData[count.toString()] = key;
          count++;
        }
      }
      for (const key in checkBoxValue) {
        newData[count.toString()] = checkBoxValue[key];
        count++;
      }

      // newData = Object.assign(newData, checkBoxValue);
      // newData = Object.
      console.log(newData);
      rawResponse = (
        await axios.post("http://127.0.0.1:5000/map/radius_search", {
          lat: parseFloat(inputText.split(",")[0]),
          lng: parseFloat(inputText.split(",")[1]),
          //Condition has not implemented in frontend.
          condition: newData,
        })
      ).data;
    } catch (e) {
      console.error(e);
      return {};
    }

    setPlaces(rawResponse);
    setLoading(false);
    setCurrentCenter([
      rawResponse[0].geometry.location.lat,
      rawResponse[0].geometry.location.lng,
    ]);
    console.log(rawResponse);
    return rawResponse;
  };

  const startSearch = () => {
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

    if (searchType === "Name") findByName();
    else findByLocation();
  };


  const InfoBlock = ({ name, addr, price, rate, data }) => {
    let p = "";
    for (let i = 0; i < price; i++) {
      p = p + "$";
    }
    // for modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [liked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleCheckin = async () => {
      try {
        setLoading(true);
        const t = getToken();
        rawResponse = (
          await axios.post(
            "http://127.0.0.1:5000/map/check_in",
            {
              place_id: data.place_id,
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
      if(rawResponse.msg === 'You should come to this place to check in!'){
        alert('You should come to this place to check in!');
      }else if(rawResponse.msg === 'You have checked in successfully!'){
        alert('You have checked in successfully!');
      }
      console.log(rawResponse);
      setLoading(false);
      return rawResponse;
    };

    const handleLike = async () => {
      try {
        setLoading(true);
        const t = getToken();
        rawResponse = (
          await axios.post(
            "http://127.0.0.1:5000/map/save_store",
            {
              place_id: data.place_id,
            },
            {
              headers: {
                Authorization: "Bearer " + t,
              },
            }
          )
        );
      } catch (error) {
        console.log(error.response);
        if (error.response.status === 401) {
          removeToken();
          alert("Token expired or you have not logined! Please login again!");
          navigate("/signin");

          return error;
        }
      }

      if(rawResponse.status !== 201){
        alert('Something wrong!');
      }
      setLoading(false);
      setIsLiked(!liked)
      return rawResponse;
    };
    const handleDislike = async () => {
      try {
        setLoading(true);
        const t = getToken();
        rawResponse = (
          await axios.post(
            "http://127.0.0.1:5000/map/delete_saved_store",
            {
              place_id: data.place_id,
            },
            {
              headers: {
                Authorization: "Bearer " + t,
              },
            }
          )
        );
      } catch (error) {
        console.log(error.response);
        if (error.response.status === 401) {
          removeToken();
          alert("Token expired or you have not logined! Please login again!");
          navigate("/signin");

          return error;
        }
      }


      setLoading(false);
      setIsLiked(!liked)
      return rawResponse;
    };
    const fetchUserSave = async () => {
      let t = getToken()
      try {
        setLoading(true);
        rawResponse = (
          await axios.get("http://127.0.0.1:5000/user/track_usersave", {
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

      setIsLiked(rawResponse.save_spots.includes(data.place_id));
      setLoading(false);
  
    };
  
    useEffect(() => {
      fetchUserSave();
    }, [])




    return (
      <div className="card-map">
        <h6 className="card-header">
          <b>{name}</b>
          {liked > 0? (
            <MDBBtn
              size="sm"
              className="ms-1"
              tag="a"
              color="danger"
              floating
              style={{ float: "right" }}
              // onClick={() => setIsLiked(!liked)}
              onClick={handleDislike}
            >
              <MDBIcon far icon="star" />
            </MDBBtn>
          ) : (
            <MDBBtn
              size="sm"
              className="ms-1"
              tag="a"
              color="danger"
              outline
              floating
              style={{ float: "right" }}
              onClick={handleLike}
            >
              <MDBIcon far icon="star" />
            </MDBBtn>
          )}
        </h6>
        <div className="card-body">
          <Badges data={data} />
          {addr}
          <br />
          {rate}&nbsp;
          <Stars
            stars={rate}
            size={20} //optional
            fill="#e7711b" //optional
          />
          &emsp;{p}
          <span style={{ float: "right" }}>
            <Button variant="primary" size="sm" onClick={handleShow}>
              More info
            </Button>
          </span>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Badges data={data} />
              地址: {addr}
              <br />
              評分: {rate}&emsp;
              <Stars
                stars={rate}
                size={20} //optional
                fill="#e7711b" //optional
              />
              <br />
              電話: 沒有這個資訊:(
              <br />
              價格: {p}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCheckin}>
                {
                  loading? <MDBSpinner size='sm'/>:<BsFillPinMapFill />
                }
              Check In

              </Button>
              <Button variant="secondary" onClick={handleClose}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  };

  /* To get user position */
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

  const [greenIndicators, setGreenIndicators] = useState({
    careforweak: false,
    envfriend: false,
    foodeduc: false,
    freetrade: false,
    localgred: false,
    organic: false,
    ovolacto: false,
    petfriend: false,
    noplastic: false,
    publicissue: false,
    stray: false,
    vegetarianism: false,
    foodagricultureeducation: false,
    appreciatefood: false,
    creativecuisine: false,
    creativevegetarian: false,
    sourcereduction: false,
    greenprocurement: false,
  });

  const options = [
    { label: "WI-FI", value: "wifi" },
    { label: "插座", value: "socket" },
    { label: "不限時", value: "limited_time" },
    { label: "營業中", value: "open_now" },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { Content, Sider } = Layout;
  const { Option } = Select;
  const SearchType = ["Name", "Location"];

  const columns = [
    {
      title: "地點名稱",
      dataIndex: "name",
    },
    {
      title: "評分",
      sorter: (a, b) => a.rating - b.rating,
      dataIndex: "rating",
    },
  ];
  const handleGreenIndicatorsChange = (e) => {
    const { id, checked } = e.target;
    console.log(greenIndicators);
    setGreenIndicators({ ...greenIndicators, [id]: !checked });
  };
  const checkBoxOnChange = (e) => {
    setCheckBoxValue(e);
    console.log(e);
  };
  return (
    <Layout className="layout">
      <Content style={{ height: "92.5vh" }}>
        <Layout
          style={{
            background: colorBgContainer,
            justifyContent: "center",
            height: "92.5vh",
          }}
          hasSider
        >
          <Sider
            style={
              collapsed
                ? {
                    background: colorBgContainer,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "0.25s",
                    cursor: "pointer",
                  }
                : {
                    background: colorBgContainer,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "0.25s",
                  }
            }
            width={400}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => {
              setCollapsed(value);
            }}
            onClick={() => {
              if (collapsed) {
                setCollapsed(!collapsed);
              }
            }}
          >
            {collapsed ? (
              <div>
                <BsSearch />
              </div>
            ) : (
              <div>
                <div style={{ paddingTop: "50px" }}>
                  搜尋方式
                  <div>
                    <Select
                      defaultValue="Name"
                      value={searchType}
                      onChange={(e) => {
                        setSearchType(e);
                      }}
                    >
                      {SearchType.map((item, id) => (
                        <Option key={id} value={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
                <Input.Group compact style={{ paddingTop: "10px" }}>
                  <div style={{ paddingTop: "10px" }}>
                    Name / Location
                    <div>
                      <Input
                        style={{ width: "90%" }}
                        onChange={(e) => {
                          setInputText(e.target.value);
                        }}
                        placeholder="墨咖啡/24.801,120.971"
                      />
                    </div>
                  </div>
                </Input.Group>

                {searchType === "Location" ? (
                  <div>
                    <div style={{ paddingTop: "10px" }}>店家條件:</div>
                    <Checkbox.Group
                      style={{ paddingTop: "10px" }}
                      options={options}
                      onChange={checkBoxOnChange}
                    />
                    <div style={{ paddingTop: "10px" }}>
                      永續指標:
                      {[
                        [0, 4],
                        [4, 8],
                        [8, 12],
                        [12, 16],
                      ].map((e,index) => (
                        <div className="badges" style={{ display: "flex" }} key={index}>
                          {greenOptions.slice(e[0], e[1]).map((e,index) => (
                            <button key={index}>
                              <img
                                id={e.id}
                                title={e.title}
                                alt={e.alt}
                                src={
                                  greenIndicators[e.id]
                                    ? e.img_for_true
                                    : e.img_for_false
                                }
                                checked={greenIndicators[e.id]}
                                onClick={handleGreenIndicatorsChange}
                              />
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                <div
                  style={{
                    paddingTop: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <input
                    id="name"
                    type="button"
                    value="開始搜尋"
                    onClick={startSearch}
                  />
                  {/* <input
                    id="pos"
                    type="button"
                    value="Get Position"
                    onClick={getLocation}
                  /> */}
                </div>
                <div style={{ paddingTop: "20px" }}>
                  <Table
                    loading={loading}
                    style={{ cursor: "pointer" }}
                    size="small"
                    rowKey={(_, index) => index}
                    columns={columns}
                    dataSource={places}
                    pagination={{ pageSize: 5 }}
                    scroll={{ y: 170 }}
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: (e) => {
                          setCurrentCenter([
                            record.geometry.location.lat,
                            record.geometry.location.lng,
                          ]);
                        }, // click row
                      };
                    }}
                  />
                </div>
              </div>
            )}
          </Sider>
          <Content>
            <GoogleMapReact
              bootstrapURLKeys={{ key: Key, libraries: ["places"] }}
              center={currentCenter} // 傳入 currentCenter
              //   onBoundsChange={handleCenterChange}
              defaultCenter={props.center}
              defaultZoom={props.zoom}
              yesIWantToUseGoogleMapApiInternals
              onChange={(e) => setCurrentCenter(e.center)}
            >
              {places.map((item,index) => (
                <Marker
                  key={index}
                  index={index}
                  addr={item.formatted_address}
                  price={item.price_level}
                  rate={item.rating}
                  lat={item.geometry.location.lat}
                  lng={item.geometry.location.lng}
                  text={item.name}
                  placeId={item.place_id}
                  data={item}
                />
              ))}
            </GoogleMapReact>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

// 預設位置 新竹火車站lat: 24.802464231278087, lng: 120.97158830040144
// 交大lat: 24.7876434209, lng: 120.9973572689,
// 由於改寫成 functional component，故另外設定 defaultProps
SimpleMap.defaultProps = {
  center: { lat: 24.802464231278087, lng: 120.97158830040144 },
  zoom: 17,
};

// App
function Map() {
  return (
    <div className="Map">
      <SimpleMap />
    </div>
  );
}

export default Map;
