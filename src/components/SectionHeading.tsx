interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  isDark?: boolean;
}

export default function SectionHeading({ title, subtitle, isDark = false }: SectionHeadingProps) {
  return (
    <div className="mb-12 text-center">
      <h2
        className={`font-display text-4xl font-bold tracking-tight sm:text-5xl ${
          isDark ? 'text-white' : 'text-gallery-950'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mx-auto mt-4 max-w-2xl text-lg leading-relaxed ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {subtitle}
        </p>
      )}
      <div className="mx-auto mt-6 h-px w-16 bg-accent" />
    </div>
  );
}
