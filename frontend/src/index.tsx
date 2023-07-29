import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from "react-router-dom";
import './index.css';

import Layout from "./pages/layout/Layout";
import Chat from "./pages/chat/Chat";

export default function App() {
  return (
      <HashRouter>
          <Routes>
              <Route path="/" element={<Layout />}>
              <Route index element={<Chat />} />
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
    <App />
  </React.StrictMode>
);