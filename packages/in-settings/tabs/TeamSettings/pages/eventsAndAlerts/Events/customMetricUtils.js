/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getPluginsWithCustomMetrics, getCustomMetricsForPlugin } from 'in-api/infraCatalog';
import { createMetricListItem } from 'in-sdk/metrics';

export function getPluginsWithCustomMetricsOptionsObservable() {
  return getPluginsWithCustomMetrics().map(plugins => {
    const result = [];
    if (plugins) {
      plugins.map(plugin => {
        result.push({
          value: plugin.get('plugin'),
          label: plugin.get('label')
        });
      });
    }
    return result;
  });
}

export function getCustomMetricsOptionsForPluginObservable(entityType) {
  return getCustomMetricsForPlugin(entityType).map(metricInstances => {
    const result = [];
    if (metricInstances) {
      metricInstances.map(metricInstance => {
        result.push(
          createCustomMetricListItem(
            metricInstance.get('metricId'),
            metricInstance.get('formatter'),
            metricInstance.get('label'),
            metricInstance.get('pluginId')
          )
        );
      });
    }
    return result;
  });
}

export function createCustomMetricListItem(metricName, formatter, label, entityType) {
  const metricItem = createMetricListItem(metricName, formatter, label, false);
  return {
    ...metricItem,
    entityType
  };
}
