/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { v4 as uuid } from 'uuid';

import { getLinkToUnboundAnalytics } from 'in-events/components/AnalyzeApplicationEventButton';
import { entityTypes } from 'in-analyze/applicationFilter';

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
      const getLinkToApplicationAnalyze = jest.fn(() => '');

      getLinkToUnboundAnalytics(args, getLinkToApplicationAnalyze);

      expect(getLinkToApplicationAnalyze).toHaveBeenLastCalledWith(
        expect.objectContaining({
          groupBy: {
            groupbyTag: 'service.name',
            groupbyTagEntity: entityTypes.DESTINATION
          }
        })
      );
    });

    it('adds endpoint grouping for per Service smart alerts', () => {
      const args = {
        ...testArguments,
        alertConfig: { ...testArguments.alertConfig, evaluationType: 'PER_AP_SERVICE' }
      };
      const getLinkToApplicationAnalyze = jest.fn(() => '');

      getLinkToUnboundAnalytics(args, getLinkToApplicationAnalyze);

      expect(getLinkToApplicationAnalyze).toHaveBeenLastCalledWith(
        expect.objectContaining({
          groupBy: {
            groupbyTag: 'endpoint.name',
            groupbyTagEntity: entityTypes.DESTINATION
          }
        })
      );
    });

    it('adds call name grouping for per endpoint smart alerts', () => {
      const args = {
        ...testArguments,
        alertConfig: { ...testArguments.alertConfig, evaluationType: 'PER_AP_ENDPOINT' }
      };
      const getLinkToApplicationAnalyze = jest.fn(() => '');

      getLinkToUnboundAnalytics(args, getLinkToApplicationAnalyze);

      expect(getLinkToApplicationAnalyze).toHaveBeenLastCalledWith(
        expect.objectContaining({
          groupBy: {
            groupbyTag: 'call.name'
          }
        })
      );
    });
  });
});
