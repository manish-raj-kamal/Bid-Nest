const LiveBadge = ({ text = 'LIVE NOW', count }) => {
  return (
    <div className="inline-flex items-center gap-3 bg-white border border-border rounded-full px-4 py-2">
      <span className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
        </span>
        <span className="text-xs font-semibold tracking-wider text-accent uppercase">{text}</span>
      </span>
      {count && (
        <span className="text-xs font-medium text-text-secondary">{count}</span>
      )}
    </div>
  );
};

export default LiveBadge;
