import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Home from './pages/Home';
import Lists from './pages/Lists';
import Tips from './pages/Tips';
import Settings from './pages/Settings';
import Stats from './pages/Stats';
import CreateChecklist from './pages/CreateChecklist';
import ChecklistDetail from './pages/ChecklistDetail';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/I18nContext';

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="lists" element={<Lists />} />
          <Route path="tips" element={<Tips />} />
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />
          <Route path="checklist/:id" element={<ChecklistDetail />} />
          <Route path="create" element={<CreateChecklist />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App;
