// src/App.js
import React from "react";
import AuthRouter from "./routes/AuthRouter";

import "./styles/App.css";
function App() {
  return (
    <div className="App">
      {/* <Navbar/>
      <br/> <br/> */}
      <AuthRouter />
    </div>
  );
}

export default App;
