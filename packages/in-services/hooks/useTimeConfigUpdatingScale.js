import { useState } from 'react';

import createScale from 'in-services/scale';

export default function useTimeConfigUpdatingScale(timeConfig, width = 100) {
  const [scale] = useState(() => {
    const scale = createScale();
    updateScale(scale, timeConfig, width);
    return scale;
  });
  updateScale(scale, timeConfig, width);
  return scale;
}

function updateScale(scale, timeConfig, width) {
  const to = timeConfig.to || Date.now();
  scale.setDomainFrom(to - timeConfig.windowSize);
  scale.setDomainTo(to);
  scale.setRangeFrom(0);
  scale.setRangeTo(width);
}
