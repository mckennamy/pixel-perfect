const OrnamentDivider = () => (
  <div className="flex items-center gap-5 max-w-[360px] mx-auto px-8">
    <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(36,35%,54%), transparent)' }} />
    <div className="text-[0.55rem] text-gold leading-none">◆</div>
    <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, hsl(36,35%,54%), transparent)' }} />
  </div>
);

export default OrnamentDivider;
