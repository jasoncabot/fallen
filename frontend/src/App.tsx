import React from 'react';
import logo from './logo.svg';
import './App.css';
import { loadProvinces, ProvinceKey } from "@app/shared";

function App() {
  const provinces = loadProvinces();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {provinces[ProvinceKey.Aberdeen].name()}
        </p>
      </header>
    </div>
  );
}

export default App;
