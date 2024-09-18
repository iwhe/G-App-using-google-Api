import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route  } from "react-router-dom";
import Mail from "./pages/mail.jsx";
import HomeComponents from "./pages/homepageComponents.jsx"; 
import Register from "./components/register.jsx";
import MapComponent from "./pages/maps.jsx";
import ViewEmail from "./components/mail/viewEmail.jsx";
import Gemini from "./pages/gemini.jsx";
import TextToImage from "./pages/text-to-image.jsx";


function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomeComponents />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gemini" element={<Gemini />} />
          <Route path="/mail" element={<Mail />} />
          <Route path="/text-to-image" element={<TextToImage />} />
          <Route path="/maps" element={<MapComponent />} />
          <Route path="/mail/view/:id" element={<ViewEmail />} />
        </Routes>
      </Router>
      </div>
  );
}

export default App;
