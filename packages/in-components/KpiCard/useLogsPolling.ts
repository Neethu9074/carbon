/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export const LIVE_MODE_REFRESH_INTERVAL = 5000;

import { useCallback, useEffect, useRef, useState } from 'react';

import { just, Observable } from '@instana/observables';
import { Result, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  Config,
  ConfigWithCompanionMetric,
  ConfigWithStaticCompanion
} from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { UnifiedMetricConfiguration } from 'in-types';

type MetricsConfigurations = { [p: string]: UnifiedMetricConfiguration };

export interface UseLogsPollingParams {
  metrics: MetricsConfigurations;
  timeConfig: TimeConfig;
  config:
    | Config<UnifiedMetricConfiguration>
    | ConfigWithCompanionMetric<UnifiedMetricConfiguration>
    | ConfigWithStaticCompanion<UnifiedMetricConfiguration>;
}

/** Logging doesn't support live mode in the backend, this hook implements autoRefresh via polling **/
export const useLogsPolling = ({ metrics, timeConfig, config }: UseLogsPollingParams) => {
  const currentDataToTime = useRef<number | null | undefined>();

  const [metric, setMetric] = useState<MetricsConfigurations>(metrics);
  const [fetchedResult, setFetchedResult] = useState<null | Result<UnifiedMetricsResult[]>>(null);

  const isLogConfig = config.metricConfiguration.source === 'LOG';
  const isLiveMode = timeConfig.autoRefresh;
  const isPollingActive = isLogConfig && isLiveMode;

  useEffect(() => {
    let intervalId: number | undefined;

    function updateMetrics() {
      setMetric(prevMetrics => {
        if (!prevMetrics) return prevMetrics;

        const now = Date.now();

        const updatedMetrics = Object.keys(prevMetrics).reduce((acc, key) => {
          if (key === 'comparison') {
            return { ...acc, [key]: prevMetrics[key] }; // Skip "comparison" key
          }
          const metric = prevMetrics[key];
          const updatedMetric = {
            ...metric,
            timeConfig: {
              ...metric.timeConfig,
              to: now,
              focusedMoment: now,
              autoRefresh: false
            }
          };
          return { ...acc, [key]: updatedMetric };
        }, {});

        return { ...updatedMetrics } as MetricsConfigurations;
      });
    }

    if (isPollingActive) {
      updateMetrics();
      intervalId = window.setInterval(updateMetrics, LIVE_MODE_REFRESH_INTERVAL);
    }

    return () => clearInterval(intervalId);
  }, [config, timeConfig, isPollingActive]);

  const fetchUnifiedMetrics = useCallback(
    ([metric]: [MetricsConfigurations | null]): Observable<Result<UnifiedMetricsResult[]> | null> => {
      const metricTo = metric && Object.values(metric)[0].timeConfig.to;
      const shouldFetchNewMetrics = metric && currentDataToTime.current !== metricTo;

      if (shouldFetchNewMetrics) {
        currentDataToTime.current = metricTo;
        return getUnifiedMetrics({ metrics: metric });
      }

      return just(null);
    },
    []
  );

  const logsResult = useObservable<Result<UnifiedMetricsResult[]> | null, [MetricsConfigurations | null]>(
    fetchUnifiedMetrics,
    [metric],
    { resetStateOnObservableChange: false }
  );

  //Cache the result so no loading indicator appears while the result is updating
  useEffect(() => {
    if (logsResult?.data) {
      setFetchedResult(logsResult);
    }
  }, [logsResult]);

  //Clear the result on time config changes
  useEffect(() => {
    setFetchedResult(null);
  }, [timeConfig]);

  return isPollingActive ? fetchedResult : null;
};
