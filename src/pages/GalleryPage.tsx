import { Link } from 'react-router-dom';
import { ARTWORKS } from '../data/artworks';
import SectionHeading from '../components/SectionHeading';
import GeometricDecor from '../components/GeometricDecor';

export default function GalleryPage() {
  return (
    <div>
      {/* Gallery header */}
      <section className="relative overflow-hidden bg-gallery-950 py-24">
        <GeometricDecor />
        <div className="relative mx-auto max-w-6xl px-6">
          <SectionHeading
            title="Gallery"
            subtitle="Browse our curated collection of masterpieces from around the world."
            isDark
          />
        </div>
      </section>

      {/* Artwork grid */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {ARTWORKS.map((artwork) => (
              <Link
                key={artwork.id}
                to={`/artwork/${artwork.id}`}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gallery-100">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-gallery-950">
                    {artwork.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {artwork.artist}, {artwork.year}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
