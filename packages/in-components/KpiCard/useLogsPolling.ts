/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect, useRef, useState } from 'react';
import { isEqual } from 'lodash';

import { just, Observable } from '@instana/observables';
import { Result, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import getUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { UnifiedMetricConfiguration } from 'in-types';
import useTimeConfig from 'in-hooks/useTimeConfig';

export const LIVE_MODE_REFRESH_INTERVAL = 5000;

type MetricsConfigurations = { [p: string]: UnifiedMetricConfiguration };

export interface UseLogsPollingParams {
  metrics: MetricsConfigurations;
}

/** Logging doesn't support live mode in the backend, this hook implements autoRefresh via polling **/
export const useLogsPolling = ({ metrics }: UseLogsPollingParams) => {
  const currentDataToTime = useRef<number | null | undefined>();
  const metricsRef = useRef<MetricsConfigurations>(metrics);

  const [fetchedResult, setFetchedResult] = useState<null | Result<UnifiedMetricsResult[]>>(null);
  const [update, setUpdate] = useState<{}>({});

  const timeConfig = useTimeConfig();
  const prevTimeConfig = useRef<TimeConfig>(timeConfig);

  const isLogConfig = Object.values(metrics)
    .map(metric => metric.source)
    .includes('LOG');
  const isLiveMode = Object.values(metrics)[0].timeConfig.autoRefresh;
  const isPollingActive = isLogConfig && isLiveMode;

  useEffect(() => {
    if (!isEqual(timeConfig, prevTimeConfig.current)) {
      setFetchedResult(null);
    }
    prevTimeConfig.current = timeConfig;
  }, [timeConfig]);

  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  useEffect(() => {
    let intervalId: number | undefined;

    function updateMetrics() {
      const now = Date.now();
      let prevMetrics = metricsRef.current;

      const updatedMetrics = Object.keys(prevMetrics).reduce((acc, key) => {
        const metric = prevMetrics[key];
        const to = key === 'comparison' ? now + prevMetrics.comparison.timeShift.offset : now;
        const updatedMetric = {
          ...metric,
          timeConfig: {
            ...metric.timeConfig,
            to,
            focusedMoment: to,
            autoRefresh: false
          }
        };
        return { ...acc, [key]: updatedMetric };
      }, {});

      metricsRef.current = updatedMetrics;
      setUpdate({});
    }

    if (isPollingActive) {
      updateMetrics();
      intervalId = window.setInterval(updateMetrics, LIVE_MODE_REFRESH_INTERVAL);
    }

    return () => clearInterval(intervalId);
  }, [isPollingActive]);

  const fetchUnifiedMetrics = (): Observable<Result<UnifiedMetricsResult[]> | null> => {
    const metrics = metricsRef.current;
    const metricTo = metrics && Object.values(metrics)[0].timeConfig.to;
    const shouldFetchNewMetrics = metrics && currentDataToTime.current !== metricTo;

    if (shouldFetchNewMetrics) {
      currentDataToTime.current = metricTo;
      return getUnifiedMetrics({ metrics: metrics });
    }

    return just(null);
  };

  const logsResult = useObservable<Result<UnifiedMetricsResult[]> | null, [unknown]>(fetchUnifiedMetrics, [update], {
    resetStateOnObservableChange: false
  });

  //Cache the result so no loading indicator appears while the result is updating
  useEffect(() => {
    if (logsResult?.data) {
      setFetchedResult(logsResult);
    }
  }, [logsResult]);

  return isPollingActive ? fetchedResult : null;
};
