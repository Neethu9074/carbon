/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { FixedTimeWindow } from '@instana/types';

import { calculateTimeConfigFromTimeWindow } from 'in-service-levels/utils/time';
import { getErrorBudgetSampleData } from 'in-service-levels/utils/sample';
import { hours } from 'in-services/time/time';

jest.mock('in-services/featureFlags', () => ({
  __esModule: true,
  sloSyntheticsEnabled: true
}));

jest.mock('in-stores/permission', () => ({
  __esModule: true,
  hasSyntheticsAccess: true
}));

describe('in-service-levels/utils/sample', () => {
  describe('getErrorBudgetSampleData', () => {
    it.each`
      indicatorType   | expectedConsumedBudget | expectedRemainingBudget | expectedStatus | expectedTotalBudget
      ${undefined}    | ${50.39999999999999}   | ${285.6}                | ${0.85}        | ${336}
      ${'eventBased'} | ${50.39999999999999}   | ${285.6}                | ${0.85}        | ${336}
      ${'timeBased'}  | ${302.3999999999999}   | ${1713.6000000000001}   | ${0.85}        | ${2016}
    `(
      'returns correct error budget for $indicatorType indicator type',
      ({ indicatorType, expectedConsumedBudget, expectedRemainingBudget, expectedStatus, expectedTotalBudget }) => {
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
        const { status, totalErrorBudget, remainingErrorBudget, consumedErrorBudget } = getErrorBudgetSampleData(
          { entityIds: Array(amountSelectedEntities).fill(''), indicatorType, sloTarget, timeWindow },
          timeConfig,
          granularity
        );

        // Then
        expect(status).toBe(expectedStatus);
        expect(totalErrorBudget).toBe(expectedTotalBudget);
        expect(remainingErrorBudget).toBe(expectedRemainingBudget);
        expect(consumedErrorBudget).toBe(expectedConsumedBudget);
      }
    );
  });
});
