export {
  addMaxValueLocator,
  addMinValueLocator,
  addFormattedValueLocator,
  getMaxValue,
  getMinValue,
  getFormattedValue
} from 'in-sdk/metrics/legacy';
export {
  registerMetricDefinition,
  getMetricDefinition,
  getCategories,
  isMetricPercentile
} from 'in-sdk/metrics/metricDefinitions';

import { getCategories } from 'in-sdk/metrics';

export function getPlainMetricList(plugin) {
  const categoryTree = getCategories(plugin);
  if (categoryTree.length === 0) {
    return [];
  }
  const metrics = [];
  for (let i = 0, length = categoryTree.length; i < length; i++) {
    getMetrics(metrics, categoryTree[i]);
  }
  return metrics;
}

export function isBuiltInMetric(plugin, metricName) {
  const metrics = getPlainMetricList(plugin);
  return containsMetricInList(metrics, metricName);
}

export function containsMetricInList(metricList, metricName) {
  if (!metricList || !metricName) {
    return false;
  }

  for (let i = 0; i < metricList.length; i++) {
    if (metricList[i].value === metricName) {
      return true;
    }
  }
  return false;
}

export function createMetricListItem(metricName, formatter, label, entityType) {
  if (!label) {
    label = `Unknown label (${metricName})`;
  } else if (!label.includes(metricName)) {
    label += ` (${metricName})`;
  }

  return {
    value: metricName,
    formatter: formatter,
    label: label,
    entityType: entityType
  };
}

function getMetrics(allOptions, categoryNode) {
  if (categoryNode.type === 'metric') {
    allOptions.push(createMetricListItem(categoryNode.metric, categoryNode.formatter, categoryNode.label));
  } else {
    for (let i = 0, length = categoryNode.children.length; i < length; i++) {
      getMetrics(allOptions, categoryNode.children[i]);
    }
  }
}
