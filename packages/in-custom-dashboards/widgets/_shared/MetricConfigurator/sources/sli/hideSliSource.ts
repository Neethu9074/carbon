/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Result, SliConfigurationWithLastUpdated } from '@instana/types';

import { ConfigProps } from 'in-custom-dashboards/widgets/BigNumber/Widget';
import { sloFullEnabled, sloLiteEnabled } from 'in-services/featureFlags';
import { isLoading } from 'in-services/util/result';

export default function hideSliSource(
  widgetConfig: ConfigProps,
  sliConfig: Result<SliConfigurationWithLastUpdated> | Result<null>
) {
  if (isLoading(sliConfig)) return true;
  const sliType = sliConfig?.data?.sliEntity?.sliType;
  const isWebsite = sliType === 'websiteEventBased' || sliType === 'websiteTimeBased';

  const sloDisabled = !sloFullEnabled && !sloLiteEnabled;
  const isV1 = !sloFullEnabled && sloLiteEnabled;

  if (widgetConfig.metricConfiguration.source === 'SLI' && (sloDisabled || (isV1 && isWebsite))) {
    return true;
  }
  return false;
}
