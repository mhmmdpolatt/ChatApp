import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,

  Route,
  Link,
  Routes
} from "react-router-dom";
import axios from 'axios';
import Home from './components/home';
import Chat from './components/chat';
import Kayit from './components/Kayit';
// import Giris from './components/Giris';

const App = () => {




  return (
    <>
       
    
      <Router>  
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path='/Kayit' element={<Kayit/>} />
          {/* <Route path='/giris' element={<Giris/>} /> */}

        </Routes>
      </Router>

    </>


  );
};

export default App;