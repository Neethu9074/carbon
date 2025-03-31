/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { renderHook } from '@testing-library/react-hooks';

import { formToSloConfiguration } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import { testApplicationForm } from 'in-service-levels/components/ConfigDialog/createSloForm/testData';
import useSloPreviewMetrics from 'in-service-levels/hooks/useSloPreviewMetrics';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';

jest.mock('in-subscription/getUnifiedMetrics', () => ({
  ...jest.requireActual('in-subscription/getUnifiedMetrics'),
  default: jest.fn(),
  __esModule: true
}));

describe('in-service-levels/hooks/useSloPreviewMetrics', () => {
  it('calls the useSloPreviewMetrics and calculates metrics correctly', () => {
    // Given
    const givenForm = testApplicationForm;
    const configFromTheForm = formToSloConfiguration(testApplicationForm);

    // When
    renderHook(() => useSloPreviewMetrics(givenForm));

    // Then
    expect(getUnifiedMetrics).toHaveBeenCalledWith({
      metrics: {
        errorBudgetRemaining: {
          aggregation: 'MEAN',
          config: configFromTheForm,
          granularity: 60000,
          metric: 'ERROR_BUDGET_REMAINING_CHART',
          resultType: 'TIME_SERIES',
          source: 'SLO_PREVIEW',
          timeConfig: {
            autoRefresh: false,
            focusedMoment: null,
            to: null,
            windowSize: 3600000
          },
          timeShift: {
            offset: 0
          }
        },
        remainingBudgetNumber: {
          aggregation: 'MEAN',
          config: configFromTheForm,
          metric: 'ERROR_BUDGET_REMAINING',
          resultType: 'SINGLE_NUMBER',
          source: 'SLO_PREVIEW',
          timeConfig: {
            autoRefresh: false,
            focusedMoment: null,
            to: null,
            windowSize: 3600000
          },
          timeShift: {
            offset: 0
          }
        },
        statusMetric: {
          aggregation: 'MEAN',
          config: configFromTheForm,
          metric: 'STATUS',
          resultType: 'SINGLE_NUMBER',
          source: 'SLO_PREVIEW',
          timeConfig: {
            autoRefresh: false,
            focusedMoment: null,
            to: null,
            windowSize: 3600000
          },
          timeShift: {
            offset: 0
          }
        },
        totalBudget: {
          aggregation: 'MEAN',
          config: configFromTheForm,
          metric: 'TOTAL_ERROR_BUDGET',
          resultType: 'SINGLE_NUMBER',
          source: 'SLO_PREVIEW',
          timeConfig: {
            autoRefresh: false,
            focusedMoment: null,
            to: null,
            windowSize: 3600000
          },
          timeShift: {
            offset: 0
          }
        }
      }
    });
  });
});
