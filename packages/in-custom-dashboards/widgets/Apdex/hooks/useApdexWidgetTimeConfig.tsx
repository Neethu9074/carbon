/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useMemo } from 'react';

import { TimeConfig } from '@instana/types';

import useTimeConfig from 'in-hooks/useTimeConfig';
import { days } from 'in-services/time/time';

export default function useApdexWidgetTimeConfig(isPreview?: boolean): TimeConfig {
  const originalTimeConfig = useTimeConfig();
  return useMemo(() => {
    if (isPreview) {
      return {
        windowSize: days.toMillis(7),
        autoRefresh: false
      };
    }

    return originalTimeConfig;
  }, [isPreview, originalTimeConfig]);
}
