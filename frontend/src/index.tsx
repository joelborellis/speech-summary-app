import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from "react-router-dom";
import './index.css';

import Chat from "./pages/chat/Chat";
import Insights from "./pages/insights/Insights"
import Layout from "./pages/layout/Layout"

export default function App() {
  return (
      <HashRouter>
          <Routes>   
            <Route path="/" element={<Layout />}>
            <Route index element={<Insights />} />
            <Route path="chat" element={<Chat />} />
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