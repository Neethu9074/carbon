/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { renderHook } from '@testing-library/react-hooks';

import { ServiceLevelObjectiveConfiguration, TimeConfig, Error, Result } from '@instana/types';
import { just } from '@instana/observables';

import useSloListMetrics, { StructuredMetricResult, resultReducer } from 'in-service-levels/hooks/useSloListMetrics';
import { pendingResult } from 'in-services/fixedObjects';
import { success, error } from 'in-services/util/result';
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
    jest.clearAllMocks();
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
    expect(getUnifiedMetrics).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        metrics: expect.objectContaining({
          'slo1-status': expect.objectContaining({ configId: 'slo1', source: 'SLO', metric: 'STATUS' })
        })
      })
    );
    expect(getUnifiedMetrics).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        metrics: expect.objectContaining({
          'slo2-status': expect.objectContaining({ configId: 'slo2', source: 'SLO', metric: 'STATUS' })
        })
      })
    );
  });

  it('subscribes to remaining error budget metrics for each slo configuration', () => {
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
    expect(getUnifiedMetrics).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        metrics: expect.objectContaining({
          'slo1-remainingBudget': expect.objectContaining({
            configId: 'slo1',
            source: 'SLO',
            metric: 'ERROR_BUDGET_REMAINING'
          })
        })
      })
    );
    expect(getUnifiedMetrics).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        metrics: expect.objectContaining({
          'slo2-remainingBudget': expect.objectContaining({
            configId: 'slo2',
            source: 'SLO',
            metric: 'ERROR_BUDGET_REMAINING'
          })
        })
      })
    );
  });

  it('subscribes to remaining error budget spark chart metrics for each slo configuration', () => {
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
    expect(getUnifiedMetrics).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        metrics: expect.objectContaining({
          'slo1-remainingBudgetSpark': expect.objectContaining({
            configId: 'slo1',
            source: 'SLO',
            metric: 'ERROR_BUDGET_REMAINING_SPARK_CHART'
          })
        })
      })
    );
    expect(getUnifiedMetrics).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        metrics: expect.objectContaining({
          'slo2-remainingBudgetSpark': expect.objectContaining({
            configId: 'slo2',
            source: 'SLO',
            metric: 'ERROR_BUDGET_REMAINING_SPARK_CHART'
          })
        })
      })
    );
  });

  it('requests metrics only within a single hour of the selected time-config for each individual configuration', () => {
    // Given
    jest.useFakeTimers();
    jest.setSystemTime(days.toMillis(5));
    // Select time-window of seven days in time-picker
    const selectedTimeConfig = { ...timeConfig, windowSize: days.toMillis(7) };
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
    renderHook(() => useSloListMetrics(configurations, selectedTimeConfig));

    // Then
    expect(getUnifiedMetrics).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        metrics: expect.objectContaining({
          'slo1-status': expect.objectContaining({
            timeConfig: expect.objectContaining({ windowSize: hours.toMillis(1) })
          }),
          'slo1-remainingBudget': expect.objectContaining({
            timeConfig: expect.objectContaining({ windowSize: hours.toMillis(1) })
          })
        })
      })
    );

    expect(getUnifiedMetrics).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        metrics: expect.objectContaining({
          'slo2-status': expect.objectContaining({
            timeConfig: expect.objectContaining({ windowSize: hours.toMillis(1) })
          }),
          'slo2-remainingBudget': expect.objectContaining({
            timeConfig: expect.objectContaining({ windowSize: hours.toMillis(1) })
          })
        })
      })
    );
  });

  it('doesnt subscribe to any metrics if the list of slo configurations is empty', () => {
    // Given
    const configurations: ServiceLevelObjectiveConfiguration[] = [];

    // When
    renderHook(() => useSloListMetrics(configurations, timeConfig));
    renderHook(() => useSloListMetrics(configurations, timeConfig));
    const { result } = renderHook(() => useSloListMetrics(configurations, timeConfig));
    const [metrics] = result.current;

    // Then
    expect(metrics).toBeUndefined();
  });
  // });

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
    const [, actualStatus] = result.current;

    // Then
    expect(actualStatus).toEqual('resolved');
  });

  it('passes on loading states', () => {
    // Given
    const configurations: ServiceLevelObjectiveConfiguration[] = [];
    getUnifiedMetrics.mockReturnValue(just(pendingResult));

    // When
    const { result } = renderHook(() => useSloListMetrics(configurations, timeConfig));
    const [, actualStatus] = result.current;

    // Then
    expect(actualStatus).toEqual('resolved');
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
      } as ServiceLevelObjectiveConfiguration
    ];
    getUnifiedMetrics.mockReturnValue(just(success([{ id: 'slo1-status-status', values: [] }])));

    // When
    const { result } = renderHook(() => useSloListMetrics(configurations, timeConfig));
    const [actualMetrics] = result.current;

    // Then
    expect(actualMetrics).toEqual(
      expect.objectContaining({
        'slo1-status': expect.objectContaining({
          'slo1-status': expect.objectContaining({
            status: expect.objectContaining({ values: [] })
          })
        })
      })
    );
  });

  it('resultReducer should reduce the metrics data to an object with the sloId', () => {
    // Given
    const metricData: Result<StructuredMetricResult>[] = [
      {
        data: {
          metrics: {
            'slo-1': {
              remainingBudget: { values: [], id: 'slo-1' },
              remainingBudgetSpark: { values: [], id: 'slo-1' },
              status: { values: [], id: 'slo-1' }
            }
          },
          sloId: 'slo-1'
        },
        errors: [],
        progress: {
          loading: false
        }
      },
      {
        data: {
          metrics: {
            'slo-2': {
              remainingBudget: { values: [], id: 'slo-2' },
              remainingBudgetSpark: { values: [], id: 'slo-2' },
              status: { values: [], id: 'slo-2' }
            }
          },
          sloId: 'slo-2'
        },
        errors: [],
        progress: {
          loading: false
        }
      }
    ];

    // When
    const result = resultReducer(metricData);

    // Then
    expect(result).toEqual({
      data: {
        'slo-1': {
          'slo-1': {
            remainingBudget: { values: [], id: 'slo-1' },
            remainingBudgetSpark: { values: [], id: 'slo-1' },
            status: { values: [], id: 'slo-1' }
          }
        },
        'slo-2': {
          'slo-2': {
            remainingBudget: { values: [], id: 'slo-2' },
            remainingBudgetSpark: { values: [], id: 'slo-2' },
            status: { values: [], id: 'slo-2' }
          }
        }
      },
      errors: [],
      progress: {
        loading: false
      }
    });
  });

  it('resultReducer should show other SLO metrics even if there an BE exception occurs in one SLO', () => {
    // Given
    const metricData: Result<StructuredMetricResult>[] = [
      {
        data: {
          metrics: {
            'slo-1': {
              remainingBudget: { values: [], id: 'slo-1' },
              remainingBudgetSpark: { values: [], id: 'slo-1' },
              status: { values: [], id: 'slo-1' }
            }
          },
          sloId: 'slo-1'
        },
        errors: [],
        progress: {
          loading: false
        }
      },
      {
        errors: [
          {
            code: 'NOT_FOUND',
            message: 'some BackEndException'
          }
        ],
        progress: {
          loading: false
        }
      }
    ];

    // When
    const result = resultReducer(metricData);

    // Then
    expect(result).toEqual({
      data: {
        'slo-1': {
          'slo-1': {
            remainingBudget: { values: [], id: 'slo-1' },
            remainingBudgetSpark: { values: [], id: 'slo-1' },
            status: { values: [], id: 'slo-1' }
          }
        }
      },
      errors: [],
      progress: {
        loading: false
      }
    });
  });

  it('resultReducer should not show any errors even if there is any backendException', () => {
    //  Given
    const metricData: Result<StructuredMetricResult>[] = [
      {
        errors: [
          {
            code: 'NOT_FOUND',
            message: 'some BackEndException'
          }
        ],
        progress: {
          loading: false
        }
      }
    ];

    // When
    const result = resultReducer(metricData);

    // Then
    expect(result).toEqual({
      progress: {
        loading: false
      }
    });
  });

  it('resultReducer should reduce the metrics data to an object even if there is no data in metrics', () => {
    //  Given
    const metricData: Result<StructuredMetricResult>[] = [
      {
        errors: [],
        progress: {
          loading: false
        }
      }
    ];

    // When
    const result = resultReducer(metricData);

    // Then
    expect(result).toEqual({
      progress: {
        loading: false
      }
    });
  });
});
