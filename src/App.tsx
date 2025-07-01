import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SuccessPage } from './pages/SuccessPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/success" element={<SuccessPage />} />
        {/* We will add the protected chat route here later */}
        {/* <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} /> */}
      </Routes>
    </Router>
  );
}

export default App;