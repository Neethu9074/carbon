/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { renderHook } from '@testing-library/react-hooks';

import useSloMetrics from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSloMetrics';

jest.mock('in-custom-dashboards/widgets/SloLegacy/subscriptions/getUnifiedSloMetrics', () => {
  const { success } = jest.requireActual('in-services/util/result');
  const { just } = jest.requireActual('@instana/observables');
  return {
    __esModule: true,
    default: jest.fn(metricsObj => just(success(metricsObj)))
  };
});

describe('in-custom-dashboards/widgets/SloLegacy/hooks/useSloMetrics', () => {
  beforeEach(jest.clearAllMocks);

  const sloMetricsProps = {
    sliId: 'test-sli',
    slo: 0,
    timeConfig: { windowSize: 60000 },
    isPreview: true,
    granularity: 1
  };

  const expectedDefaults = {
    sliConfigId: sloMetricsProps.sliId,
    slo: sloMetricsProps.slo,
    timeConfig: { ...sloMetricsProps.timeConfig },
    isPreview: sloMetricsProps.isPreview,
    timeShift: { offset: 0 },
    resultType: 'TIME_SERIES',
    aggregation: 'MEAN',
    source: 'SLI'
  };

  describe('Testing metrics.consumed', () => {
    it('should return object with with key "consumed"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      expect(metrics).toHaveProperty('consumed');
    });

    it('|- should contain all properties of metricConfig object', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { consumed } = metrics;
      const expectedMetrics = { ...expectedDefaults };
      expect(consumed).toEqual(expect.objectContaining(expectedMetrics));
    });

    it('|- should contain the key "metric" with value "CONSUMED_ERROR_BUDGET_CHART"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { consumed } = metrics;
      expect(consumed).toHaveProperty('metric');
      expect(consumed.metric).toBe('CONSUMED_ERROR_BUDGET_CHART');
    });

    it('|- should contain the key "granularity" with value 1', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { consumed } = metrics;
      expect(consumed).toHaveProperty('granularity');
      expect(consumed.granularity).toBe(1);
    });
  });

  describe('Testing metrics.sli', () => {
    it('should return object with with key "sli"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      expect(metrics).toHaveProperty('sli');
    });

    it('|- should contain all properties of metricConfig object', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { sli } = metrics;
      const expectedMetrics = { ...expectedDefaults, metric: 'SLI', resultType: 'SINGLE_NUMBER' };
      expect(sli).toEqual(expect.objectContaining(expectedMetrics));
    });

    it('|- should contain the key "resultType" with value "SINGLE_NUMBER"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { sli } = metrics;
      expect(sli).toHaveProperty('resultType');
      expect(sli.resultType).toBe('SINGLE_NUMBER');
    });

    it('|- should contain the key "metric" with value "SLI"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { sli } = metrics;
      expect(sli).toHaveProperty('metric');
      expect(sli.metric).toBe('SLI');
    });
  });

  describe('Testing metrics.spent', () => {
    it('should return object with with key "spent"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      expect(metrics).toHaveProperty('spent');
    });

    it('|- should contain all properties of metricConfig object', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { spent } = metrics;
      const expectedMetrics = { ...expectedDefaults, metric: 'ERROR_BUDGET_SPENT', resultType: 'SINGLE_NUMBER' };
      expect(spent).toEqual(expect.objectContaining(expectedMetrics));
    });

    it('|- should contain the key "resultType" with value "SINGLE_NUMBER"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { spent } = metrics;
      expect(spent).toHaveProperty('resultType');
      expect(spent.resultType).toBe('SINGLE_NUMBER');
    });

    it('|- should contain the key "metric" with value "ERROR_BUDGET_SPENT"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { spent } = metrics;
      expect(spent).toHaveProperty('metric');
      expect(spent.metric).toBe('ERROR_BUDGET_SPENT');
    });
  });

  describe('Testing metrics.remaining', () => {
    it('should return object with with key "remaining"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      expect(metrics).toHaveProperty('remaining');
    });

    it('|- should contain all properties of metricConfig object', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { remaining } = metrics;
      const expectedMetrics = { ...expectedDefaults, metric: 'ERROR_BUDGET_REMAINING', resultType: 'SINGLE_NUMBER' };
      expect(remaining).toEqual(expect.objectContaining(expectedMetrics));
    });

    it('|- should contain the key "resultType" with value "SINGLE_NUMBER"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { remaining } = metrics;
      expect(remaining).toHaveProperty('resultType');
      expect(remaining.resultType).toBe('SINGLE_NUMBER');
    });

    it('|- should contain the key "metric" with value "ERROR_BUDGET_REMAINING"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { remaining } = metrics;
      expect(remaining).toHaveProperty('metric');
      expect(remaining.metric).toBe('ERROR_BUDGET_REMAINING');
    });
  });

  describe('Testing metrics.budget', () => {
    it('should return object with with key "budget"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      expect(metrics).toHaveProperty('budget');
    });

    it('|- should contain all properties of metricConfig object', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { budget } = metrics;
      const expectedMetrics = { ...expectedDefaults, metric: 'TOTAL_ERROR_BUDGET', resultType: 'SINGLE_NUMBER' };
      expect(budget).toEqual(expect.objectContaining(expectedMetrics));
    });

    it('|- should contain the key "resultType" with value "SINGLE_NUMBER"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { budget } = metrics;
      expect(budget).toHaveProperty('resultType');
      expect(budget.resultType).toBe('SINGLE_NUMBER');
    });

    it('|- should contain the key "metric" with value "TOTAL_ERROR_BUDGET"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { budget } = metrics;
      expect(budget).toHaveProperty('metric');
      expect(budget.metric).toBe('TOTAL_ERROR_BUDGET');
    });
  });

  describe('Testing metrics.hourlyBudget', () => {
    it('should return object with with key "hourlyBudget"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      expect(metrics).toHaveProperty('hourlyBudget');
    });

    it('|- should contain all properties of metricConfig object', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { hourlyBudget } = metrics;
      const expectedMetrics = { ...expectedDefaults, metric: 'HOURLY_ERROR_BUDGET_CHART' };
      expect(hourlyBudget).toEqual(expect.objectContaining(expectedMetrics));
    });

    it('|- should contain the key "metric" with value "TOTAL_ERROR_BUDGET"', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { hourlyBudget } = metrics;
      expect(hourlyBudget).toHaveProperty('metric');
      expect(hourlyBudget.metric).toBe('HOURLY_ERROR_BUDGET_CHART');
    });

    it('|- should contain the key "granularity" with value 1', () => {
      const { result } = renderHook(() => useSloMetrics(sloMetricsProps));
      const [{ metrics }] = result.current;
      const { hourlyBudget } = metrics;
      expect(hourlyBudget).toHaveProperty('granularity');
      expect(hourlyBudget.granularity).toBe(1);
    });
  });

  it('returns an error if sliId is blank', () => {
    // Given
    const sliId = '';

    // When
    const { result } = renderHook(() =>
      useSloMetrics({
        ...sloMetricsProps,
        sliId
      })
    );
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
