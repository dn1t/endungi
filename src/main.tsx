import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SkeletonTheme } from 'react-loading-skeleton';
import Home from './home';
import User from './pages/user';
import 'pretendard/dist/web/variable/pretendardvariable.css';
import 'tailwindcss/tailwind.css';

const Main = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) return;

    setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => setIsDarkMode(event.matches));
  });

  return (
    <BrowserRouter>
      {/* <SkeletonTheme baseColor='#202020' highlightColor='#444'> */}
      <SkeletonTheme
        baseColor={isDarkMode ? '#202020' : undefined}
        highlightColor={isDarkMode ? '#444' : undefined}
      >
        <AnimatePresence>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/user/:username' element={<User />} />
          </Routes>
        </AnimatePresence>
      </SkeletonTheme>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Main />);
