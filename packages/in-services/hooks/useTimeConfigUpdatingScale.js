/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { useMemo } from 'react';

import createScale from 'in-services/scale';

export default function useTimeConfigUpdatingScale(timeConfig, width = 100) {
  return useMemo(() => {
    const scale = createScale();
    const to = timeConfig.to || Date.now();
    scale.setDomainFrom(to - timeConfig.windowSize);
    scale.setDomainTo(to);
    scale.setRangeFrom(0);
    scale.setRangeTo(width);
    return scale;
  }, [timeConfig.to, timeConfig.windowSize, width]);
}
