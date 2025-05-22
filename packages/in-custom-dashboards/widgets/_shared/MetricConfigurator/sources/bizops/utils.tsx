/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  BizOpsUnifiedMetricConfiguration,
  isBizOpsUnifiedMetricConfiguration,
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
    const newBusinessMetrics = {
      ...metricConfiguration,
      source: 'BIZOPS',
      dataSource: 'CUSTOM_BUSINESS_METRICS'
    } as BizOpsUnifiedMetricConfigurationWithDataSource;
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

const IsCustomDashboardPage = () => {
  const { matchLocation } = useNavigation();
  return matchLocation(customDashboardsPath);
};
