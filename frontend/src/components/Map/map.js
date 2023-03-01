import React, { useState, useRef } from "react";
import { Key } from "../../key"; // 引入 API key
import GoogleMapReact from "google-map-react";
import axios from "axios";
import FakeData from "../../fakedata/search.json";
import './map.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Stars from './Stars';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { BsFillPinMapFill } from 'react-icons/bs';
import Badges from "../Badge/badge";
import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit';

// Map
const SimpleMap = (props) => {
    // 預設位置
    const [myPosition, setMyPosition] = useState({ lat: 24.7876434209, lng: 120.9973572689 });
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
        if (navigator.geolocation) {
            var options = { timeout: 60000 };
            navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
        }
        else {
            alert("Geolocation not supported by this browser.")
        }

        if (searchType === "Name") findByName();
        else findByLocation();
    }

    const RenderResult = () => {
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
        RenderResult();
    }

    const errorHandler = (err) => {
        if (err.code == 1) {
            alert("Error: Access is denied!");
        } else if (err.code == 2) {
            alert("Error: We need your position to finish the search!");
        }
    }

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
            <div className="card">
                <h6 className="card-header">
                    <b>{name}</b>
                    {liked?
                    <MDBBtn size="sm" className='ms-1' tag='a' color='danger' floating style={{float:'right'}} onClick={() => setIsLiked(!liked)}>
                        <MDBIcon far icon="star"/>
                    </MDBBtn>:
                    <MDBBtn size="sm" className='ms-1' tag='a' color='danger' outline floating style={{float:'right'}} onClick={() => setIsLiked(!liked)}>
                        <MDBIcon far icon="star"/>
                    </MDBBtn>}
                </h6>
                <div className="card-body">
                    <Badges/>
                    {addr}<br/>
                    {rate}&nbsp;
                    <Stars
                        stars={rate}
                        size={20} //optional
                        fill='#e7711b' //optional
                    />&emsp;{p}
                    <span style={{float:'right'}}>
                    <Button variant="primary" size='sm' onClick={handleShow}>
                        More info
                    </Button></span>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Badges/>
                            地址: {addr}<br />
                            評分: {rate}&emsp;
                            <Stars
                                stars={rate}
                                size={20} //optional
                                fill='#e7711b' //optional
                            /><br />
                            電話: 沒有這個資訊<br />
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
    }
    // state for showing search result
    const [searchBtnClicked, setSearchBtn] = useState(false);
   
    const getLocation = () => {
        if (navigator.geolocation) {
            var options = { timeout: 60000 };
            navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
        }
        else {
            alert("Geolocation not supported by this browser.")
        }
    }


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
                    <button>
                        <img id="badge1" title='關懷弱勢' alt="關懷弱勢" onClick={() => setBadge1(prevMode => !prevMode)}
                            src={badge1 ? require('../../Badge/t_careweak.png') : require('../../Badge/n_careweak.png')} />
                    </button>
                    <button>
                        <img id="badge2" title='友善環境' alt="友善環境" onClick={() => setBadge2(prevMode => !prevMode)}
                            src={badge2 ? require('../../Badge/t_envfriend.png') : require('../../Badge/n_envfriend.png')} />
                    </button>
                    <button>
                        <img id="badge3" title='食育教育' alt="食育教育" onClick={() => setBadge3(prevMode => !prevMode)}
                            src={badge3 ? require('../../Badge/t_foodeduc.png') : require('../../Badge/n_foodeduc.png')} />
                    </button>
                    <button>
                        <img id="badge4" title='公平交易' alt="公平交易" onClick={() => setBadge4(prevMode => !prevMode)}
                            src={badge4 ? require('../../Badge/t_freetrade.png') : require('../../Badge/n_freetrade.png')} />
                    </button>
                    <button>
                        <img id="badge5" title='在地食材' alt="在地食材" onClick={() => setBadge5(prevMode => !prevMode)}
                            src={badge5 ? require('../../Badge/t_localgred.png') : require('../../Badge/n_localgred.png')} />
                    </button>
                    <button>
                        <img id="badge6" title='有機小農' alt="有機小農" onClick={() => setBadge6(prevMode => !prevMode)}
                            src={badge6 ? require('../../Badge/t_organic.png') : require('../../Badge/n_organic.png')} />
                    </button>
                    <button>
                        <img id="badge7" title='蛋奶素' alt="蛋奶素" onClick={() => setBadge7(prevMode => !prevMode)}
                            src={badge7 ? require('../../Badge/t_ovolacto.png') : require('../../Badge/n_ovolacto.png')} />
                    </button>
                    <button>
                        <img id="badge8" title='寵物友善' alt="寵物友善" onClick={() => setBadge8(prevMode => !prevMode)}
                             src={badge8 ? require('../../Badge/t_petfriend.png') : require('../../Badge/n_petfriend.png')} />
                    </button>
                    <button>
                        <img id="badge9" title='減塑' alt="減塑" onClick={() => setBadge9(prevMode => !prevMode)}
                            src={badge9 ? require('../../Badge/t_noplastic.png') : require('../../Badge/n_noplastic.png')} />
                    </button>
                    <button>
                        <img id="badge10" title='公共議題分享' alt="公共議題分享" onClick={() => setBadge10(prevMode => !prevMode)}
                            src={badge10 ? require('../../Badge/t_publicissue.png') : require('../../Badge/n_publicissue.png')} /></button>
                    <button>
                        <img id="badge11" title='流浪動物' alt="流浪動物" onClick={() => setBadge11(prevMode => !prevMode)}
                            src={badge11 ? require('../../Badge/t_stray.png') : require('../../Badge/n_stray.png')} />
                    </button>
                    <button>
                        <img id="badge12" title='純素' alt="純素" onClick={() => setBadge12(prevMode => !prevMode)}
                            src={badge12 ? require('../../Badge/t_vegetarianism.png') : require('../../Badge/n_vegetarianism.png')} />
                    </button>
                </div>
                <input id="name" type="button" value="開始搜尋" onClick={startSearch} />
            </div>
            <div className="container2">
                {searchBtnClicked?
                <div className="info_sidebar">
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
                </div>:<></>}
                <div className="map">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: Key, libraries: ["places"] }}
                        center={currentCenter} // 傳入 currentCenter
                        onChange={handleCenterChange}
                        // defaultCenter={props.center}
                        defaultZoom={props.zoom}
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
