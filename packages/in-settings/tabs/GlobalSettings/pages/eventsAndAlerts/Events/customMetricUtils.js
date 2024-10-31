/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isDeprecatedEntityType } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { getPluginsWithCustomMetrics, getCustomMetricsForPlugin } from 'in-api/infraCatalog';
import { getFormatterType } from 'in-services/formatters/number';
import { compareIgnoreCase } from 'in-services/util/string';
import { createMetricListItem } from 'in-sdk/metrics';
import { getPluginName } from 'in-sdk/pluginName';
import { find } from 'in-services/arrayUtils';
import { t } from 'in-i18n';

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

export function updateEntityTypesWithDeprecation(pluginsWithMetricDefinitions, form) {
  const entityType = form.get('entityType')?.value;

  if (entityType && isDeprecatedEntityType(entityType)) {
    const pluginName = getPluginName(entityType, 1);

    pluginsWithMetricDefinitions.push({
      value: entityType,
      label: t('in-settings:tabs.team.events.withDeprecatedSuffix', { pluginName })
    });
  }

  // re-ensure correct order of the list
  pluginsWithMetricDefinitions.sort((a, b) => compareIgnoreCase(a.label, b.label));
}

export const unknownMetricLabel = t('in-settings:tabs.unknown');
export const undefinedMetricFormatter = 'UNDEFINED';
export function getBuiltInMetricInfo(metricItem) {
  let formatter = undefinedMetricFormatter;
  let label = unknownMetricLabel;

  if (metricItem != null) {
    formatter = getFormatterType(metricItem.formatter);
    label = metricItem.origLabel || metricItem.label;
  }

  return {
    formatter,
    label
  };
}

export function getCustomMetricInfo(customMetrics, selectedMetric) {
  let formatter = undefinedMetricFormatter;
  let label = unknownMetricLabel;

  const metricItem = find(customMetrics, _metric => _metric.value === selectedMetric);
  if (metricItem != null) {
    formatter = metricItem.formatter;
    label = metricItem.origLabel || metricItem.label;
  }

  return {
    formatter,
    label
  };
}
