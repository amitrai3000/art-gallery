import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import GeometricDecor from '../components/GeometricDecor';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const INITIAL_FORM_DATA: FormData = { name: '', email: '', message: '' };

const GALLERY_HOURS = [
  { day: 'Monday', hours: 'Closed' },
  { day: 'Tuesday - Friday', hours: '10:00 AM - 6:00 PM' },
  { day: 'Saturday', hours: '10:00 AM - 8:00 PM' },
  { day: 'Sunday', hours: '12:00 PM - 5:00 PM' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitted(true);
    setFormData(INITIAL_FORM_DATA);
  }

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gallery-950 py-32">
        <GeometricDecor variant="both" />
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <h1 className="font-display text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            We'd love to hear from you. Whether you have a question about an exhibition, want to
            plan a visit, or are interested in collaboration — reach out.
          </p>
          <div className="mx-auto mt-8 h-px w-16 bg-accent" />
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold text-gallery-950">Send a Message</h2>
              <div className="mt-2 h-px w-12 bg-accent" />

              {isSubmitted ? (
                <div className="mt-8 rounded-2xl border border-accent/20 bg-accent/5 p-8">
                  <h3 className="font-display text-xl font-semibold text-gallery-950">
                    Message Sent
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 text-sm font-medium text-accent hover:text-accent-dark"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gallery-950">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gallery-50 px-4 py-3 text-sm text-gallery-950 outline-none transition-colors focus:border-accent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gallery-950">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-gallery-50 px-4 py-3 text-sm text-gallery-950 outline-none transition-colors focus:border-accent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gallery-950">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gallery-50 px-4 py-3 text-sm text-gallery-950 outline-none transition-colors focus:border-accent"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-gallery-950 transition-colors hover:bg-accent-light"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-10">
              <div>
                <h3 className="font-display text-xl font-semibold text-gallery-950">
                  Visit the Gallery
                </h3>
                <div className="mt-2 h-px w-12 bg-accent" />
                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <p className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                    </svg>
                    <span>
                      123 Gallery Avenue
                      <br />
                      Arts District, New York, NY 10001
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <span>(212) 555-0187</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <span>hello@artgallery.com</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold text-gallery-950">
                  Gallery Hours
                </h3>
                <div className="mt-2 h-px w-12 bg-accent" />
                <div className="mt-4 space-y-2">
                  {GALLERY_HOURS.map((item) => (
                    <div key={item.day} className="flex justify-between text-sm">
                      <span className="font-medium text-gallery-950">{item.day}</span>
                      <span className={item.hours === 'Closed' ? 'text-red-500' : 'text-gray-600'}>
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-display text-xl font-semibold text-gallery-950">
                  Admission
                </h3>
                <div className="mt-2 h-px w-12 bg-accent" />
                <p className="mt-4 text-sm text-gray-600">
                  General admission is free. Special exhibitions may require timed-entry tickets.
                  Group tours available by appointment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="relative overflow-hidden bg-gallery-950 py-24">
        <GeometricDecor variant="right" />
        <div className="relative mx-auto max-w-6xl px-6">
          <SectionHeading title="Find Us" subtitle="Located in the heart of the Arts District." isDark />
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="flex aspect-[16/7] items-center justify-center bg-gallery-800">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-accent/40" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
                <p className="mt-4 font-display text-lg font-semibold text-white/60">
                  Interactive Map
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  123 Gallery Avenue, Arts District, NY 10001
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
