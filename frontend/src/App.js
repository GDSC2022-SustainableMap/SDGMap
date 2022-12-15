import "./App.css";
import axios from "axios";
import React, { useState, useEffect } from "react";

function App() {
  const [cafeName, setCafeName] = useState("");
  const [cafeData, setCafeDate] = useState([]);

  const getData = async () => {
    const res = await axios.get("http://127.0.0.1:5000/cafenomad/" + cafeName);
    setCafeDate(res.data);
    console.log(res.data);
  };

  return (
    <div className="App">
      <input
        type="text"
        onChange={(e) => {
          setCafeName(e.target.value);
        }}
      />
      <button onClick={getData}>查詢咖啡廳</button>
      {cafeData.map((item) => (
        <p>{item.name}</p>
      ))}
    </div>
  );
}

export default App;
