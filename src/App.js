import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import MergeVideo from './components/MergeVideo';
import NotFound from './components/NotFound';
import './App.css';
import './styles/home.css';
function App() {
  return (
    <Router>
      <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/merge" element={<MergeVideo/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
    </Router>
  );
}

export default App;