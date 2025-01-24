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

// @ts-expect-error Module needs to be translated to TS
import { customDashboardsPath } from 'in-custom-dashboards/navigation/url';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

export type BizOpsUnifiedMetricConfigurationWithDataSource = BizOpsUnifiedMetricConfiguration & {
  dataSource: 'BUSINESS_FLOW_OBJECTS';
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
  if (isBizOpsUnifiedMetricConfiguration(metricConfiguration) && IsCustomDashboardPage()) {
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
