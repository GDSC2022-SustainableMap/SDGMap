import React, { useState, useRef } from "react";
import { Key } from "../../key"; // 引入 API key
import GoogleMapReact from "google-map-react";
import axios from "axios";
import "./map.css";
import Modal from "react-bootstrap/Modal";
import Stars from "./Stars";
import { BsFillGeoAltFill } from "react-icons/bs";
import {
  Layout,
  theme,
  Input,
  Select,
  Table,
  Checkbox,

  Drawer,

} from "antd";

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
    dataIndex: "rating",
  },
];
// Map
const SimpleMap = (props) => {
  const [places, setPlaces] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchType, setSearchType] = useState("Name");
  // 建立 state，供地圖本身做參考，以改變地圖視角
  const [currentCenter, setCurrentCenter] = useState(props.center);

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
      <div>
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
      rawResponse = (
        await axios.post("http://127.0.0.1:5000/name_search", {
          target_place: inputText,
        })
      ).data;
    } catch (e) {
      console.error(e);
      return {};
    }

    setPlaces([rawResponse]);
    console.log(rawResponse);
    setCurrentCenter([
      rawResponse.geometry.location.lat,
      rawResponse.geometry.location.lng,
    ]);
    return rawResponse;
  };

  //search by location, ex: 24.801798905507397,120.97159605610153
  const findByLocation = async () => {
    try {
      console.log(inputText.split(",")[0]);
      console.log(inputText.split(",")[1]);
      rawResponse = (
        await axios.post("http://127.0.0.1:5000/radius_search", {
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
    console.log(rawResponse);
    setCurrentCenter([
      rawResponse[0].geometry.location.lat,
      rawResponse[0].geometry.location.lng,
    ]);
    return rawResponse;
  };

  const startSearch = () => {
    if (searchType === "Name") {
      findByName();
    } else {
      findByLocation();
    }
  };

  const InfoBlock = ({ name, addr, price, rate }) => {
    let p = "";
    for (let i = 0; i < price; i++) {
      p = p + "$";
    }
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
      <div className="BoxText1">
        <b>{name}</b>
        <hr />
        地址: {addr}
        <br />
        評分: {rate}&emsp;
        <Stars
          stars={rate}
          size={20} //optional
          fill="#e7711b" //optional
        />
        <br />
        <div>
          電話: 沒有這個資訊:(
          <br />
          價格: {p}
          <br />
          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <input
              id="name"
              type="button"
              value="More info"
              onClick={handleShow}
            />
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
              <input id="name" type="button" value="Check In" />
              <input id="name" type="button" value="OK" onClick={handleClose} />
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  };

  //   const RenderResult = () => {
  //     // console.log(FakeData);
  //     // setPlaces(FakeData.results);
  //     // show the info sidebar
  //     let info_sidebar = document.querySelector(".info_sidebar");
  //     info_sidebar.style.display = "block";
  //   };

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
    if (err.code == 1) {
      alert("Error: Access is denied!");
    } else if (err.code == 2) {
      alert("Error: Position is unavailable!");
    }
  };

  const getLocation = () => {
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
  };

  const tag_Onoff = (image) => {
    let tmpsrc = image.src;
    // tmpsrc=tmpsrc.replace("n_", "t_");
    // image.src=require(tmpsrc);
  };

  const ImageToggleOnMouseOver = ({ primaryImg, secondaryImg, t }) => {
    const imageRef = useRef(null);
    return (
      <img
        onMouseOver={() => {
          imageRef.current.src = secondaryImg;
        }}
        onMouseOut={() => {
          imageRef.current.src = primaryImg;
        }}
        src={primaryImg}
        alt={t}
        title={t}
        ref={imageRef}
      />
    );
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
            style={{
              background: colorBgContainer,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              // overflow: 'auto',
              // height: '100vh',
              // position: 'fixed',
              // left: 0,
              // top: '7.5%',
              // bottom: 0,
            }}
            width={400}
          >
            <div style={{ paddingTop: "10px" }}>
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
            <Checkbox.Group style={{ paddingTop: "10px" }} options={options} />
            <div style={{ paddingTop: "10px" }}>
              永續指標:
              <div className="badges">
                <button>
                  <ImageToggleOnMouseOver
                    primaryImg={require("../../Badge/n_careweak.png")}
                    secondaryImg={require("../../Badge/t_careweak.png")}
                    t="關懷弱勢"
                  />
                </button>
                <button>
                  <ImageToggleOnMouseOver
                    primaryImg={require("../../Badge/n_envfriend.png")}
                    secondaryImg={require("../../Badge/t_envfriend.png")}
                    t="友善環境"
                  />
                </button>
                <button>
                  <ImageToggleOnMouseOver
                    primaryImg={require("../../Badge/n_foodeduc.png")}
                    secondaryImg={require("../../Badge/t_foodeduc.png")}
                    t="食育教育"
                  />
                </button>
                <button>
                  <ImageToggleOnMouseOver
                    primaryImg={require("../../Badge/n_freetrade.png")}
                    secondaryImg={require("../../Badge/t_freetrade.png")}
                    t="公平交易"
                  />
                </button>
              </div>
              <div className="badges">
                <button>
                  <ImageToggleOnMouseOver
                    primaryImg={require("../../Badge/n_localgred.png")}
                    secondaryImg={require("../../Badge/t_localgred.png")}
                    t="在地食材"
                  />
                </button>
                <button>
                  <ImageToggleOnMouseOver
                    primaryImg={require("../../Badge/n_organic.png")}
                    secondaryImg={require("../../Badge/t_organic.png")}
                    t="有機小農"
                  />
                </button>
                <button>
                  <ImageToggleOnMouseOver
                    primaryImg={require("../../Badge/n_ovolacto.png")}
                    secondaryImg={require("../../Badge/t_ovolacto.png")}
                    t="蛋奶素"
                  />
                </button>
                <button>
                  <ImageToggleOnMouseOver
                    primaryImg={require("../../Badge/n_petfriend.png")}
                    secondaryImg={require("../../Badge/t_petfriend.png")}
                    t="寵物友善"
                  />
                </button>
              </div>
              <div className="badges">
                <button>
                  <ImageToggleOnMouseOver
                    primaryImg={require("../../Badge/n_noplastic.png")}
                    secondaryImg={require("../../Badge/t_noplastic.png")}
                    t="減塑"
                  />
                </button>
                <button>
                  <ImageToggleOnMouseOver
                    primaryImg={require("../../Badge/n_publicissue.png")}
                    secondaryImg={require("../../Badge/t_publicissue.png")}
                    t="公共議題分享"
                  />
                </button>
                <button>
                  <ImageToggleOnMouseOver
                    primaryImg={require("../../Badge/n_stray.png")}
                    secondaryImg={require("../../Badge/t_stray.png")}
                    t="流浪動物"
                  />
                </button>
                <button>
                  <ImageToggleOnMouseOver
                    primaryImg={require("../../Badge/n_vegetarianism.png")}
                    secondaryImg={require("../../Badge/t_vegetarianism.png")}
                    t="純素"
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
              <input
                id="pos"
                type="button"
                value="Get Position"
                onClick={getLocation}
              />
            </div>
            {/* <Divider/> */}
            <div style={{ paddingTop: "20px" }}>
              <Table
                size="small"
                rowKey={(_, index) => index}
                columns={columns}
                dataSource={places}
                pagination={{ pageSize: 5 }}
                scroll={{ y: 170 }}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (e) => {
                      setCurrentCenter([0, 0]);

                      setCurrentCenter([
                        record.geometry.location.lat,
                        record.geometry.location.lng,
                      ]);

                      console.log(currentCenter);
                    }, // click row
                  };
                }}
              />
            </div>
            {/* <Divider /> */}
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
