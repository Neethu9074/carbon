/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ConfigProps } from 'in-custom-dashboards/widgets/BigNumber/Widget';
import { sloFullEnabled } from 'in-services/featureFlags';

export default function hideSloSource(widgetConfig: ConfigProps) {
  if (widgetConfig.metricConfiguration.source === 'SLO' && !sloFullEnabled) {
    return true;
  }
  return false;
}
