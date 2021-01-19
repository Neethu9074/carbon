/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
  getDynamicMetricCategories,
  hasCategory,
  isMetricPercentile
} from 'in-sdk/metrics/metricDefinitions';

import { getCategories, getDynamicMetricCategories } from 'in-sdk/metrics/metricDefinitions';

const dynamicMetricNoPostfixItemDelimiter = '.*';
const dynamicMetricItemDelimiter = '.*.';

export function getPlainMetricList(plugin) {
  const categoryTree = getCategories(plugin);
  if (categoryTree.length === 0) {
    return [];
  }
  const metrics = [];
  for (const categoryNode of categoryTree) {
    collectMetrics(metrics, categoryNode, categoryNode.label, getLabel);
  }
  return metrics;
}

function getLabel(categoryLabel, label) {
  const metricLabel = typeof label === 'string' ? label : label();
  if (categoryLabel && typeof categoryLabel === 'string' && categoryLabel !== metricLabel) {
    return `${categoryLabel} > ${metricLabel}`;
  }
  return metricLabel;
}

function getDynamicMetricList(plugin) {
  const categoryTree = getDynamicMetricCategories(plugin);
  if (categoryTree.length === 0) {
    return [];
  }
  const metrics = [];
  for (const categoryNode of categoryTree) {
    collectMetrics(metrics, categoryNode, categoryNode.label, getLabel, getDynamicMetricLabel);
  }
  return metrics;
}

function getDynamicMetricStringValueList(plugin) {
  return getDynamicMetricList(plugin).map(item => {
    return {
      ...item,
      value: toDynamicMetricStringValue(item.value.pre, item.value.post)
    };
  });
}

function getDynamicMetricLabel(metricObj) {
  if (metricObj.post) {
    return `${metricObj.pre}.{${metricObj.placeholderLabel.toLowerCase()}}.${metricObj.post}`;
  }
  return `${metricObj.pre}.{${metricObj.placeholderLabel.toLowerCase()}}`;
}

export function toDynamicMetricStringValue(prefix, postfix) {
  return postfix
    ? `${prefix}${dynamicMetricItemDelimiter}${postfix}`
    : `${prefix}${dynamicMetricNoPostfixItemDelimiter}`;
}

export function getAllBuiltInMetrics(plugin) {
  const metricsList = getPlainMetricList(plugin);
  const metricsWithPatternList = getDynamicMetricStringValueList(plugin);
  return metricsList.concat(metricsWithPatternList);
}

export function isBuiltInPlainMetric(plugin, metricName) {
  const metrics = getPlainMetricList(plugin);
  return containsMetricInList(metrics, metricName);
}

export function isBuiltInDynamicMetric(plugin, metricName) {
  const metrics = getDynamicMetricStringValueList(plugin);
  return containsMetricInList(metrics, metricName);
}

export function containsMetricInList(metricList, metricName) {
  if (!metricList || !metricName) {
    return false;
  }

  for (const metricItem of metricList) {
    if (metricItem.value === metricName) {
      return true;
    }
  }
  return false;
}

export function createMetricListItem(metricName, formatter, label, metricLabel) {
  return {
    value: metricName,
    formatter,
    label,
    metricLabel
  };
}

function collectMetrics(allOptions, categoryNode, categoryLabel, labelFormatter, metricLabelFormatter = v => v) {
  if (categoryNode.type === 'metric') {
    const metricItem = createMetricListItem(
      categoryNode.metric,
      categoryNode.formatter,
      labelFormatter(categoryLabel, categoryNode.label, categoryNode.metric),
      metricLabelFormatter(categoryNode.metric)
    );
    allOptions.push(metricItem);
  } else {
    for (const childNode of categoryNode.children) {
      collectMetrics(allOptions, childNode, categoryLabel, labelFormatter, metricLabelFormatter);
    }
  }
}
