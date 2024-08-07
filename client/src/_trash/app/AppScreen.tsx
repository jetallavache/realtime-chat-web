import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ChannelPage, ChatScreen } from "..";

const AppScreen: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChannelPage />} />
        <Route path="/chat" element={<ChatScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppScreen;
