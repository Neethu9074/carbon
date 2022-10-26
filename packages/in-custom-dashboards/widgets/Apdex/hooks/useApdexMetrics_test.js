/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useObservable } from '@instana/hooks';

import useApdexMetrics from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexMetrics';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';

jest.mock('in-subscription/getUnifiedMetrics');
jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn((cb, watchers) => cb(...watchers))
}));

describe('in-custom-dashboards/widgets/Apdex/hooks/useApdexMetrics', () => {
  beforeEach(jest.clearAllMocks);

  it('subscribes to unified metrics for apdex with the given id', () => {
    // Given
    const apdexId = 'someApdexId';
    const timeConfig = { to: 12, windowSize: 5 };

    // When
    useApdexMetrics({ id: apdexId, timeConfig });

    // Then
    expect(getUnifiedMetrics).toHaveBeenLastCalledWith({
      metrics: {
        apdex: expect.objectContaining({
          apdexId,
          timeShift: { offset: 0 },
          aggregation: 'MEAN',
          source: 'APDEX',
          timeConfig,
          resultType: 'TIME_SERIES',
          metric: 'APDEX'
        })
      }
    });
  });

  it('configures the subscription to update on changes to the id, timeConfig and isPreview flag', () => {
    // Given
    const apdexId = 'someApdexId';
    const timeConfig = { to: 12, windowSize: 5 };
    const isPreview = true;

    // When
    useApdexMetrics({ id: apdexId, timeConfig, isPreview });

    // Then
    expect(useObservable).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.arrayContaining([apdexId, timeConfig, isPreview])
    );
  });

  it.each([[true], [false]])('selects the right preview state when subscribing for isPreview = %s', isPreview => {
    // Given
    const apdexId = 'someApdexId';
    const timeConfig = { to: 12, windowSize: 5 };

    // When
    useApdexMetrics({ id: apdexId, timeConfig, isPreview });

    // Then
    expect(getUnifiedMetrics).toHaveBeenLastCalledWith({
      metrics: {
        apdex: expect.objectContaining({
          isPreview
        })
      }
    });
  });
});
