/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import {
  mapConditionValue,
  unmapConditionValue
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';

describe('in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util', () => {
  describe('mapConditionValue', () => {
    describe('if formatterType is PERCENTAGE', () => {
      const formatterType = 'PERCENTAGE';

      it('correctly maps integers', () => {
        // Given
        const value = 0.71;

        // When
        const actual = mapConditionValue(value, formatterType);

        // Then
        expect(actual).toBe(71);
      });

      it('correctly maps decimals', () => {
        // Given
        const value = 0.71119;

        // When
        const actual = mapConditionValue(value, formatterType);

        // Then
        expect(actual).toBe(71.119);
      });

      it('returns NaN if value is undefined', () => {
        // Given
        const value = undefined;

        // When
        const actual = mapConditionValue(value, formatterType);

        // Then
        expect(actual).toBeNaN();
      });
    });

    it('returns value unchanged if formatterType is undefined', () => {
      // Given
      const value = 1111;

      // When
      const actual = mapConditionValue(value, undefined);

      // Then
      expect(actual).toBe(value);
    });
  });

  describe('unmapConditionValue', () => {
    describe('if formatterType is PERCENTAGE', () => {
      const formatterType = 'PERCENTAGE';

      it('correctly maps integers', () => {
        // Given
        const value = 71;

        // When
        const actual = unmapConditionValue(value, formatterType);

        // Then
        expect(actual).toBe(0.71);
      });

      it('correctly maps decimals', () => {
        // Given
        const value = 71.119;

        // When
        const actual = unmapConditionValue(value, formatterType);

        // Then
        expect(actual).toBe(0.71119);
      });

      it('returns NaN if value is undefined', () => {
        // Given
        const value = undefined;

        // When
        const actual = unmapConditionValue(value, formatterType);

        // Then
        expect(actual).toBeNaN();
      });
    });

    it('returns value unchanged if formatterType is undefined', () => {
      // Given
      const value = 1111;

      // When
      const actual = mapConditionValue(value, undefined);

      // Then
      expect(actual).toBe(value);
    });
  });
});
