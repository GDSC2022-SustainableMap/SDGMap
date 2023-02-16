import React, { useState, useRef } from "react";
import { Key } from "../../key"; // 引入 API key
import GoogleMapReact from "google-map-react";
import axios from "axios";
import FakeData from "../../fakedata/search.json";
import './map.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Stars from './Stars';

// Map
const SimpleMap = (props) => {
    // 預設位置
    const [myPosition, setMyPosition] = useState({
        lat: 24.7876434209,
        lng: 120.9973572689,
    });

    const [mapApiLoaded, setMapApiLoaded] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    const [places, setPlaces] = useState([]);

    const [inputText, setInputText] = useState("");
    const [searchType, setSearchType] = useState("Name");
    // 建立 state，供地圖本身做參考，以改變地圖視角

    const [currentCenter, setCurrentCenter] = useState(props.center);

    const handleCenterChange = () => {
        if (mapApiLoaded) {
            setMyPosition({
                // center.lat() 與 center.lng() 會回傳正中心的經緯度
                lat: mapInstance.center.lat(),
                lng: mapInstance.center.lng(),
            });
        }
    };

    // Cafe Marker
    const Marker = ({ icon, text }) => (
        <div>
            {/* <img style={{ height: '30px', width: '30px' }} src={icon} />
    <div>{text}</div> */}
            <img className="location_icon" src={icon} alt="location_icon" />
            <div className="location_name">{text}</div>
        </div>
    );

    // 建立參考點
    let inputRef = useRef(null);
    const handleInput = () => {
        setInputText(inputRef.current.value);
    };
    const handleType = (e) => {
        setSearchType(e.target.value);
    };


    let rawResponse;
    //search by 名字, ex: 墨咖啡
    const findByName = async () => {
        try {
            rawResponse = (await axios.get("http://127.0.0.1:5000/gmap/?name=" + inputText))
                .data;
        } catch (e) {
            console.error(e);
            return {};
        };

        setPlaces(rawResponse.candidates);
        setCurrentCenter([
            rawResponse.candidates[0].geometry.location.lat,
            rawResponse.candidates[0].geometry.location.lng,
        ]);
        return rawResponse;
    };

    //search by location, ex: 24.801798905507397,120.97159605610153
    const findByLocation = async () => {
        try {
            rawResponse = (await axios.get("http://127.0.0.1:5000/gmap/radius?lat=" + inputText.split(',')[0] + "&lng=" + inputText.split(',')[1]))
                .data;
        } catch (e) {
            console.error(e);
            return {};
        }
        setPlaces(rawResponse);
        setCurrentCenter([
            rawResponse[0].geometry.location.lat,
            rawResponse[0].geometry.location.lng,
        ]);
        return rawResponse;
    };

    const startSearch = () => {
        RenderResult();
        if (searchType === "Name") {
            findByName();
        }
        else {
            findByLocation();
        }
    }

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
                地址: {addr}<br />
                評分: {rate}&emsp;
                <Stars
                    stars={rate}
                    size={20} //optional
                    fill='#e7711b' //optional
                /><br />
                <div>
                    電話: 沒有這個資訊:(<br />
                    <span>價格: {p}</span>
                    {/* 待完成：將此button靠右對齊 */}
                    <button variant="primary" onClick={handleShow}>
                        More info
                    </button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>wait for more information</Modal.Body>
                        <Modal.Footer>
                            <button variant="secondary" onClick={handleClose}>
                                OK
                            </button>
                        </Modal.Footer>
                    </Modal>

                </div>
            </div>
        );
    }

    const RenderResult = () => {
        console.log(FakeData);
        setPlaces(FakeData.results);
        // show the info sidebar
        let info_sidebar = document.querySelector('.info_sidebar');
        info_sidebar.style.display = "block";
    }

    /* To get user position */
    const showLocation = (position) => {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        alert("Latitude: " + position.coords.latitude +
            "\nLongitude: " + position.coords.longitude);
        setCurrentCenter([latitude, longitude]);
    }

    const errorHandler = (err) => {
        if (err.code == 1) {
            alert("Error: Access is denied!");
        } else if (err.code == 2) {
            alert("Error: Position is unavailable!");
        }
    }

    const getLocation = () => {
        if (navigator.geolocation) {
            var options = { timeout: 60000 };
            navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
        }
        else {
            alert("Geolocation not supported by this browser.")
        }
    }

    const tag_Onoff = (image) => {
        var tmpsrc = image.src;
        tmpsrc=tmpsrc.replace("n_", "t_");
        console.log(tmpsrc);
        // image.src=require(tmpsrc);
    }

    return (
        <div className="container">
            <div className="searchbar">
                <div className="select-box box">搜尋方式:
                    <select value={searchType} onChange={handleType}>
                        <option>Name</option>
                        <option>Location</option>
                    </select>
                </div>
                <div className="box">
                    位置: <input id='location' ref={inputRef} type="text" onChange={handleInput} />
                </div>
                <div className="other_tag">
                    <input type="checkbox" id="wifi" value="wifi" />
                    <label for="wifi">WiFi</label>
                </div>

                <div className="other_tag">
                    <input type="checkbox" id="plug" value="plug" />
                    <label for="plug">插座</label>
                </div>
                <div className="other_tag">
                    <input type="checkbox" id="no-time-limit" value="no-time-limit" />
                    <label for="no-time-limit">不限時</label>
                </div>
                <div className="other_tag">
                    <input type="checkbox" id="open" value="open" />
                    <label for="open">營業中</label>
                </div>
                <div className="badges">
                    <button><img src={require('../../Badge/n_careweak.png')} title='關懷弱勢' alt="關懷弱勢" /></button>
                    <button><img src={require('../../Badge/n_envfriend.png')} title='友善環境' alt="友善環境" /></button>
                    <button><img src={require('../../Badge/n_foodeduc.png')} title='食育教育' alt="食育教育" /></button>
                    <button><img src={require('../../Badge/n_freetrade.png')} title='公平交易' alt="公平交易" /></button>
                    <button><img src={require('../../Badge/n_localgred.png')} title='在地食材' alt="在地食材" /></button>
                    <button><img src={require('../../Badge/n_organic.png')} title='有機小農' alt="有機小農" /></button>
                    <button><img src={require('../../Badge/n_ovolacto.png')} title='蛋奶素' alt="蛋奶素" /></button>
                    <button><img src={require('../../Badge/n_petfriend.png')} title='寵物友善' alt="寵物友善" /></button>
                    <button><img src={require('../../Badge/n_noplastic.png')} title='減塑' alt="減塑" /></button>
                    <button><img src={require('../../Badge/n_publicissue.png')} title='公共議題分享' alt="公共議題分享" /></button>
                    <button><img src={require('../../Badge/n_stray.png')} title='流浪動物' alt="流浪動物" /></button>
                    <button><img src={require('../../Badge/n_vegetarianism.png')} title='純素' alt="純素" /></button>
                </div>
                <input id="name" type="button" value="開始搜尋" onClick={startSearch} />
                <input id="pos" type="button" value="Get Position" onClick={getLocation} />

            </div>
            <div className="container2">
                <div className="info_sidebar" style={{ display: "none" }}>
                    <div className="infos" style={{ textAlign: "left" }}>
                        {places.map((item) => (
                            <InfoBlock
                                name={item.name}
                                addr={item.formatted_address}
                                price={item.price_level}
                                rate={item.rating}
                            />
                        ))}
                    </div>
                </div>
                <div className="map">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: Key, libraries: ["places"] }}
                        center={currentCenter} // 傳入 currentCenter
                        onChange={handleCenterChange}
                        // defaultCenter={props.center}
                        defaultZoom={props.zoom}
                        yesIWantToUseGoogleMapApiInternals
                    >
                        {places.map((item, id) => (
                            <Marker
                                icon={item.icon}
                                key={id}
                                lat={item.geometry.location.lat}
                                lng={item.geometry.location.lng}
                                text={item.name}
                                placeId={item.place_id}
                            />
                        ))}
                    </GoogleMapReact>
                </div>
            </div>
        </div>
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
