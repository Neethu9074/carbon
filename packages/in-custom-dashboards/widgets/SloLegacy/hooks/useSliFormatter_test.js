/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { useSliFormatter } from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSliFormatter';

describe('in-custom-dashboards/widgets/SloLegacy/hooks/useSliFormatter', () => {
  describe('event based sli', () => {
    describe('websites', () => {
      it('stringifies numbers with the calls unit appended', () => {
        // Given
        const number = 500;
        const sliEntity = { sliType: 'websiteEventBased' };

        // When
        const formatter = useSliFormatter(sliEntity);
        const actual = formatter(number);

        // Then
        expect(actual).toEqual(expect.stringContaining(`${number}`));
        expect(actual).toEqual(expect.stringContaining('calls'));
      });
      it('compacts numbers over 10000', () => {
        // Given
        const number = 50000;
        const sliEntity = { sliType: 'websiteEventBased' };

        // When
        const formatter = useSliFormatter(sliEntity);
        const actual = formatter(number);

        // Then
        expect(actual).toEqual(expect.stringContaining(`50.00K`));
        expect(actual).toEqual(expect.stringContaining('calls'));
      });
    });
    describe('applications', () => {
      it('stringifies numbers with calls unit appended', () => {
        // Given
        const number = 500;
        const sliEntity = { sliType: 'availability' };

        // When
        const formatter = useSliFormatter(sliEntity);
        const actual = formatter(number);

        // Then
        expect(actual).toEqual(expect.stringContaining(`${number}`));
        expect(actual).toEqual(expect.stringContaining('calls'));
      });
      it('compacts numbers over 10000', () => {
        // Given
        const number = 50000;
        const sliEntity = { sliType: 'availability' };

        // When
        const formatter = useSliFormatter(sliEntity);
        const actual = formatter(number);

        // Then
        expect(actual).toEqual(expect.stringContaining(`50.00K`));
        expect(actual).toEqual(expect.stringContaining('calls'));
      });
    });
  });

  describe('time based sli', () => {
    describe('websites', () => {
      it('formats numbers as compact minutes', () => {
        // Given
        const number = 500.5;
        const sliEntity = { sliType: 'websiteTimeBased' };

        // When
        const formatter = useSliFormatter(sliEntity);
        const actual = formatter(number);

        // Then
        expect(actual).toEqual('501min');
      });
    });
    describe('applications', () => {
      it('formats numbers as compact minutes', () => {
        // Given
        const number = 500.5;
        const sliEntity = { sliType: 'application' };

        // When
        const formatter = useSliFormatter(sliEntity);
        const actual = formatter(number);

        // Then
        expect(actual).toEqual('501min');
      });
    });
  });

  it('provides a fallback formatter if sliEntity is undefined', () => {
    // Given
    const number = 333;
    const sliEntity = undefined;

    // When
    const formatter = useSliFormatter(sliEntity);
    const actual = formatter(number);

    // Then
    expect(actual).toEqual(expect.any(String));
  });
});
