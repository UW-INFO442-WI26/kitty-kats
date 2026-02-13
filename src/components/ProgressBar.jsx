import { useEffect, useMemo, useState } from 'react';

function ProgressBar({ value = 0, height = 10, showLabel = true }) {
  const clampedValue = useMemo(() => Math.min(100, Math.max(0, value)), [value]);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimatedValue(clampedValue));
    return () => cancelAnimationFrame(id);
  }, [clampedValue]);

  return (
    <div className="progress-wrap">
      {showLabel ? (
        <div className="progress-label">
          <span>Progress</span>
          <span>{Math.round(clampedValue)}%</span>
        </div>
      ) : null}
      <div className="progress-track" style={{ height }}>
        <div className="progress-fill" style={{ width: `${animatedValue}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;
