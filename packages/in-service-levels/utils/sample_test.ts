/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { FixedTimeWindow } from '@instana/types';

import { testDate } from 'in-service-levels/components/ConfigDialog/createSloForm/testData';
import { calculateTimeConfigFromTimeWindow } from 'in-service-levels/utils/time';
import { getErrorBudgetSampleData } from 'in-service-levels/utils/sample';
import { hours } from 'in-services/time/time';

jest.mock('in-stores/permission', () => ({
  __esModule: true,
  hasSyntheticsAccess: true
}));

describe('in-service-levels/utils/sample', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(testDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('getErrorBudgetSampleData', () => {
    it.each`
      indicatorType   | expectedRemainingBudget | expectedStatus | expectedTotalBudget
      ${undefined}    | ${285.6}                | ${0.85}        | ${336}
      ${'eventBased'} | ${285.6}                | ${0.85}        | ${336}
      ${'timeBased'}  | ${1713.6000000000001}   | ${0.85}        | ${2016}
    `(
      'returns correct error budget for $indicatorType indicator type',
      ({ indicatorType, expectedRemainingBudget, expectedStatus, expectedTotalBudget }) => {
        // Given
        const amountSelectedEntities = 2;
        const sloTarget = 0.8;
        const timeWindow: FixedTimeWindow = {
          duration: 1,
          durationUnit: 'week',
          type: 'fixed',
          startTimestamp: Date.now()
        };
        const timeConfig = calculateTimeConfigFromTimeWindow(timeWindow);
        const granularity = hours.toMillis(1);

        // When
        const { status, totalErrorBudget, remainingErrorBudget } = getErrorBudgetSampleData(
          { entityIds: Array(amountSelectedEntities).fill(''), indicatorType, sloTarget, timeWindow },
          timeConfig,
          granularity
        );

        // Then
        expect(status).toBe(expectedStatus);
        expect(totalErrorBudget).toBe(expectedTotalBudget);
        expect(remainingErrorBudget).toBe(expectedRemainingBudget);
      }
    );
  });
});
