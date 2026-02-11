import { useParams, Link } from 'react-router-dom';
import { ARTWORKS } from '../data/artworks';
import GeometricDecor from '../components/GeometricDecor';
import ArtworkNotFound from '../components/ArtworkNotFound';

export default function ArtworkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const artwork = Number.isNaN(numericId)
    ? undefined
    : ARTWORKS.find((a) => a.id === numericId);

  if (!artwork) {
    return <ArtworkNotFound />;
  }

  return (
    <div>
      {/* Hero detail section */}
      <section className="relative overflow-hidden bg-gallery-950 py-24">
        <GeometricDecor />
        <div className="relative mx-auto max-w-6xl px-6">
          {/* Back link */}
          <Link
            to="/gallery"
            className="mb-10 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-accent"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Back to Gallery
          </Link>

          {/* Two-column layout */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            {/* Artwork image */}
            <div className="overflow-hidden rounded-2xl bg-gallery-900 shadow-2xl">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>

            {/* Metadata panel */}
            <div className="flex flex-col justify-center">
              <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
                {artwork.title}
              </h1>
              <p className="mt-4 text-xl text-gray-300">{artwork.artist}</p>
              <div className="mt-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-accent">
                <span>{artwork.year}</span>
                <span className="h-1 w-1 rounded-full bg-accent" />
                <span>{artwork.medium}</span>
              </div>
              <div className="mt-6 h-px w-16 bg-accent" />
              <p className="mt-6 text-base leading-relaxed text-gray-400">
                {artwork.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
