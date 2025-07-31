// pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // <--- Import the Footer component

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen"> {/* Make main div flex column to push footer to bottom */}
      <Navbar />
      <main className="flex-grow"> {/* main tag for semantic HTML, flex-grow to push footer down */}
        <Component {...pageProps} />
      </main>
      <Footer /> {/* The Footer will be rendered on every page */}
    </div>
  );
}