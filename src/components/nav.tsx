import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Nav: React.FC = () => {
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    document.addEventListener('scroll', () => setScrollTop(document.documentElement.scrollTop));
    setScrollTop(document.documentElement.scrollTop);
  }, []);

  return (
    <nav
      className={`sticky top-0 bg-white/70 dark:bg-black/70 border-b ${
        scrollTop === 0 ? 'border-transparent' : 'border-slate-100/70 dark:border-slate-900/70'
      } transition-colors duration-300 z-50 backdrop-blur-md`}
    >
      <div className='flex items-center max-w-5xl mx-auto px-5 sm:px-10 xl:px-0 py-3.5'>
        <Link to='/'>
          <h1 className='font-semibold text-slate-800 dark:text-slate-100 text-[22px]'>endungi.xyz</h1>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
