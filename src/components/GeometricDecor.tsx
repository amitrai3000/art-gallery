interface GeometricDecorProps {
  variant?: 'left' | 'right' | 'both';
}

export default function GeometricDecor({ variant = 'both' }: GeometricDecorProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {(variant === 'left' || variant === 'both') && (
        <>
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full border border-accent/10" />
          <div className="absolute -left-10 top-1/3 h-40 w-40 rounded-full border border-white/5" />
        </>
      )}
      {(variant === 'right' || variant === 'both') && (
        <>
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full border border-accent/10" />
          <div className="absolute right-10 top-20 h-24 w-24 rounded-full bg-accent/5" />
        </>
      )}
    </div>
  );
}
