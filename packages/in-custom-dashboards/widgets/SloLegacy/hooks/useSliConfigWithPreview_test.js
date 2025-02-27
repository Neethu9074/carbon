/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import useSliConfigWithPreview from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfigWithPreview';
import useSliConfiguration from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfiguration';
import { days } from 'in-services/time';

jest.mock('in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfiguration', () => ({
  __esModule: true,
  default: jest.fn(() => [])
}));
jest.mock('in-services/featureFlags', () => ({
  sloFullEnabled: false
}));

describe('in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfigWithPreview', () => {
  beforeEach(jest.clearAllMocks);

  it('returns pending and no data if useSliConfiguration returns a pending status', () => {
    // Given
    const status = 'pending';
    const sliConfig = undefined;
    const errors = [];
    const progress = { loading: true };

    useSliConfiguration.mockReturnValueOnce([sliConfig, status, errors, progress]);

    // When
    const actual = useSliConfigWithPreview('someId');

    // Then
    expect(actual).toEqual([undefined, 'pending', [], progress]);
  });

  it('returns rejected and errors if useSliConfiguration returns a rejected status', () => {
    // Given
    const status = 'rejected';
    const sliConfig = undefined;
    const errors = [{ code: 42, message: 'the answer' }];
    const progress = { loading: false };

    useSliConfiguration.mockReturnValueOnce([sliConfig, status, errors, progress]);

    // When
    const actual = useSliConfigWithPreview('someId');

    // Then
    expect(actual).toEqual([undefined, 'rejected', [{ code: 42, message: 'the answer' }], progress]);
  });

  describe('If status is resolved', () => {
    it('isPreview is false returns sliConfiguration unchanged', () => {
      // Given
      const initialEvaluationTimestamp = days.toMillis(2);
      const lastUpdated = days.toMillis(5);

      const sliConfig = {
        sliName: 'someSliName',
        initialEvaluationTimestamp,
        lastUpdated
      };

      const progress = { loading: false };

      useSliConfiguration.mockReturnValueOnce([sliConfig, 'resolved', [], progress]);

      const isPreview = false;

      // When
      const actual = useSliConfigWithPreview('someId', isPreview);

      // Then
      expect(actual).toEqual([
        { sliName: 'someSliName', initialEvaluationTimestamp, lastUpdated },
        'resolved',
        [],
        { loading: false }
      ]);
    });

    describe('If isPreview is true', () => {
      describe('if sloFullEnabled is set to false', () => {
        it('returns sliConfiguration with initialEvaluationTimestamp value for both initialEvaluationTimestamp and lastUpdated, if initialEvaluationTimestamp is more than 7 days from the current date', () => {
          // Given
          const initialEvaluationTimestamp = days.toMillis(4);
          const lastUpdated = days.toMillis(2);
          const sliConfig = {
            sliName: 'someSliName',
            initialEvaluationTimestamp,
            lastUpdated
          };

          const progress = { loading: false };

          useSliConfiguration.mockReturnValueOnce([sliConfig, 'resolved', [], progress]);

          jest.useFakeTimers();
          jest.setSystemTime(days.toMillis(18));

          // When
          const actual = useSliConfigWithPreview('someId', true);

          // Then
          expect(actual).toEqual([
            {
              sliName: 'someSliName',
              initialEvaluationTimestamp: initialEvaluationTimestamp,
              lastUpdated: initialEvaluationTimestamp
            },
            'resolved',
            [],
            { loading: false }
          ]);
        });

        it('returns sliConfiguration with the difference between current time and 7 days as value for initialEvaluationTimestamp and lastUpdated, if initialEvaluationTimestamp value is less than 7 days from the current date', () => {
          // Given
          const initialEvaluationTimestamp = days.toMillis(8);
          const lastUpdated = days.toMillis(2);
          const currentTime = days.toMillis(11);
          const differenceBetweenEvaluationAndWeek = currentTime - days.toMillis(7);
          const sliConfig = {
            sliName: 'someSliName',
            initialEvaluationTimestamp,
            lastUpdated
          };

          const progress = { loading: false };

          useSliConfiguration.mockReturnValueOnce([sliConfig, 'resolved', [], progress]);

          jest.useFakeTimers();
          jest.setSystemTime(currentTime);

          // When
          const actual = useSliConfigWithPreview('someId', true);

          // Then
          expect(actual).toEqual([
            {
              sliName: 'someSliName',
              initialEvaluationTimestamp: differenceBetweenEvaluationAndWeek,
              lastUpdated: differenceBetweenEvaluationAndWeek
            },
            'resolved',
            [],
            { loading: false }
          ]);
        });
      });

      describe('if sloFullEnabled is set to true', () => {
        it('returns sliConfiguration with lastUpdated value for both initialEvaluationTimestamp and lastUpdated, if the lastUpdated value is more than seven days before the current date', async () => {
          // Given
          jest.resetModules();
          jest.doMock('in-services/featureFlags', () => ({
            sloFullEnabled: true
          }));
          jest.doMock('in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfiguration', () => ({
            __esModule: true,
            default: jest.fn(() => [])
          }));
          const initialEvaluationTimestamp = days.toMillis(11);
          const lastUpdated = days.toMillis(10);
          const sliConfig = {
            sliName: 'someSliName',
            initialEvaluationTimestamp,
            lastUpdated
          };

          const { default: useSliConfiguration } = await import(
            'in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfiguration'
          );
          const { default: useSliConfigWithPreview } = await import(
            'in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfigWithPreview'
          );

          const progress = { loading: false };

          useSliConfiguration.mockReturnValueOnce([sliConfig, 'resolved', [], progress]);

          jest.useFakeTimers();
          jest.setSystemTime(days.toMillis(18));

          // When
          const actual = useSliConfigWithPreview('someId', true);

          // Then
          expect(actual).toEqual([
            {
              sliName: 'someSliName',
              initialEvaluationTimestamp: lastUpdated,
              lastUpdated: lastUpdated
            },
            'resolved',
            [],
            { loading: false }
          ]);
        });

        it('returns sliConfiguration with the difference between current time and 7 days as value for initialEvaluationTimestamp and lastUpdated, if initialEvaluationTimestamp value is less than 7 days from the current date', async () => {
          // Given
          jest.resetModules();
          jest.doMock('in-services/featureFlags', () => ({
            sloFullEnabled: true
          }));
          jest.doMock('in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfiguration', () => ({
            __esModule: true,
            default: jest.fn(() => [])
          }));
          const initialEvaluationTimestamp = days.toMillis(8);
          const lastUpdated = days.toMillis(9);
          const currentTime = days.toMillis(12);
          const differenceBetweenEvaluationAndWeek = currentTime - days.toMillis(7);
          const sliConfig = {
            sliName: 'someSliName',
            initialEvaluationTimestamp,
            lastUpdated
          };

          const { default: useSliConfiguration } = await import(
            'in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfiguration'
          );
          const { default: useSliConfigWithPreview } = await import(
            'in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfigWithPreview'
          );

          const progress = { loading: false };

          useSliConfiguration.mockReturnValueOnce([sliConfig, 'resolved', [], progress]);

          jest.useFakeTimers();
          jest.setSystemTime(currentTime);

          // When
          const actual = useSliConfigWithPreview('someId', true);

          // Then
          expect(actual).toEqual([
            {
              sliName: 'someSliName',
              initialEvaluationTimestamp: differenceBetweenEvaluationAndWeek,
              lastUpdated: differenceBetweenEvaluationAndWeek
            },
            'resolved',
            [],
            { loading: false }
          ]);
        });
      });
    });
  });
});
