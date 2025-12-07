import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecruiterDashboard from './components/RecruiterDashboard';
import AddCandidate from './components/AddCandidateForm';
import CandidateList from './components/CandidateList';
import CandidateDetail from './components/CandidateDetail';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecruiterDashboard />} />
        <Route path="/add-candidate" element={<AddCandidate />} />
        <Route path="/candidates" element={<CandidateList />} />
        <Route path="/candidates/:id" element={<CandidateDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;