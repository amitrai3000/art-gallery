import type { TeamMember } from '../types/teamMember';
import SectionHeading from '../components/SectionHeading';
import GeometricDecor from '../components/GeometricDecor';

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: 'Elena Vasquez',
    role: 'Founding Director',
    bio: 'With over 25 years in the art world, Elena brings visionary leadership and a passion for making art accessible to everyone.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Chief Curator',
    bio: 'Marcus specializes in contemporary and modern art, curating exhibitions that spark dialogue and inspire new ways of seeing.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Sophie Laurent',
    role: 'Education Director',
    bio: 'A former art history professor, Sophie designs programs that connect visitors of all ages with the transformative power of art.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'James Okafor',
    role: 'Exhibition Designer',
    bio: 'James crafts immersive gallery spaces where architecture and art merge to create unforgettable experiences.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gallery-950 py-32">
        <GeometricDecor variant="both" />
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <h1 className="font-display text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
            About Us
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            Where art meets community. We believe every masterpiece has a story, and every visitor
            deserves to be part of it.
          </p>
          <div className="mx-auto mt-8 h-px w-16 bg-accent" />
        </div>
      </section>

      {/* History & Mission */}
      <section className="relative overflow-hidden bg-white py-24">
        <GeometricDecor variant="left" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold text-gallery-950 sm:text-4xl">
                Our Story
              </h2>
              <div className="mt-2 h-px w-12 bg-accent" />
              <p className="mt-6 leading-relaxed text-gray-600">
                Founded in 1987 in the heart of the Arts District, Art Gallery began as a small
                exhibition space with a bold vision: to bridge the gap between world-class art and
                everyday audiences. What started as a single room with rotating local artists has
                grown into one of the region's most celebrated cultural destinations.
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                Over three decades, we have hosted more than 500 exhibitions, welcomed millions of
                visitors, and built partnerships with museums and private collections across five
                continents. Our permanent collection now features over 2,000 works spanning five
                centuries of artistic achievement.
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                Today, we continue to push boundaries — bringing emerging voices alongside
                established masters, integrating technology with tradition, and ensuring that art
                remains a living, breathing force in our community.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gallery-100">
                <img
                  src="https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&h=1000&fit=crop"
                  alt="Art Gallery interior with visitors"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-gallery-950 px-8 py-6 text-white shadow-xl">
                <p className="font-display text-3xl font-bold text-accent">37+</p>
                <p className="mt-1 text-sm text-gray-400">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gallery-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-gallery-950 sm:text-4xl">
              Our Mission
            </h2>
            <div className="mx-auto mt-4 h-px w-12 bg-accent" />
            <p className="mt-6 font-display text-lg italic leading-relaxed text-gray-700">
              "To inspire, educate, and connect communities through the transformative power of art
              — making extraordinary creative experiences accessible to all."
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                title: 'Inspire',
                description:
                  'We curate exhibitions that spark imagination and invite visitors to see the world through new eyes.',
              },
              {
                title: 'Educate',
                description:
                  'Through workshops, lectures, and guided tours, we make art history and practice approachable for everyone.',
              },
              {
                title: 'Connect',
                description:
                  'We bring artists and audiences together, fostering dialogue that enriches both the creative process and community life.',
              },
            ].map((pillar) => (
              <div key={pillar.title} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <h3 className="font-display text-xl font-semibold text-gallery-950">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative overflow-hidden bg-gallery-950 py-24">
        <GeometricDecor variant="right" />
        <div className="relative mx-auto max-w-6xl px-6">
          <SectionHeading
            title="Our Team"
            subtitle="The passionate people behind every exhibition and experience."
            isDark
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="group rounded-2xl border border-white/5 bg-white/5 p-6 text-center backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-2 border-accent/30">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-accent">
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
