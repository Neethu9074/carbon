import { useState, useEffect } from 'react';

import createScale from 'in-services/scale';

export default function useTimeConfigUpdatingScale(timeConfig, width = 100) {
  const [scale, setScale] = useState(() => {
    const scale = createScale();
    updateScale(scale, timeConfig, width);
    return scale;
  });
  useEffect(
    () => {
      updateScale(scale, timeConfig, width);
      setScale(scale);
    },
    [timeConfig.to, timeConfig.windowSize, width]
  );
  return scale;
}

function updateScale(scale, timeConfig, width) {
  const to = timeConfig.to || Date.now();
  scale.setDomainFrom(to - timeConfig.windowSize);
  scale.setDomainTo(to);
  scale.setRangeFrom(0);
  scale.setRangeTo(width);
}
