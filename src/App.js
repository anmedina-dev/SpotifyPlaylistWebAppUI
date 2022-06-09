import React from 'react';
import './App.css';
import Login from './pages/login';
import Home from './pages/home';

const code = new URLSearchParams(window.location.search).get('code')

function App() {

  return (
    <div className="App">
      {code ? <Home code={code} /> : <Login />}
    </div>
  );
}

export default App;
