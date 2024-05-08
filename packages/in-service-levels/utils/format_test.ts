/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { formatSloStatus } from 'in-service-levels/utils/format';

describe('in-service-levels/utils', () => {
  describe('formatSloStatus', () => {
    it('should return undefined for sloStatus and sloTarget if status is undefined', () => {
      // Given
      const status = undefined;
      const target = 1;

      // When
      const { sloStatus, sloTarget } = formatSloStatus({ status, target });

      // Then
      expect(sloStatus).toEqual(valueMissingPlaceholder);
      expect(sloTarget).toEqual(valueMissingPlaceholder);
    });

    it('should return undefined for sloStatus and sloTarget if target is undefined', () => {
      // Given
      const status = 1;
      const target = undefined;

      // When
      const { sloStatus, sloTarget } = formatSloStatus({ status, target });

      // Then
      expect(sloStatus).toEqual(valueMissingPlaceholder);
      expect(sloTarget).toEqual(valueMissingPlaceholder);
    });

    it.each`
      expectedTarget | expectedStatus | target        | status
      ${'100.00%'}   | ${'100.00%'}   | ${1}          | ${1}
      ${'99.888%'}   | ${'99.9911%'}  | ${0.99888}    | ${0.999911}
      ${'99.9995%'}  | ${'99.9996%'}  | ${0.999995}   | ${0.999996}
      ${'99.9999%'}  | ${'100.00%'}   | ${0.999999}   | ${1}
      ${'100.00%'}   | ${'100.00%'}   | ${0.99999995} | ${1}
      ${'300.00%'}   | ${'299.95%'}   | ${3}          | ${2.99948}
    `(
      'should return sloTarged of $expectedTarget and sloStatus of $expectedStatus if target $target and status $status',
      ({ expectedTarget, expectedStatus, status, target }) => {
        expect(formatSloStatus({ status, target })).toEqual(
          expect.objectContaining({ sloStatus: expectedStatus, sloTarget: expectedTarget })
        );
      }
    );
  });
});
