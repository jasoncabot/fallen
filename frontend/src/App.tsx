import React from 'react';
import logo from './logo.svg';
import './App.css';
import { loadProvinces, ProvinceKey } from "@fallen/shared";

function App() {
  const provinces = loadProvinces();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {provinces[ProvinceKey.Aberdeen].name()} there are {Object.keys(provinces).length}
        </p>
      </header>
    </div>
  );
}

export default App;
