const Footer = () => (
  <footer className="bg-burg relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none" style={{
      background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(184,151,90,0.12) 0%, transparent 70%),
                   radial-gradient(ellipse 40% 50% at 20% 20%, rgba(255,240,220,0.04) 0%, transparent 60%)`
    }} />
    <div className="relative z-10 max-w-[1120px] mx-auto py-24 px-8 text-center">
      <div className="text-[0.7rem] text-gold mb-6 tracking-[0.5em]">◆</div>
      <p className="font-display text-[clamp(2rem,4vw,3.2rem)] font-light italic text-gold-pale leading-[1.2] mb-3">
        We cannot wait to see you in Lucca.
      </p>
      <p className="font-kicker text-[0.65rem] tracking-[0.24em] text-gold-light uppercase">
        May 22, 2027 · Lucca, Tuscany, Italy
      </p>
      <div className="w-[60px] h-px mx-auto my-8" style={{ background: 'linear-gradient(90deg, transparent, hsl(36,35%,54%), transparent)' }} />
      <p className="font-body text-[0.95rem] italic max-w-[480px] mx-auto leading-[1.8]" style={{ color: 'rgba(248, 243, 236, 0.5)' }}>
        Questions about travel? Please don't hesitate to reach out — we want every journey here to be as beautiful as possible.
      </p>
    </div>
  </footer>
);

export default Footer;
