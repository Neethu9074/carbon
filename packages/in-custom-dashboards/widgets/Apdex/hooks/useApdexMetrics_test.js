/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import { just } from '@instana/observables';

import useApdexMetrics from 'in-custom-dashboards/widgets/Apdex/hooks/useApdexMetrics';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';

jest.mock('in-subscription/getUnifiedMetrics');

describe('in-custom-dashboards/widgets/Apdex/hooks/useApdexMetrics', () => {
  beforeEach(jest.clearAllMocks);

  it('subscribes to unified metrics for apdex with the given id', () => {
    // Given
    const apdexId = 'someApdexId';
    const timeConfig = { to: 12, windowSize: 5 };

    // When
    renderHook(() => useApdexMetrics({ id: apdexId, timeConfig }));

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
    const apdexId2 = 'someOtherId';
    const timeConfig = { to: 12, windowSize: 5 };
    const timeConfig2 = { to: 13, windowSize: 5 };
    const isPreview = true;
    const mockObservable = just(undefined);
    const subscribeSpy = jest.spyOn(mockObservable, 'subscribe');
    getUnifiedMetrics.mockImplementation(() => ({ ...mockObservable, delayedStop: () => mockObservable }));

    // When
    const { rerender } = renderHook(props => useApdexMetrics(props), {
      initialProps: { id: apdexId, timeConfig, isPreview }
    });
    rerender({ id: apdexId, timeConfig, isPreview }); // This should not cause an update
    rerender({ id: apdexId2, timeConfig, isPreview }); // These should cause an update
    rerender({ id: apdexId2, timeConfig: timeConfig2, isPreview });
    rerender({ id: apdexId2, timeConfig: timeConfig2, isPreview: !isPreview });

    // Then
    expect(subscribeSpy).toHaveBeenCalledTimes(4);
  });

  it.each([[true], [false]])('selects the right preview state when subscribing for isPreview = %s', isPreview => {
    // Given
    const apdexId = 'someApdexId';
    const timeConfig = { to: 12, windowSize: 5 };

    // When
    renderHook(() => useApdexMetrics({ id: apdexId, timeConfig, isPreview }));

    // Then
    expect(getUnifiedMetrics).toHaveBeenLastCalledWith({
      metrics: {
        apdex: expect.objectContaining({
          isPreview
        })
      }
    });
  });

  it('returns an error if id is blank', () => {
    // Given
    const apdexId = '';
    const timeConfig = { to: 12, windowSize: 5 };

    // When
    const { result } = renderHook(() => useApdexMetrics({ id: apdexId, timeConfig }));
    const [, status, errors] = result.current;

    // Then
    expect(status).toEqual('rejected');
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'CLIENT',
          message: expect.stringContaining('blank')
        })
      ])
    );
  });
});
