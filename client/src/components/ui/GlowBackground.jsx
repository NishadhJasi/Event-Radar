export default function GlowBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse-glow" />
      <div
        className="absolute top-1/3 -right-32 w-[450px] h-[450px] rounded-full bg-fuchsia-600/15 blur-[100px] animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.08),transparent_50%)]" />
    </div>
  );
}
