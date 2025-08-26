import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { Play } from './pages/Play';
import { Practice } from './pages/Practice';
import { Replay } from './pages/Replay';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/play" element={<Play />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/replay" element={<Replay />} />
      </Routes>
    </Layout>
  );
}

export default App;