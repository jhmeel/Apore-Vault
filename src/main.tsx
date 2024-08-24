import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { Buffer } from 'buffer';
import process from 'process';

window.Buffer = Buffer;
window.process = process;
createRoot(document.getElementById("root")!).render( 
  <StrictMode>
    <Router>
      <Toaster position="top-center"/> 
        <App />
    </Router>
  </StrictMode>
);
