import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { useApp } from './context/AppContext';
import { sfx } from './hooks/useSfx';
import BackgroundCanvas from './components/BackgroundCanvas';
import HomeScreen from './screens/HomeScreen';
import FilterScreen from './screens/FilterScreen';
import ResultsScreen from './screens/ResultsScreen';
import FilterModifyScreen from './screens/FilterModifyScreen';
import CardDetailScreen from './screens/CardDetailScreen';
import VictimDetailScreen from './screens/VictimDetailScreen';
import SoundScreen from './screens/SoundScreen';

const SCREEN_DEPTH = ['/', '/filter', '/modify', '/results', '/sound'];

function AnimatedRoutes() {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const prev = prevPathRef.current;
    const curr = location.pathname;
    prevPathRef.current = curr;

    const prevIdx = SCREEN_DEPTH.findIndex(p => prev === p || prev.startsWith(p + '/'));
    const currIdx = SCREEN_DEPTH.findIndex(p => curr === p || curr.startsWith(p + '/'));
    const goingForward = currIdx >= prevIdx;

    const active = document.querySelector('.screen.active');
    if (active) {
      const cls = goingForward ? 'slide-in-right' : 'slide-in-left';
      active.classList.add(cls);
      setTimeout(() => active.classList.remove(cls), 350);
    }
  }, [location.pathname]);

  return (
    <div className="screens">
      <Routes location={location}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/filter" element={<FilterScreen />} />
        <Route path="/results" element={<ResultsScreen />} />
        <Route path="/modify" element={<FilterModifyScreen />} />
        <Route path="/card/:id" element={<CardDetailScreen />} />
        <Route path="/victim" element={<VictimDetailScreen />} />
        <Route path="/sound" element={<SoundScreen />} />
      </Routes>
    </div>
  );
}

export default function App() {
  const { soundTheme } = useApp();

  useEffect(() => {
    setTimeout(() => sfx('execute', soundTheme), 500);
  }, []);

  return (
    <div className="phone">
      <BackgroundCanvas />
      <AnimatedRoutes />
    </div>
  );
}
