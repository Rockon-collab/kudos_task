import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Auth from "./pages/auth";
import { ProtectedRoute } from "./protectedRoute";
import "./App.css";
import Layout from "./components/layout";
import ReceivedKudos from "./pages/receivedKudos";
import SendKudos from "./pages/sendKudos";
import SentKudos from "./pages/sentKudos";

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={"loading"}>
        <Routes>
          <Route path="/auth" name="Auth Page" element={<Auth />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index name="Landing Page" element={<Dashboard />} />
              <Route path="/receivedkudos" name="Received Page" element={<ReceivedKudos />} />
              <Route path="/sendkudos" name="Send Page" element={<SendKudos />} />
              <Route path="/sentkudos" name="Send Page" element={<SentKudos />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
