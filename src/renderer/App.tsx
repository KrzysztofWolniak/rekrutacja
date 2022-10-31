import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { renderToStaticMarkup } from 'react-dom/server';
import AddFile from './pages/AddFile';
import { StartPage } from './pages/StartPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import Raport from './components/Raport';
import WelcomePage from './pages/WelcomePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/cennik"
          element={<AddFile firstTime fileType="cennik" />}
        />
        <Route path="/Start" element={<StartPage />} />
        <Route path="/NowyCennik" element={<AddFile fileType="cennik" />} />
        <Route path="/ListaZamowien" element={<AddFile />} />
        <Route path="/" element={<WelcomePage />} />
      </Routes>
    </Router>
  );
}
