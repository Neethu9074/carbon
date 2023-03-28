/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  timeThresholdTypes,
  TimeThresholdType
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import { ImpactMeasurementMethods } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { WebsiteUserImpactThreshold, UserImpactWebsiteTimeThreshold, WebsiteTimeThreshold } from 'in-types';
const { getDescription } = require('in-alerting/smart-alerts/components/dialog/timeThresholdDescriptionText');

const GRANULARITY = 10000;

describe('in-alerting/smart-alerts/components/dialog/TimeThresholdDescriptionText', () => {
  describe('getDescription for a specific time threshold and granularity', () => {
    describe('WHEN impact type is user impact of violations in sequence', () => {
      describe('WHEN impact method is AGGREGATED', () => {
        function enrichUserImpactThreshold(
          userImpactThreshold: WebsiteUserImpactThreshold
        ): UserImpactWebsiteTimeThreshold {
          return {
            ...userImpactThreshold,
            type: timeThresholdTypes.userImpactOfViolationsInSequence,
            timeWindow: 120000,
            impactMeasurementMethod: ImpactMeasurementMethods.AGGREGATED
          };
        }

        describe('WHEN no users and no user percentage are given', () =>
          test('THEN request translation with numberEvaluationWindows', () =>
            expect(getDescription(enrichUserImpactThreshold({}), GRANULARITY)).toBe(
              'Impacted within the last 2 minutes'
            )));

        describe('WHEN users and no user percentage given', () =>
          test('THEN get a translation with users and no user percentage', () =>
            expect(getDescription(enrichUserImpactThreshold({ users: 2 }), GRANULARITY)).toBe(
              'At least 2 users impacted within the last 2 minutes'
            )));

        test('with no users and user percentage given', () =>
          expect(getDescription(enrichUserImpactThreshold({ userPercentage: 0.6 }), GRANULARITY)).toBe(
            'At least 60% of users impacted within the last 2 minutes'
          ));

        test('with users and user percentage given', () =>
          expect(getDescription(enrichUserImpactThreshold({ users: 2, userPercentage: 0.6 }), GRANULARITY)).toBe(
            'At least 2 users and 60% of users impacted within the last 2 minutes'
          ));
      });

      describe('WHEN impact method is per window', () => {
        function enrichUserImpactThreshold(
          userImpactThreshold: WebsiteUserImpactThreshold
        ): UserImpactWebsiteTimeThreshold {
          return {
            ...userImpactThreshold,
            type: timeThresholdTypes.userImpactOfViolationsInSequence,
            timeWindow: 120000,
            impactMeasurementMethod: ImpactMeasurementMethods.PER_WINDOW
          };
        }

        test('with no users and no user percentage given', () =>
          expect(getDescription(enrichUserImpactThreshold({}), GRANULARITY)).toBe(
            'Impacted per window, for the last 12 evaluation windows'
          ));

        test('with users and no user percentage given', () =>
          expect(getDescription(enrichUserImpactThreshold({ users: 2 }), GRANULARITY)).toBe(
            'At least 2 users impacted per window, for the last 12 evaluation windows'
          ));

        test('with no users and user percentage given', () =>
          expect(getDescription(enrichUserImpactThreshold({ userPercentage: 0.6 }), GRANULARITY)).toBe(
            'At least 60% of users impacted per window, for the last 12 evaluation windows'
          ));

        test('with users and user percentage given', () =>
          expect(getDescription(enrichUserImpactThreshold({ users: 2, userPercentage: 0.6 }), GRANULARITY)).toBe(
            'At least 2 users and 60% of users impacted per window, for the last 12 evaluation windows'
          ));
      });

      describe('WHEN impact method is not specified', () => {
        function enrichUserImpactThreshold(userImpactThreshold: WebsiteUserImpactThreshold) {
          return {
            ...userImpactThreshold,
            type: timeThresholdTypes.userImpactOfViolationsInSequence,
            timeWindow: 120000,
            impactMeasurementMethod: undefined
          };
        }

        test('with no users and no user percentage given', () => {
          expect(getDescription(enrichUserImpactThreshold({}), GRANULARITY)).toBe('Impacted within the last 2 minutes');
        });

        test('with users and no user percentage given', () =>
          expect(getDescription(enrichUserImpactThreshold({ users: 2 }), GRANULARITY)).toBe(
            'At least 2 users impacted within the last 2 minutes'
          ));

        test('with no users and user percentage given', () =>
          expect(getDescription(enrichUserImpactThreshold({ userPercentage: 0.6 }), GRANULARITY)).toBe(
            'At least 60% of users impacted within the last 2 minutes'
          ));

        test('with users and user percentage given', () =>
          expect(getDescription(enrichUserImpactThreshold({ users: 2, userPercentage: 0.6 }), GRANULARITY)).toBe(
            'At least 2 users and 60% of users impacted within the last 2 minutes'
          ));
      });
    });

    describe('of type trace impact', () =>
      expect(
        getDescription(enrichByTimeWindow({ type: timeThresholdTypes.traceImpact, requests: 5 }), GRANULARITY)
      ).toBe('At least 5 traces impacted within the last 2 minutes'));

    describe('of type violations in period', () => {
      expect(
        getDescription(enrichByTimeWindow({ type: timeThresholdTypes.violationsInPeriod, violations: 7 }), GRANULARITY)
      ).toBe('At least 7 violations within the last 2 minutes');
    });

    describe('of type violations in sequence', () => {
      expect(getDescription(enrichByTimeWindow({ type: timeThresholdTypes.violationsInSequence }), GRANULARITY)).toBe(
        '2 minutes'
      );
    });

    describe('of type any other type', () => {
      expect(getDescription({ type: 'unknown', timeWindow: 120000 }, GRANULARITY)).toBe('2 minutes');
    });
  });

  function enrichByTimeWindow(
    timeThreshold: { type: TimeThresholdType } & (
      | WebsiteUserImpactThreshold
      | { violations: number }
      | { requests: number }
    )
  ): WebsiteTimeThreshold {
    return {
      ...timeThreshold,
      timeWindow: 120000
    } as WebsiteTimeThreshold;
  }
});
