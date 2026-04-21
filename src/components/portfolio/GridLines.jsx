export default function GridLines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Vertical source lines */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 w-px bg-border/20"
          style={{ left: `${(i + 1) * (100 / 13)}%` }}
        />
      ))}
      
      {/* Scan line effect */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scan-line" />
      
      {/* Corner markers */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-primary/30" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-primary/30" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-primary/30" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-primary/30" />
    </div>
  );
}