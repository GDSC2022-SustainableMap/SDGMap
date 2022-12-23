import React, {
  useState,
  useRef
} from "react";
import { Key } from "./key"; // 引入 API key
import GoogleMapReact from "google-map-react";
import "./App.css";
import axios from "axios";


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
  const [currentCenter, setCurrentCenter] = useState({
    lat: 24.7876434209,
    lng: 120.9973572689,
  });

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
  const CafeMarker = ({ icon, text }) => (
    <div>
      {/* <img style={{ height: '30px', width: '30px' }} src={icon} />
      <div>{text}</div> */}
      <img className="location_icon" src={icon} />
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
    if(searchType === "Name"){
      findByName();
    }
    else{
      findByLocation();
    }
  }
  return (
    <div className="container" style={{ height: "100vh", width: "100%" }}>
      <div className="searchbar">
        <div>
          搜尋: <input ref={inputRef} type="text" onChange={handleInput} />
        </div>
        <select value={searchType} onChange={handleType}>
          <option>Name</option>
          <option>Location</option>
        </select>
        <input id="name" type="button" value="開始搜尋" onClick={startSearch} />
      </div>
      <GoogleMapReact
        bootstrapURLKeys={{ key: Key, libraries: ["places"] }}
        center={currentCenter} // 傳入 currentCenter
        onBoundsChange={handleCenterChange}
        // defaultCenter={props.center}
        defaultZoom={props.zoom}
        yesIWantToUseGoogleMapApiInternals
      >
        {places.map((item,id) => (
          <CafeMarker
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
  );
};

// 由於改寫成 functional component，故另外設定 defaultProps
SimpleMap.defaultProps = {
  center: {
    lat: 24.7876434209,
    lng: 120.9973572689,
  },
  zoom: 17,
};

// App
function App() {
  return (
    <div className="App">
      <SimpleMap />
    </div>
  );
}

export default App;
