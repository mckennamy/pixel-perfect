const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-burg">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(184,151,90,0.18) 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 20% 20%, rgba(255,240,220,0.06) 0%, transparent 60%),
            linear-gradient(175deg, #3A0D1A 0%, #5C1A28 40%, #4A1522 70%, #2A0A12 100%)
          `,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(10,3,6,0.55) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 text-center px-8 max-w-[780px]"
        style={{ animation: 'heroFadeUp 1.4s cubic-bezier(0.22, 1, 0.36, 1) both' }}
      >
        <p className="font-kicker text-[0.7rem] tracking-[0.28em] uppercase text-gold-light mb-6">
          A Wedding in Tuscany
        </p>

        <div className="w-20 h-px mx-auto my-5" style={{ background: 'linear-gradient(90deg, transparent, hsl(36, 42%, 65%), transparent)' }} />

        <h1 className="font-display font-light leading-[1.05] text-gold-pale flex flex-col gap-[0.1em]">
          <span className="text-[clamp(3.5rem,8vw,6.5rem)] tracking-[0.02em]">Your Journey</span>
          <span className="italic text-[clamp(4rem,9vw,7.5rem)]" style={{ color: '#F5E8D0' }}>to Lucca</span>
        </h1>

        <div className="w-20 h-px mx-auto my-5" style={{ background: 'linear-gradient(90deg, transparent, hsl(36, 42%, 65%), transparent)' }} />

        <p className="font-kicker text-[0.72rem] tracking-[0.24em] text-gold-light mt-1">
          May 19 – 25, 2027
        </p>

        <p className="font-body italic text-[1.15rem] max-w-[520px] mx-auto mt-7 leading-[1.7]" style={{ color: 'rgba(248, 243, 236, 0.65)' }}>
          Everything you need to find your way to us — flights, connections, and the final road into the walled city.
        </p>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        style={{ animation: 'heroFadeUp 1.8s 0.5s cubic-bezier(0.22, 1, 0.36, 1) both' }}
      >
        <span className="font-kicker text-[0.6rem] tracking-[0.22em]" style={{ color: 'rgba(212, 180, 122, 0.55)' }}>
          Scroll
        </span>
        <div
          className="w-px h-[42px]"
          style={{
            background: 'linear-gradient(to bottom, hsl(36, 42%, 65%), transparent)',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  );
};

export default Hero;
