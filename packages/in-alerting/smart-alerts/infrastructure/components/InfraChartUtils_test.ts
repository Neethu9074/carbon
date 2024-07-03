/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Granularity, InfraAlertRuleUnion, TagFilterExpression, TagFilterExpressionElementUnion } from '@instana/types';

import {
  getEnrichedTagFilterExpression,
  getUnifiedMetricConfig,
  getChartConfig
} from 'in-alerting/smart-alerts/infrastructure/components/InfraChartUtils';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { Tags } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { addTagFilters } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import data from 'in-alerting/smart-alerts/infrastructure/data/chartTestData.json';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';

describe('in-alerting/smart-alerts/infrastructure/components/InfraChartUtils.ts', () => {
  describe('getEnrichedTagFilterExpression', () => {
    // GIVEN
    const tagFilterExpression = data.tagFilterExpression as TagFilterExpressionElementUnion;
    const tagFilterExpressionElement = data.tagFilterExpressionElement as TagFilterExpressionElementUnion;

    const selectedMetricGroup: Tags = {
      label: 'RDWebAccess (IIS worker)'
    };

    const groupingTFE: TagFilterExpression = { type: 'EXPRESSION', logicalOperator: 'AND', elements: [] };
    const groupExpression = tagFilter('label', EQUALS, 'RDWebAccess (IIS worker)');
    groupingTFE.elements.push(groupExpression);

    it('adds a metric group to an empty tag filter expression', () => {
      // WHEN
      const result = getEnrichedTagFilterExpression(tagFilterExpression, selectedMetricGroup);
      const Tfe = {
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: [tagFilterExpression, groupingTFE]
      };

      // THEN
      expect(result).toEqual(Tfe);
    });

    it('adds a metric group to a non-empty tagFilterExpression', () => {
      // GIVEN
      const result = getEnrichedTagFilterExpression(tagFilterExpressionElement, selectedMetricGroup);
      const Tfe = addTagFilters(tagFilterExpressionElement, [groupingTFE]);

      // THEN
      expect(result).toEqual(Tfe);
    });

    it('does not modify a tagFilterExpression without a metric group', () => {
      // GIVEN
      const result = getEnrichedTagFilterExpression(tagFilterExpressionElement, undefined);

      // THEN
      expect(result).toEqual(tagFilterExpressionElement);
    });

    it('empty metric group to a non-empty tagFilterExpression', () => {
      // GIVEN
      const result = getEnrichedTagFilterExpression(tagFilterExpression, undefined);
      const Tfe = {
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: [tagFilterExpression]
      };

      // THEN
      expect(result).toEqual(Tfe);
    });
  });

  describe('getUnifiedMetricConfig', () => {
    it('should return the correct unified metric config', () => {
      // GIVEN
      const config = data.config;
      const expectedResult = data.expectedResult;

      // THEN
      expect(
        getUnifiedMetricConfig(
          config.alertRule as InfraAlertRuleUnion,
          config.enrichedTagFilterExpression as TagFilterExpressionElementUnion,
          config.granularity as Granularity
        )
      ).toEqual(expectedResult);
    });
  });

  describe('getChartConfig', () => {
    it('should return the correct chart config', () => {
      // GIVEN

      const alertConfig = data.alertConfig as InfraSmartAlertConfigWithMetadata;
      const timeConfig = data.timeConfig;

      // WHEN
      const expectedResult = data.predictionsExpectedResult;

      // THEN
      expect(getChartConfig({ alertConfig, timeConfig })).toEqual(expectedResult);
    });
  });
});
