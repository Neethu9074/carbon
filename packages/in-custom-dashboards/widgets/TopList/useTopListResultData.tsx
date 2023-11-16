/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';

const useTopListResultData = (config: any, timeConfig: TimeConfig) => {
  const timeConfigExtendedForLiveMode = extendWindowSizeOnLiveMode(timeConfig);

  const metrics = {
    list: {
      ...config.metricConfiguration,
      timeShift: {
        offset: 0
      },
      timeConfig: timeConfigExtendedForLiveMode,
      resultType: 'SINGLE_NUMBER'
    }
  };

  return useObservable(() => getUnifiedMetrics({ metrics }), [timeConfig, config]);
};

export default useTopListResultData;
