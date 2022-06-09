import React from 'react';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';

const code = new URLSearchParams(window.location.search).get('code')

function App() {

  return (
    <div className="App">
      {code ? <Home code={code} /> : <Login />}
    </div>
  );
}

export default App;
