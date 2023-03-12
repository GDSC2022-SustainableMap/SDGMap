import React, { useState } from "react";
import { Key } from "../../key"; // 引入 API key
import GoogleMapReact from "google-map-react";
import axios from "axios";
import "./map.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Stars from "./Stars";
import { BsFillGeoAltFill, BsSearch, BsFillPinMapFill } from "react-icons/bs";
import { Layout, theme, Input, Select, Table, Checkbox, Drawer } from "antd";
import { MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import Badges from "../Badge/badge";

// Map
const SimpleMap = (props) => {
  const [places, setPlaces] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchType, setSearchType] = useState("Name");
  // 建立 state，供地圖本身做參考，以改變地圖視角
  const [currentCenter, setCurrentCenter] = useState(props.center);
  //table loading
  const [loading, setLoading] = useState(false);
  //sider collapse or not
  const [collapsed, setCollapsed] = useState(false);
  // Cafe Marker
  const Marker = ({ text, addr, price, rate }) => {
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
          <InfoBlock name={text} addr={addr} price={price} rate={rate} />
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
    return rawResponse;
  };

  //search by location, ex: 24.801798905507397,120.97159605610153
  const findByLocation = async () => {
    try {
      setLoading(true);
      rawResponse = (
        await axios.post("http://127.0.0.1:5000/map/radius_search", {
          lat: parseFloat(inputText.split(",")[0]),
          lng: parseFloat(inputText.split(",")[1]),
          //Condition has not implemented in frontend.
          condition: {
            0: "distance",
            1: "quiet",
            2: "seat",
            3: "standing_desk",
            4: "tasty",
            5: "cheap",
            6: "music",
            7: "limited_time",
            8: "wifi",
          },
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

  const InfoBlock = ({ name, addr, price, rate }) => {
    let p = "";
    for (let i = 0; i < price; i++) {
      p = p + "$";
    }
    // for modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [liked, setIsLiked] = useState(false);
    return (
      <div className="card-map">
        <h6 className="card-header">
          <b>{name}</b>
          {liked ? (
            <MDBBtn
              size="sm"
              className="ms-1"
              tag="a"
              color="danger"
              floating
              style={{ float: "right" }}
              onClick={() => setIsLiked(!liked)}
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
              onClick={() => setIsLiked(!liked)}
            >
              <MDBIcon far icon="star" />
            </MDBBtn>
          )}
        </h6>
        <div className="card-body">
          <Badges />
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
              <Badges />
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
              <Button variant="secondary">
                <BsFillPinMapFill /> Check In
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
    alert(
      "Latitude: " +
        position.coords.latitude +
        "\nLongitude: " +
        position.coords.longitude
    );
    setCurrentCenter([latitude, longitude]);
  };

  const errorHandler = (err) => {
    if (err.code === 1) {
      alert("Error: Access is denied!");
    } else if (err.code === 2) {
      alert("Error: Position is unavailable!");
    }
  };

  const [badge1, setBadge1] = useState(false);
  const [badge2, setBadge2] = useState(false);
  const [badge3, setBadge3] = useState(false);
  const [badge4, setBadge4] = useState(false);
  const [badge5, setBadge5] = useState(false);
  const [badge6, setBadge6] = useState(false);
  const [badge7, setBadge7] = useState(false);
  const [badge8, setBadge8] = useState(false);
  const [badge9, setBadge9] = useState(false);
  const [badge10, setBadge10] = useState(false);
  const [badge11, setBadge11] = useState(false);
  const [badge12, setBadge12] = useState(false);
  const [badge13, setBadge13] = useState(false);
  const [badge14, setBadge14] = useState(false);
  const [badge15, setBadge15] = useState(false);
  const [badge16, setBadge16] = useState(false);
  const [badge17, setBadge17] = useState(false);
  const [badge18, setBadge18] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { Content, Sider } = Layout;
  const { Option } = Select;
  const SearchType = ["Name", "Location"];

  const options = [
    { label: "WI-FI", value: "wi-fi" },
    { label: "插座", value: "socket" },
    { label: "不限時", value: "time_unlimited" },
    { label: "營業中", value: "operation" },
  ];
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
                <div style={{ paddingTop: "10px" }}>店家條件:</div>
                <Checkbox.Group
                  style={{ paddingTop: "10px" }}
                  options={options}
                />

                <div style={{ paddingTop: "10px" }}>
                  永續指標:
                  <div className="badges" style={{ display: "flex" }}>
                    <button>
                      <img
                        id="badge1"
                        title="關懷弱勢"
                        alt="關懷弱勢"
                        onClick={() => setBadge1((prevMode) => !prevMode)}
                        src={
                          badge1
                            ? require("../../Badge/t_careforweak.png")
                            : require("../../Badge/n_careforweak.png")
                        }
                      />
                    </button>
                    <button>
                      <img
                        id="badge2"
                        title="友善環境"
                        alt="友善環境"
                        onClick={() => setBadge2((prevMode) => !prevMode)}
                        src={
                          badge2
                            ? require("../../Badge/t_envfriend.png")
                            : require("../../Badge/n_envfriend.png")
                        }
                      />
                    </button>
                    <button>
                      <img
                        id="badge3"
                        title="食育教育"
                        alt="食育教育"
                        onClick={() => setBadge3((prevMode) => !prevMode)}
                        src={
                          badge3
                            ? require("../../Badge/t_foodeduc.png")
                            : require("../../Badge/n_foodeduc.png")
                        }
                      />
                    </button>
                    <button>
                      <img
                        id="badge4"
                        title="公平交易"
                        alt="公平交易"
                        onClick={() => setBadge4((prevMode) => !prevMode)}
                        src={
                          badge4
                            ? require("../../Badge/t_freetrade.png")
                            : require("../../Badge/n_freetrade.png")
                        }
                      />
                    </button>
                    <button>
                      <img
                        id="badge5"
                        title="在地食材"
                        alt="在地食材"
                        onClick={() => setBadge5((prevMode) => !prevMode)}
                        src={
                          badge5
                            ? require("../../Badge/t_localgred.png")
                            : require("../../Badge/n_localgred.png")
                        }
                      />
                    </button>
                    <button>
                      <img
                        id="badge6"
                        title="有機小農"
                        alt="有機小農"
                        onClick={() => setBadge6((prevMode) => !prevMode)}
                        src={
                          badge6
                            ? require("../../Badge/t_organic.png")
                            : require("../../Badge/n_organic.png")
                        }
                      />
                    </button>
                  </div>
                  <div className="badges" style={{ display: "flex" }}>
                    <button>
                      <img
                        id="badge7"
                        title="蛋奶素"
                        alt="蛋奶素"
                        onClick={() => setBadge7((prevMode) => !prevMode)}
                        src={
                          badge7
                            ? require("../../Badge/t_ovolacto.png")
                            : require("../../Badge/n_ovolacto.png")
                        }
                      />
                    </button>
                    <button>
                      <img
                        id="badge8"
                        title="寵物友善"
                        alt="寵物友善"
                        onClick={() => setBadge8((prevMode) => !prevMode)}
                        src={
                          badge8
                            ? require("../../Badge/t_petfriend.png")
                            : require("../../Badge/n_petfriend.png")
                        }
                      />
                    </button>
                    <button>
                      <img
                        id="badge9"
                        title="減塑"
                        alt="減塑"
                        onClick={() => setBadge9((prevMode) => !prevMode)}
                        src={
                          badge9
                            ? require("../../Badge/t_noplastic.png")
                            : require("../../Badge/n_noplastic.png")
                        }
                      />
                    </button>
                    <button>
                      <img
                        id="badge10"
                        title="公共議題分享"
                        alt="公共議題分享"
                        onClick={() => setBadge10((prevMode) => !prevMode)}
                        src={
                          badge10
                            ? require("../../Badge/t_publicissue.png")
                            : require("../../Badge/n_publicissue.png")
                        }
                      />
                    </button>
                    <button>
                      <img
                        id="badge11"
                        title="流浪動物"
                        alt="流浪動物"
                        onClick={() => setBadge11((prevMode) => !prevMode)}
                        src={
                          badge11
                            ? require("../../Badge/t_stray.png")
                            : require("../../Badge/n_stray.png")
                        }
                      />
                    </button>
                    <button>
                      <img
                        id="badge12"
                        title="純素"
                        alt="純素"
                        onClick={() => setBadge12((prevMode) => !prevMode)}
                        src={
                          badge12
                            ? require("../../Badge/t_vegetarianism.png")
                            : require("../../Badge/n_vegetarianism.png")
                        }
                      />
                    </button>
                  </div>
                  <div className="badges" style={{ display: "flex" }}>
                    <button>
                      <img
                        id="badge13"
                        title="食農教育"
                        alt="食農教育"
                        onClick={() => setBadge13((prevMode) => !prevMode)}
                        src={
                          badge13
                            ? require("../../Badge/t_foodagricultureeducation.png")
                            : require("../../Badge/n_foodagricultureeducation.png")
                        }
                      />
                    </button>
                    <button>
                      <img
                        id="badge14"
                        title="惜食不浪費"
                        alt="惜食不浪費"
                        onClick={() => setBadge14((prevMode) => !prevMode)}
                        src={
                          badge14
                            ? require("../../Badge/t_appreciatefood.png")
                            : require("../../Badge/n_appreciatefood.png")
                        }
                      />
                    </button>
                    <button>
                      <img
                        id="badge15"
                        title="創意料理"
                        alt="創意料理"
                        onClick={() => setBadge15((prevMode) => !prevMode)}
                        src={
                          badge15
                            ? require("../../Badge/t_creativecuisine.png")
                            : require("../../Badge/n_creativecuisine.png")
                        }
                      />
                    </button>
                    <button>
                      <img
                        id="badge16"
                        title="創新蔬食"
                        alt="創新蔬食"
                        onClick={() => setBadge16((prevMode) => !prevMode)}
                        src={
                          badge16
                            ? require("../../Badge/t_creativevegetarian.png")
                            : require("../../Badge/n_creativevegetarian.png")
                        }
                      />
                    </button>
                    <button>
                      <img
                        id="badge17"
                        title="源頭減量"
                        alt="源頭減量"
                        onClick={() => setBadge17((prevMode) => !prevMode)}
                        src={
                          badge17
                            ? require("../../Badge/t_sourcereduction.png")
                            : require("../../Badge/n_sourcereduction.png")
                        }
                      />
                    </button>
                    <button>
                      <img
                        id="badge18"
                        title="綠色採購"
                        alt="綠色採購"
                        onClick={() => setBadge18((prevMode) => !prevMode)}
                        src={
                          badge18
                            ? require("../../Badge/t_greenprocurement.png")
                            : require("../../Badge/n_greenprocurement.png")
                        }
                      />
                    </button>
                  </div>
                </div>
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
              {places.map((item, index) => (
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
