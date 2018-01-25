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

function getMetrics(allOptions, categoryNode) {
  if (categoryNode.type === 'metric') {
    allOptions.push({
      value: categoryNode.metric,
      formatter: categoryNode.formatter,
      label: `${categoryNode.label} (${categoryNode.metric})`
    });
  } else {
    for (let i = 0, length = categoryNode.children.length; i < length; i++) {
      getMetrics(allOptions, categoryNode.children[i]);
    }
  }
}
