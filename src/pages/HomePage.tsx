import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { CarouselSlide } from '../types/carouselSlide';
import type { GalleryEvent } from '../types/event';
import SectionHeading from '../components/SectionHeading';
import GeometricDecor from '../components/GeometricDecor';

const SLIDES: CarouselSlide[] = [
  {
    id: 1,
    title: 'Impressionist Dreams',
    subtitle: 'Explore the movement that changed art forever',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1600&h=900&fit=crop',
  },
  {
    id: 2,
    title: 'Modern Abstractions',
    subtitle: 'Bold colors and forms that challenge perception',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1600&h=900&fit=crop',
  },
  {
    id: 3,
    title: 'Sculptural Elegance',
    subtitle: 'Where form meets the poetry of space',
    imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1600&h=900&fit=crop',
  },
];

const UPCOMING_EVENTS: GalleryEvent[] = [
  {
    id: 1,
    title: 'Abstract Visions: A New Perspective',
    description:
      'A curated exhibition featuring emerging abstract artists from around the globe. Experience art that pushes boundaries.',
    date: 'Mar 15, 2026',
    time: '6:00 PM - 9:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'The Art of Light & Shadow',
    description:
      'An immersive installation exploring how light transforms space. Interactive elements invite visitors to become part of the art.',
    date: 'Apr 2, 2026',
    time: '10:00 AM - 5:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Sculpture in the Garden',
    description:
      'Our annual outdoor exhibition returns with monumental works set among the gallery gardens. Free and open to all.',
    date: 'Apr 20, 2026',
    time: '11:00 AM - 7:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&h=400&fit=crop',
  },
];

const SLIDE_INTERVAL_MS = 5000;

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  function handlePrevSlide() {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }

  function handleGoToSlide(index: number) {
    setCurrentSlide(index);
  }

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  }

  useEffect(() => {
    const timer = setInterval(handleNextSlide, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [handleNextSlide]);

  return (
    <div>
      {/* Hero Carousel */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-gallery-950">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gallery-950 via-gallery-950/40 to-transparent" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-6 pb-20">
            <h1 className="font-display text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
              {SLIDES[currentSlide].title}
            </h1>
            <p className="mt-4 max-w-lg text-lg text-gray-300">
              {SLIDES[currentSlide].subtitle}
            </p>
            <Link
              to="/gallery"
              className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-semibold text-gallery-950 transition-colors hover:bg-accent-light"
            >
              Explore Gallery
            </Link>
          </div>
        </div>

        {/* Carousel controls */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Previous slide"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Next slide"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => handleGoToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-accent' : 'w-2 bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative overflow-hidden bg-gallery-900 py-24">
        <GeometricDecor variant="both" />
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <SectionHeading
            title="Stay Inspired"
            subtitle="Join our newsletter for exclusive previews, artist interviews, and invitations to private viewings."
            isDark
          />
          {isSubscribed ? (
            <p className="text-lg font-medium text-accent">
              Thank you for subscribing! We'll be in touch soon.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="mx-auto mt-8 flex max-w-md gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-accent"
              />
              <button
                type="submit"
                className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-gallery-950 transition-colors hover:bg-accent-light"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            title="Upcoming Events"
            subtitle="Mark your calendar for these extraordinary art experiences."
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {UPCOMING_EVENTS.map((event) => (
              <div
                key={event.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[3/2] overflow-hidden bg-gallery-100">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-accent">
                    <span>{event.date}</span>
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    <span>{event.time}</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold text-gallery-950">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
