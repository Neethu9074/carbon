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
  scale.setDomainFrom(timeConfig.to - timeConfig.windowSize);
  scale.setDomainTo(timeConfig.to);
  scale.setRangeFrom(0);
  scale.setRangeTo(width);
}
