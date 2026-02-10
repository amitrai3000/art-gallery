import { useState } from 'react';

interface Artwork {
  id: number;
  title: string;
  artist: string;
  year: string;
  medium: string;
  imageUrl: string;
}

const ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: 'Starry Night',
    artist: 'Vincent van Gogh',
    year: '1889',
    medium: 'Oil on canvas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
  },
  {
    id: 2,
    title: 'The Great Wave off Kanagawa',
    artist: 'Katsushika Hokusai',
    year: '1831',
    medium: 'Woodblock print',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/800px-Tsunami_by_hokusai_19th_century.jpg',
  },
  {
    id: 3,
    title: 'Girl with a Pearl Earring',
    artist: 'Johannes Vermeer',
    year: '1665',
    medium: 'Oil on canvas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg',
  },
  {
    id: 4,
    title: 'The Birth of Venus',
    artist: 'Sandro Botticelli',
    year: '1485',
    medium: 'Tempera on canvas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/800px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
  },
  {
    id: 5,
    title: 'The Persistence of Memory',
    artist: 'Salvador Dalí',
    year: '1931',
    medium: 'Oil on canvas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg',
  },
  {
    id: 6,
    title: 'A Sunday Afternoon on the Island of La Grande Jatte',
    artist: 'Georges Seurat',
    year: '1886',
    medium: 'Oil on canvas',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/800px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg',
  },
];

interface LightboxProps {
  artwork: Artwork;
  onClose: () => void;
}

function Lightbox({ artwork, onClose }: LightboxProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
        >
          &times;
        </button>
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="max-h-[70vh] w-full object-contain"
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold">{artwork.title}</h2>
          <p className="mt-1 text-gray-600">{artwork.artist}, {artwork.year}</p>
          <p className="mt-1 text-sm text-gray-400">{artwork.medium}</p>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  return (
    <div>
      <h1 className="text-4xl font-bold">Gallery</h1>
      <p className="mt-4 text-gray-600">
        Browse our curated collection of masterpieces from around the world.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ARTWORKS.map((artwork) => (
          <button
            key={artwork.id}
            onClick={() => setSelectedArtwork(artwork)}
            className="group overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{artwork.title}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {artwork.artist}, {artwork.year}
              </p>
            </div>
          </button>
        ))}
      </div>

      {selectedArtwork && (
        <Lightbox
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </div>
  );
}
