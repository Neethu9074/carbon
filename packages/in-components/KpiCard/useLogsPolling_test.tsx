/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { act, renderHook } from '@testing-library/react-hooks';
import { uniqBy } from 'lodash';

import { just } from '@instana/observables';
import { Result } from '@instana/types';

import realGetUnifiedMetrics, { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { baseConfig, baseResult, baseTimeConfig, metricsBase } from './utils_test';
import { LIVE_MODE_REFRESH_INTERVAL, useLogsPolling } from './useLogsPolling';

jest.mock('in-subscription/getUnifiedMetrics');

const getUnifiedMetrics = realGetUnifiedMetrics as jest.MockedFunction<typeof realGetUnifiedMetrics>;

const NUMBER_OF_INTERVALS = 1;

describe('useLogsPolling', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // Given: Hook is ran with a mocked getUnifiedMetrics
  // When: A number of refresh intervals passes
  // Then: Hook should have returned data for each passed refresh interval
  it('returns a new value every refresh interval', async () => {
    let time = 0;

    getUnifiedMetrics.mockImplementation(() => {
      const data = just({ ...baseResult, time });
      time += LIVE_MODE_REFRESH_INTERVAL;
      return data;
    });

    const logsPollingProps = {
      metrics: metricsBase,
      timeConfig: { ...baseTimeConfig, autoRefresh: true },
      config: baseConfig
    };

    const { result } = renderHook(() => useLogsPolling(logsPollingProps));

    act(() => {
      jest.advanceTimersByTime(LIVE_MODE_REFRESH_INTERVAL * NUMBER_OF_INTERVALS);
    });

    const uniqueResults = uniqBy(result.all, 'time').flatMap(result => (result ? [result] : []));

    //Mocked getUnifiedMetrics is synchronous, so we get the 2 extra results
    expect(uniqueResults).toHaveLength(NUMBER_OF_INTERVALS + 2);
    expect(
      isPropertyAscending<Result<UnifiedMetricsResult>>(
        uniqueResults as unknown as Result<UnifiedMetricsResult>[],
        'time'
      )
    );
  });
});

function isPropertyAscending<T>(arr: T[], propName: keyof T) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i][propName] > arr[i + 1][propName]) {
      return false;
    }
  }
  return true;
}
