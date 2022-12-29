import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import CreatePoint from './CreatePoint';

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/create-point' element={<CreatePoint />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default Routers;