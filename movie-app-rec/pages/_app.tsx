// pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const currentGenre = pageProps.currentGenre as string | null | undefined;

  return (
  
    <div className="flex flex-col min-h-screen bg-black"> 
<Navbar currentGenre={currentGenre} {...pageProps} /> 
  
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main
          key={router.asPath} 
          className="flex-grow" 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -10 }} 
          transition={{ duration: 0.3, ease: "easeInOut" }} 
        >
          <Component {...pageProps} />
        </motion.main>
      </AnimatePresence>

      
      <Footer />
    </div>
  );
}