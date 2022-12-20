import React, { Component, useState, useEffect, useRef, showInputValue } from 'react';
import { Key } from './key' // 引入 API key
import GoogleMapReact from 'google-map-react';
import { debounce } from 'lodash'
import "./App.css"

// 我的位置
const MyPositionMarker = ({ text }) => <div>{text}</div>;
// 切換搜尋類型按鈕
const SearchType = ({ text, type }) => {
  return <input type="button" value={text} name={type} />
}


// Map
const SimpleMap = (props) => {

  // 預設位置
  const [myPosition, setMyPosition] = useState({
    lat: 24.7876434209,
    lng: 120.9973572689
  })

  const [mapApiLoaded, setMapApiLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState(null)
  const [mapApi, setMapApi] = useState(null)
  const [places, setPlaces] = useState([])

  // 當地圖載入完成，將地圖實體與地圖 API 傳入 state 供之後使用
  const apiHasLoaded = (map, maps) => {
    setMapInstance(map)
    setMapApi(maps)
    setMapApiLoaded(true)
  };

  const handleCenterChange = () => {
    if(mapApiLoaded) {
      setMyPosition({
        // center.lat() 與 center.lng() 會回傳正中心的經緯度
        lat: mapInstance.center.lat(),
        lng: mapInstance.center.lng()
      })
    }
  }

  // Cafe Marker
  const CafeMarker = ({ icon, text }) => (
    <div>
      {/* <img style={{ height: '30px', width: '30px' }} src={icon} />
      <div>{text}</div> */}
      <img class='location_icon' src={icon} />
      <div class='location_name'>{text}</div>
    </div>
  )

  // 創建一個 state for searchType
  const [searchType, setSearchType] = useState('cafe');

  // 做一個 Function 可以改變搜尋類型
  const handleSearchType = e => {
    setSearchType(e.target.name)
  }

  // 搜尋
  const findLocation = () => {
    if(mapApiLoaded) {
      // alert('重新搜尋') // 用來看有沒有執行 effect
      const service = new mapApi.places.PlacesService(mapInstance)
      const request = {
        location: myPosition,
        radius: 4000,
        type: searchType, // 改為 state
      };

      service.nearbySearch(request, (results, status) => {
        if(status === mapApi.places.PlacesServiceStatus.OK) {
          setPlaces(results)
        }
      })
      
    }
  }
 
  // Effect for CenterChange -> FindLocation
  // 比對加入mapApiLoaded達到載入自動搜尋
  useEffect(() => { findLocation() }, [mapApiLoaded, searchType, myPosition])

  // Day06
  // 建立 state
  const [inputText, setInputText] = useState('')
  const [autocompleteResults, setAutocompleteResults] = useState([])
  // 更改 state
  const handleInput = () => { setInputText(inputRef.current.value)}
  // 自動完成
  const handleAutocomplete = () => {
    if(mapApiLoaded) {
      const service = new mapApi.places.AutocompleteService()
      const request = {
        input: inputText
      }

      service.getPlacePredictions(request, (results, status)=> {
        if(status === mapApi.places.PlacesServiceStatus.OK) {
          //console.log(results)
          setAutocompleteResults(results) // 寫入 state 供我們使用
        }
      });
    }
  }

  // 當 inputText 改變時，執行自動完成
  useEffect(()=>{ handleAutocomplete() },[inputText])

  // 建立參考點
  let inputRef = useRef(null);

  // 建立 state，供地圖本身做參考，以改變地圖視角
  const [currentCenter, setCurrentCenter] = useState({lat: 24.7876434209, lng: 120.9973572689})

  // 點擊自動完成地址時，更改 MyPosition
  const handleClickToChangeMyPosition = e => {
    const placeId = e.target.getAttribute('dataid')

    const service = new mapApi.places.PlacesService(mapInstance)
    const request = {
      placeId,
      fields: ['geometry']
    }

    service.getDetails(request, (results, status)=>{
      if( status === mapApi.places.PlacesServiceStatus.OK) {
        const newPosition = {
          lat: results.geometry.location.lat(),
          lng: results.geometry.location.lng()
        }
        setCurrentCenter(newPosition) // 改變地圖視角位置
        setMyPosition(newPosition) // 改變 MyPosition
        setAutocompleteResults([]) // 清空自動搜尋地址清單
        inputRef.current.value = '' // 清空 <input>
      }
    })
  }
  
  // 發送請求user位置
  // 確認Geolocation API是否存在
  const componentDidMount = () => {
    if ("geolocation" in navigator) {
      console.log("Available");
      navigator.geolocation.getCurrentPosition(function(position) {
        do_something(position.coords.latitude, position.coords.longitude);
      });
    } else {
      console.log("Not Available");
      // If not, then the user has disabled the location access.
    }
  }

  const do_something = (lat, lon) => {
    console.log(lat);
    console.log(lon);
  }


  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <div>
        <div >
        移動位置: <input ref={inputRef} type="text" onChange={ debounce(handleInput, 500) } />
        </div>
        <div onClick={handleClickToChangeMyPosition}>
          {(autocompleteResults && inputText) && autocompleteResults.map(item=>(
            <div key={item.id} dataid={item.place_id}>
              {item.description}
            </div>
          ))}
        </div>
      </div>
      {/* <input type="button" value="開始搜尋" onClick={ findLocation } /> */}
      <div onClick={ handleSearchType }>
        <SearchType text="找餐廳"　type="restaurant" />
        <SearchType text="找牙醫"　type="dentist" />
        <SearchType text="找健身房"　type="gym" />
        <SearchType text="找咖啡廳"　type="cafe" />
      </div>
      <input type="button" value="定位我的位置" onClick={ componentDidMount } />
      <GoogleMapReact
        bootstrapURLKeys={{ key: Key, libraries:['places'] }}
        center={currentCenter} // 傳入 currentCenter
        onBoundsChange={handleCenterChange}
        // defaultCenter={props.center}
        defaultZoom={props.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => apiHasLoaded(map, maps)}
        >
        <MyPositionMarker
          lat={myPosition.lat}
          lng={myPosition.lng}
          text="My Position"
        />
        {places.map(item=>(
          <CafeMarker 
            icon={item.icon}
            key={item.id}
            lat={item.geometry.location.lat()}
            lng={item.geometry.location.lng()}
            text={item.name}
            placeId={item.place_id}/>
        ))}
                
      </GoogleMapReact>
    </div>
  );
}

// 由於改寫成 functional component，故另外設定 defaultProps
SimpleMap.defaultProps = {
  center: {
    lat: 24.7876434209,
    lng: 120.9973572689
  },
  zoom: 17
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