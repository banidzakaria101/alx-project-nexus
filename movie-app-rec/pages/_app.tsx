// pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Navbar from '@/components/Navbar';

export default function App({ Component, pageProps }: AppProps) {
  const currentGenre = pageProps.currentGenre as string | undefined;

  return (
    <>
      {/* Pass currentGenre to Navbar */}
      <Navbar currentGenre={currentGenre} />
      <Component {...pageProps} />
    </>
  );
}