import React, { Suspense } from 'react'
import './App.scss';
import lazy from "react-lazy-with-preload";
import { BrowserRouter, Routes, Route } from 'react-router-dom'


const LoginPage = lazy(() => import('./pages/LoginPage'));
const JoinPage = lazy(() => import('./pages/JoinPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const SingleReportPage = lazy(() => import('./pages/SingleReportPage'));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Suspense fallback={<div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', zIndex: '10' }} >
        <span class="loader"></span>

         </div>}>
          <div className="pages">
            <Routes>
              <Route exact path="/" element={<LoginPage />} />
              <Route path="/join" element={<JoinPage />} />
              <Route path="/Home" element={<HomePage />} />
              <Route path="/report/:id" element={<SingleReportPage />} />

            </Routes>
          </div>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
