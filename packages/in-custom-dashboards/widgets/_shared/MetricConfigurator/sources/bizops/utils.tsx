/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  BizOpsUnifiedMetricConfiguration,
  isBizOpsUnifiedMetricConfiguration,
  TagFilter,
  TagFilterExpression,
  TagFilterExpressionElementUnion,
  UnifiedMetricConfigurationUnion
} from '@instana/types';
import { BizOpsMetricDataSource, UnifiedMetricConfiguration } from '@instana/types/typeDefinitions';

// @ts-expect-error Module needs to be translated to TS
import { customDashboardsPath } from 'in-custom-dashboards/navigation/url';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

export type BizOpsUnifiedMetricConfigurationWithDataSource = BizOpsUnifiedMetricConfiguration & {
  dataSource: BizOpsMetricDataSource;
};

export const isBusinessMetricsUnifiedMetricConfiguration = (unifiedMetricConfiguration: UnifiedMetricConfiguration) => {
  return unifiedMetricConfiguration.source === 'BUSINESS_METRICS';
};

export const isCustomBusinessMetricsSource = (metricConfiguration: BizOpsUnifiedMetricConfiguration) => {
  return metricConfiguration.dataSource === 'CUSTOM_BUSINESS_METRICS';
};

/**
 * In case of a BizOpsUnifiedMetricConfiguration, it will be enriched:
 * "source" needs to be set to 'BUSINESS_FLOW_OBJECTS' for correct custom dashboard subscription results
 *
 * It creates a cloned object, don't add to existing object.
 */
export const enrichBySettingDataSource = (
  metricConfiguration: UnifiedMetricConfigurationUnion
): UnifiedMetricConfigurationUnion | BizOpsUnifiedMetricConfigurationWithDataSource => {
  if (isBusinessMetricsUnifiedMetricConfiguration(metricConfiguration) && IsCustomDashboardPage()) {
    let newBusinessMetrics = {
      ...metricConfiguration,
      dataSource: 'CUSTOM_BUSINESS_METRICS'
    } as BizOpsUnifiedMetricConfigurationWithDataSource;

    if (newBusinessMetrics.tagFilterExpression) {
      const newTagFilterExpression = mapTagFilterExpression(newBusinessMetrics.tagFilterExpression);
      newBusinessMetrics = {
        ...newBusinessMetrics,
        tagFilterExpression: newTagFilterExpression
      };
    }

    return newBusinessMetrics;
  } else if (
    isBizOpsUnifiedMetricConfiguration(metricConfiguration) &&
    !isCustomBusinessMetricsSource(metricConfiguration) &&
    IsCustomDashboardPage()
  ) {
    const newMetrics: BizOpsUnifiedMetricConfigurationWithDataSource = {
      ...metricConfiguration,
      dataSource: 'BUSINESS_FLOW_OBJECTS'
    };
    return newMetrics;
  }
  return metricConfiguration;
};

const mapTagFilterExpression = (
  tagFilterExpression: TagFilterExpressionElementUnion
): TagFilterExpressionElementUnion => {
  if (tagFilterExpression.type === 'EXPRESSION') {
    const modifiedFilterExpression: TagFilterExpression = {
      ...tagFilterExpression,
      elements: tagFilterExpression.elements.map(tagFilter => mapTagFilterExpression(tagFilter))
    };
    return modifiedFilterExpression;
  } else {
    const modifiedTagFilter: TagFilter = {
      ...tagFilterExpression,
      name: 'otel.business.metric.tag',
      key: tagFilterExpression.name
    };
    return modifiedTagFilter;
  }
};

const IsCustomDashboardPage = () => {
  const { matchLocation } = useNavigation();
  return matchLocation(customDashboardsPath);
};
