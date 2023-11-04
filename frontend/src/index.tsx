import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from "react-router-dom";
import './index.css';
import { GlobalStyle }  from './styles/global';

import Chat from "./pages/chat/Chat";
import Sidebar from "./pages/layout/Sidebar"

export default function App() {
  return (
      <HashRouter>
          <Sidebar />
          <Routes>
              <Route path="/" element={<Chat />}>            
              </Route>
          </Routes>
      </HashRouter>
  );
}


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>
);