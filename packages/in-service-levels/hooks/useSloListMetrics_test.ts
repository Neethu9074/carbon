/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { renderHook } from '@testing-library/react-hooks';

import { ServiceLevelObjectiveConfiguration, TimeConfig, Error } from '@instana/types';
import { just } from '@instana/observables';

import useSloListMetrics from 'in-service-levels/hooks/useSloListMetrics';
import { pendingResult } from 'in-services/fixedObjects';
import { error, success } from 'in-services/util/result';
import gUM from 'in-subscription/getUnifiedMetrics';
import { days, hours } from 'in-services/time';

jest.mock('in-subscription/getUnifiedMetrics');
const getUnifiedMetrics = gUM as jest.MockedFunction<typeof gUM>;

describe('in-service-levels/hooks/useSloListMetrics', () => {
  const timeConfig: TimeConfig = {
    windowSize: hours.toMillis(1),
    autoRefresh: false
  };

  beforeEach(() => {
    getUnifiedMetrics.mockReturnValue(just(pendingResult));
  });

  it('subscribes to status metrics for each slo configuration', () => {
    // Given
    const configurations: ServiceLevelObjectiveConfiguration[] = [
      {
        id: 'slo1',
        timeWindow: {
          type: 'rolling',
          duration: 1,
          durationUnit: 'week'
        }
      } as ServiceLevelObjectiveConfiguration,
      {
        id: 'slo2',
        timeWindow: {
          type: 'rolling',
          duration: 1,
          durationUnit: 'week'
        }
      } as ServiceLevelObjectiveConfiguration
    ];

    // When
    renderHook(() => useSloListMetrics(configurations, timeConfig));

    // Then
    expect(getUnifiedMetrics).toHaveBeenCalledWith({
      metrics: expect.objectContaining({
        'slo1-status': expect.objectContaining({ configId: 'slo1', source: 'SLO', metric: 'SLI' }),
        'slo2-status': expect.objectContaining({ configId: 'slo2', source: 'SLO', metric: 'SLI' })
      })
    });
  });

  it('doesnt subscribe to any metrics if the list of slo configurations is empty', () => {
    // Given
    const configurations: ServiceLevelObjectiveConfiguration[] = [];

    // When
    renderHook(() => useSloListMetrics(configurations, timeConfig));

    // Then
    expect(getUnifiedMetrics).toHaveBeenCalledWith({ metrics: {} });
  });

  it('it requests metrics for the full timeWindow of each individual configuration', () => {
    // Given
    jest.useFakeTimers();
    jest.setSystemTime(days.toMillis(5));
    const configurations: ServiceLevelObjectiveConfiguration[] = [
      {
        id: 'slo1',
        timeWindow: {
          type: 'rolling',
          duration: 1,
          durationUnit: 'day'
        }
      } as ServiceLevelObjectiveConfiguration,
      {
        id: 'slo2',
        timeWindow: {
          type: 'fixed',
          duration: 2,
          durationUnit: 'day',
          startTimestamp: days.toMillis(4)
        }
      } as unknown as ServiceLevelObjectiveConfiguration
    ];

    // When
    renderHook(() => useSloListMetrics(configurations, timeConfig));

    // Then
    expect(getUnifiedMetrics).toHaveBeenCalledWith({
      metrics: expect.objectContaining({
        'slo1-status': expect.objectContaining({
          timeConfig: expect.objectContaining({ windowSize: days.toMillis(1), to: days.toMillis(5) })
        }),
        'slo2-status': expect.objectContaining({
          timeConfig: expect.objectContaining({ windowSize: days.toMillis(2), to: days.toMillis(6) })
        })
      })
    });
  });

  it('passes on loading states', () => {
    // Given
    const configurations: ServiceLevelObjectiveConfiguration[] = [];
    getUnifiedMetrics.mockReturnValue(just(pendingResult));

    // When
    const { result } = renderHook(() => useSloListMetrics(configurations, timeConfig));
    const [, actualStatus] = result.current;

    // Then
    expect(actualStatus).toEqual('pending');
  });

  it('passes on error states', () => {
    // Given
    const configurations: ServiceLevelObjectiveConfiguration[] = [];
    const expectedError: Error = {
      code: 'SERVER',
      message: 'Ran out of snacks'
    };
    getUnifiedMetrics.mockReturnValue(just(error([expectedError])));

    // When
    const { result } = renderHook(() => useSloListMetrics(configurations, timeConfig));
    const [, actualStatus, actualErrors] = result.current;

    // Then
    expect(actualStatus).toEqual('rejected');
    expect(actualErrors).toEqual(expect.arrayContaining([expect.objectContaining({ message: 'Ran out of snacks' })]));
  });

  it('requested metrics can be robustly identified if slo ids overlap with the internal identification mechanism', () => {
    // Given
    const configurations: ServiceLevelObjectiveConfiguration[] = [
      {
        id: 'slo1-status',
        timeWindow: {
          type: 'rolling',
          duration: 1,
          durationUnit: 'week'
        }
      } as ServiceLevelObjectiveConfiguration,
      {
        id: 'slo2-2-23',
        timeWindow: {
          type: 'rolling',
          duration: 1,
          durationUnit: 'week'
        }
      } as ServiceLevelObjectiveConfiguration
    ];
    getUnifiedMetrics.mockReturnValue(
      just(
        success([
          { id: 'slo1-status-status', values: [] },
          { id: 'slo2-2-23-status', values: [] }
        ])
      )
    );

    // When
    const { result } = renderHook(() => useSloListMetrics(configurations, timeConfig));
    const [actualMetrics] = result.current;

    // Then
    expect(actualMetrics).toEqual(
      expect.objectContaining({
        'slo1-status': expect.objectContaining({ status: expect.objectContaining({ values: [] }) }),
        'slo2-2-23': expect.objectContaining({ status: expect.objectContaining({ values: [] }) })
      })
    );
  });
});
