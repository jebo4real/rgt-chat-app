import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import { RequireAuth } from "./services/reuireAuth"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/chat" element={<RequireAuth><Chat /></RequireAuth>} onLeave={ ()=>{alert("")} } />
      </Routes>
    </Router>
  );
}

export default App;
