import { Link } from 'react-router-dom';
import GeometricDecor from './GeometricDecor';

export default function ArtworkNotFound() {
  return (
    <section className="relative overflow-hidden bg-gallery-950 py-32">
      <GeometricDecor />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <h1 className="font-display text-6xl font-bold text-white">404</h1>
        <p className="mt-4 text-xl text-gray-400">Artwork not found</p>
        <p className="mt-2 text-gray-500">
          The piece you're looking for isn't in our collection, or the link may
          be incorrect.
        </p>
        <Link
          to="/gallery"
          className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-semibold text-gallery-950 transition-colors hover:bg-accent-light"
        >
          Browse Gallery
        </Link>
      </div>
    </section>
  );
}
