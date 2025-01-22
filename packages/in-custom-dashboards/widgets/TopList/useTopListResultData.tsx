/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TimeConfig, UnifiedMetricConfigurationUnion } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { getTimeConfigBasedOnMetricConfiguration } from 'in-custom-dashboards/widgets/_shared/lastTimeConfig';
import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';

const useTopListResultData = (config: any, timeConfig: TimeConfig) => {
  const timeConfigExtendedForLiveMode = extendWindowSizeOnLiveMode(timeConfig);
  const usedTimeConfig = getTimeConfigBasedOnMetricConfiguration(
    config.metricConfiguration as UnifiedMetricConfigurationUnion,
    timeConfigExtendedForLiveMode
  );

  const metrics = {
    list: {
      ...config.metricConfiguration,
      timeShift: {
        offset: 0
      },
      timeConfig: usedTimeConfig,
      resultType: 'SINGLE_NUMBER'
    }
  };

  return useObservable(() => getUnifiedMetrics({ metrics }), [timeConfig, config]);
};

export default useTopListResultData;
