// App.tsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
