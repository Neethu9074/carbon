/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { v4 as uuid } from 'uuid';

import { getLinkToUnboundAnalytics } from 'in-events/components/AnalyzeApplicationEventButton';
import { getLinkToAnalyze } from 'in-applications/navigation/paths';
import { entityTypes } from 'in-analyze/applicationFilter';

jest.mock('in-applications/navigation/paths', () => ({
  getLinkToAnalyze: jest.fn().mockReturnValue([])
}));

describe('AnalyzeApplicationEventButton', () => {
  describe('getLinkToUnboundAnalytics', () => {
    const applicationId = uuid();
    const testArguments = {
      applicationId,
      applicationName: 'Stans Burrito Delivery 🌯',
      alertConfig: {
        name: 'ErrorRate Test',
        description: 'The erroneous call rate is higher or equal to 0.25%.',
        boundaryScope: 'INBOUND',
        applicationId,
        applications: {
          [applicationId]: {
            applicationId,
            inclusive: true,
            services: {}
          }
        },
        severity: 5,
        triggering: false,
        tagFilters: [],
        tagFilterExpression: {
          type: 'EXPRESSION',
          logicalOperator: 'AND',
          elements: []
        },
        includeInternal: false,
        includeSynthetic: false,
        rule: {
          alertType: 'errorRate',
          metricName: 'errors',
          aggregation: 'MEAN'
        },
        threshold: {
          type: 'staticThreshold',
          operator: '>=',
          value: 0.0025,
          lastUpdated: 0
        },
        alertChannelIds: [],
        granularity: 600000,
        timeThreshold: {
          type: 'violationsInSequence',
          timeWindow: 600000
        },
        evaluationType: 'PER_AP_SERVICE',
        customPayloadFields: [],
        id: '9hMsJ5s5TIeFcWdD6xzr6Q',
        created: 1632297450904,
        readOnly: false,
        enabled: true,
        derivedFromGlobalAlert: false
      },
      timeConfig: {
        to: 1632315098896,
        focusedMoment: 1632315098896,
        windowSize: 1298896,
        autoRefresh: false
      },
      adaptiveBaselineInfo: {}
    };
    it('adds service grouping for per AP smart alerts', () => {
      const args = { ...testArguments, alertConfig: { ...testArguments.alertConfig, evaluationType: 'PER_AP' } };

      getLinkToUnboundAnalytics(args);
      const { groupBy } = getLinkToAnalyze.mock.calls.at(-1)[0];
      expect(groupBy).toEqual({
        groupbyTag: 'service.name',
        groupbyTagEntity: entityTypes.DESTINATION
      });
    });

    it('adds endpoint grouping for per Service smart alerts', () => {
      const args = {
        ...testArguments,
        alertConfig: { ...testArguments.alertConfig, evaluationType: 'PER_AP_SERVICE' }
      };

      getLinkToUnboundAnalytics(args);

      const { groupBy } = getLinkToAnalyze.mock.calls.at(-1)[0];
      expect(groupBy).toEqual({
        groupbyTag: 'endpoint.name',
        groupbyTagEntity: entityTypes.DESTINATION
      });
    });

    it('adds call name grouping for per endpoint smart alerts', () => {
      const args = {
        ...testArguments,
        alertConfig: { ...testArguments.alertConfig, evaluationType: 'PER_AP_ENDPOINT' }
      };

      getLinkToUnboundAnalytics(args);

      const { groupBy } = getLinkToAnalyze.mock.calls.at(-1)[0];
      expect(groupBy).toEqual({
        groupbyTag: 'call.name'
      });
    });
  });
});
