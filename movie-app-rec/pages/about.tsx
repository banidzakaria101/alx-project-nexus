import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

function AboutPage() {
  
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex items-center mb-8">
          <Link href="/" className="text-gray-400 hover:text-white mr-4">
            <ArrowLeftIcon className="h-8 w-8" />
          </Link>
          <h1 className="text-3xl font-bold">About CineVerse</h1>
        </div>

        <div className="bg-gray-900 p-8 rounded-lg shadow-xl mb-10">
          
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            CineVerse is a dynamic and intuitive platform for movie enthusiasts to discover and explore films. At its core, it leverages the cutting-edge capabilities of **Astra DB&apos;s vector search with NVIDIA embeddings** to provide highly relevant movie recommendations based on semantic similarity.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Users can effortlessly **search for movies by name**, browse through a paginated list of available titles, or **filter by specific genres** using an interactive navigation bar. A key feature is the ability to delve into detailed information for each film and receive **intelligent recommendations** derived from the selected movie&apos;s characteristics.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            The app also empowers users to curate their personal collection by **saving favorite movies locally** using browser storage. Users have full control over their saved movies, able to **add, delete, and manage** their favorite list from a dedicated &quot;Favorites&quot; section. Designed with a **fully responsive layout**, this application aims to deliver a seamless and engaging user experience across various devices.
          </p>
        </div>

      </div>
    </div>
  );
}

export default AboutPage;