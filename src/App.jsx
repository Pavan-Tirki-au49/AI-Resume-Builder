import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Build Track Components
import StepComponent from './pages/rb/StepPage';
import BuildTrackProof from './pages/rb/Proof';
import { STEPS } from './lib/steps';

// App Components
import Navigation from './components/Shared/Navigation';
import Home from './pages/Home';
import Builder from './pages/Builder';
import Preview from './pages/Preview';
import AppProof from './pages/Proof';

// Wrapper for App routes to include Navigation
const AppLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navigation />
    {children}
  </div>
);

function App() {
  return (
    <Routes>
      {/* Build Track Routes (No Navigation, uses PremiumLayout internal header) */}
      {STEPS.map((step) => (
        <Route
          key={step.id}
          path={step.path}
          element={<StepComponent stepId={step.id} />}
        />
      ))}
      <Route path="/rb/proof" element={<BuildTrackProof />} />

      {/* App Routes (With public Navigation) */}
      <Route path="/" element={<AppLayout><Home /></AppLayout>} />
      <Route path="/builder" element={<AppLayout><Builder /></AppLayout>} />
      <Route path="/preview" element={<AppLayout><Preview /></AppLayout>} />
      <Route path="/proof" element={<AppLayout><AppProof /></AppLayout>} />
    </Routes>
  );
}

export default App;
