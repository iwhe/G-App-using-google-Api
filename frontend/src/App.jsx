import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import Mail from "./pages/mail.jsx";
import HomeComponents from "./pages/homepageComponents.jsx"; 
import Register from "./components/register.jsx";
import MapComponent from "./pages/maps.jsx";


function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomeComponents />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mail" element={<Mail />} />
          <Route path="/maps" element={<MapComponent />} />
        </Routes>
      </Router>
      </div>
  );
}

export default App;
