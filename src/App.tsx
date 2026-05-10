import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import LogWorkout from './pages/LogWorkout';
import History from './pages/History';
import Quests from './pages/Quests';
import Achievements from './pages/Achievements';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/log" element={<LogWorkout />} />
            <Route path="/history" element={<History />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/achievements" element={<Achievements />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
