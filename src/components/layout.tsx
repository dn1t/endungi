import { motion } from 'framer-motion';

const Layout: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <motion.main
      variants={{
        hidden: { opacity: 0, x: 0, y: -50 },
        enter: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: 0, y: 100 },
      }}
      initial='hidden'
      animate='enter'
      exit='exit'
      transition={{ type: 'spring', duration: 1, bounce: 0.5 }}
      className='overflow-hidden'
    >
      {children}
    </motion.main>
  );
};

export default Layout;
