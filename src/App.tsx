import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import VideoConverter from './components/VideoConverter';
import BackgroundAnimation from './components/BackgroundAnimation';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <Routes>
          <Route path="/" element={
            <>
              <BackgroundAnimation variant="login" />
              <LoginForm />
            </>
          } />
          <Route
            path="/converter"
            element={
              <PrivateRoute>
                <BackgroundAnimation variant="converter" />
                <VideoConverter />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App