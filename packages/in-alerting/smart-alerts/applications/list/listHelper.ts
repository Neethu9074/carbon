/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ApplicationSmartAlertConfig } from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { getBlueprintConfig, MetricName } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';

export const getMetricName = (config: ApplicationSmartAlertConfig) => {
  const { rule } = config;
  const { aggregation, metricName, alertType } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);

  return blueprintConfig.getMetricLabel(metricName as MetricName, aggregation);
};
