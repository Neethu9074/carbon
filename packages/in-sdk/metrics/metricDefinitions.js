/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ensureInfraPluginsAreEvaluated } from 'in-sdk/asyncEvaluation';
import { number } from 'in-services/formatters/number';
import { emptyArray } from 'in-services/fixedObjects';

// {
//   <plugin>: [
//     {
//       label: 'CPU',
//       type: 'category',
//       children: [
//         {
//           label: 'Load',
//           metric: 'cpu.load',
//           type: 'metric'
//         }
//       ]
//     }
//   ]
// }
const categories = {};

// {
//   <plugin>: [
//     {
//       label: 'CPU',
//       type: 'category',
//       children: [
//         {
//           label: 'Load',
//           metric: {
//             pattern: RegExp(${pre}\\.(.*)\\.${post}$, 'i'),
//             pre: 'fs',
//             post: 'free',
//             placeholderLabel: 'Device'
//           },
//           type: 'metric'
//         }
//       ]
//     }
//   ]
// }
const dynamicMetricCategories = {};

// {
//   <plugin>: [
//     {
//       test(),
//       metric,
//       label,
//       getMetric,
//       getLabel,
//       category,
//       getMin(snapshot),
//       getMax(snapshot),
//       formatter: {
//         compact,
//         detailed
//       }
//     }
//   ]
// }

export const metricDefinitions = {};

export function registerMetricDefinition(plugin, metricDefinition) {
  // unsure that all definitions have the same structure
  if (!metricDefinition.metrics) {
    metricDefinition.metrics = [metricDefinition.metric];
    metricDefinition.labels = [metricDefinition.label];
  }

  const metricDefinitionsForPlugin = (metricDefinitions[plugin] = metricDefinitions[plugin] || []);
  let formatter = number;
  if (typeof metricDefinition.formatter === 'function') {
    formatter = {
      compact: metricDefinition.formatter,
      detailed: metricDefinition.formatter
    };
  } else if (
    typeof metricDefinition.formatter === 'object' &&
    typeof metricDefinition.formatter.compact === 'function' &&
    typeof metricDefinition.formatter.detailed === 'function'
  ) {
    formatter = metricDefinition.formatter;
  }

  for (let i = 0, len = metricDefinition.metrics.length; i < len; i++) {
    const metric = metricDefinition.metrics[i];
    const label = metricDefinition.labels[i] || String(metric);
    metricDefinitionsForPlugin.push({
      metric,
      label,
      getLabel: getLabel(label),
      test: getTestFunction(metric),
      category: metricDefinition.category || [],
      hideInMetricSelector: !!metricDefinition.hideInMetricSelector,
      getMin: getMin(metricDefinition),
      getMax: getMax(metricDefinition),
      formatter,
      isPercentile: metricDefinition.isPercentile
    });
  }
}

function getMin(metricDefinition) {
  if (typeof metricDefinition.min === 'function') {
    return metricDefinition.min;
  } else if (metricDefinition.min != null) {
    return () => metricDefinition.min;
  }
  return metricDefinition.getMin || alwaysUndefined;
}

function getMax(metricDefinition) {
  if (typeof metricDefinition.max === 'function') {
    return metricDefinition.max;
  } else if (metricDefinition.max != null) {
    return () => metricDefinition.max;
  }
  return metricDefinition.getMax || alwaysUndefined;
}

function getTestFunction(metric) {
  const type = typeof metric;
  if (type === 'string') {
    return s => s === metric;
  } else if (metric instanceof RegExp) {
    return s => metric.test(s);
  } else if (type === 'object') {
    return s => metric.pattern.test(s);
  }

  throw new Error(`Unsupported metric of type ${type}: ${metric}`);
}

function getLabel(label) {
  const type = typeof label;
  if (type === 'string') {
    return () => label;
  } else if (type === 'function') {
    return label;
  }

  throw new Error(`Unsupported label of type ${type}: ${label}`);
}

function alwaysUndefined() {
  return undefined;
}
function alwaysTrue() {
  return true;
}

export function getMetricDefinition(plugin, metric) {
  ensureInfraPluginsAreEvaluated();
  const metricDefinitionsForPlugin = metricDefinitions[plugin];
  if (!metricDefinitionsForPlugin) {
    return getDefaultMetricDefinition(metric);
  }

  for (const metricDefinition of metricDefinitionsForPlugin) {
    if (metricDefinition.test(metric)) {
      return bindMetricMatchToGetters(metric, metricDefinition);
    }
  }

  return getDefaultMetricDefinition(metric);
}

function getDefaultMetricDefinition(metric) {
  return {
    metric,
    label: metric,
    getLabel: () => metric,
    test: alwaysTrue,
    category: emptyArray,
    hideInMetricSelector: false,
    getMin: alwaysUndefined,
    getMax: alwaysUndefined,
    formatter: number
  };
}

function bindMetricMatchToGetters(metric, metricDefinition) {
  let metricPattern;
  if (metricDefinition.metric instanceof RegExp) {
    metricPattern = metricDefinition.metric;
  } else if (metricDefinition.metric instanceof Object) {
    metricPattern = metricDefinition.metric.pattern;
  } else {
    // type string
    return metricDefinition;
  }
  metricDefinition = Object.create(metricDefinition);
  metricDefinition.metricPattern = metricDefinition.metric;
  metricDefinition.metric = metricPattern; // for compatibility to ChartsForSelectedEntities

  const match = metric.match(metricDefinition.metric);
  metricDefinition.getMin = simpleCurryOne(metricDefinition.getMin, match);
  metricDefinition.getMax = simpleCurryOne(metricDefinition.getMax, match);
  metricDefinition.getLabel = simpleCurryOne(metricDefinition.getLabel, match);
  return metricDefinition;
}

function simpleCurryOne(fn, value) {
  return a => fn(a, value);
}

/**
 * Get the metric definitions for the given plugin for plain metrics.
 */
export function getCategories(plugin) {
  ensureInfraPluginsAreEvaluated();
  if (categories[plugin]) {
    return categories[plugin];
  }
  const pluginCategories = (categories[plugin] = buildCategories(plugin));
  return pluginCategories;
}

function buildCategories(plugin) {
  const metricDefinitionsForPlugin = metricDefinitions[plugin];
  if (!metricDefinitionsForPlugin || metricDefinitionsForPlugin.length === 0) {
    return [];
  }

  const root = {
    label: 'root',
    type: 'category',
    children: []
  };

  metricDefinitionsForPlugin.forEach(metricDefinitionForPlugin => {
    // this does not include metrics that are matched based on regex
    if (typeof metricDefinitionForPlugin.metric === 'string' && !metricDefinitionForPlugin.hideInMetricSelector) {
      insertMetric(root, metricDefinitionForPlugin);
    }
  });

  sortCategories(root);
  return root.children;
}

/**
 * Get the metric definitions for the given plugin for dynamic metrics (with only one placeholder).
 */
export function getDynamicMetricCategories(plugin) {
  ensureInfraPluginsAreEvaluated();
  if (dynamicMetricCategories[plugin]) {
    return dynamicMetricCategories[plugin];
  }
  const pluginCategories = (dynamicMetricCategories[plugin] = buildDynamicMetricCategories(plugin));
  return pluginCategories;
}

export function hasCategory(plugin) {
  return getCategories(plugin).length > 0 || getDynamicMetricCategories(plugin).length > 0;
}

function buildDynamicMetricCategories(plugin) {
  const metricDefinitionsForPlugin = metricDefinitions[plugin];
  if (!metricDefinitionsForPlugin || metricDefinitionsForPlugin.length === 0) {
    return [];
  }

  const root = {
    label: 'root',
    type: 'category',
    children: []
  };

  metricDefinitionsForPlugin.forEach(metricDefinitionForPlugin => {
    // this does not include metrics that are matched based on regex directly,
    // but only when the patter, prefix and postfix are nested in an object
    if (
      typeof metricDefinitionForPlugin.metric === 'object' &&
      !(metricDefinitionForPlugin.metric instanceof RegExp) &&
      !metricDefinitionForPlugin.hideInMetricSelector
    ) {
      insertMetric(root, metricDefinitionForPlugin, metricDefinitionForPlugin.category, 'metric');
    }
  });
  sortCategories(root);
  return root.children;
}

function insertMetric(node, metricDefinitionForPlugin, category, type = 'metric') {
  category = category || metricDefinitionForPlugin.category;

  if (category.length === 0) {
    node.children.push({
      label: metricDefinitionForPlugin.label,
      metric: metricDefinitionForPlugin.metric,
      formatter: metricDefinitionForPlugin.formatter,
      type,
      isPercentile: metricDefinitionForPlugin.isPercentile
    });
    return;
  }

  let nextNode;
  for (let i = 0, len = node.children.length; i < len && nextNode == null; i++) {
    const childNode = node.children[i];
    if (childNode.type === 'category' && childNode.label === category[0]) {
      nextNode = childNode;
    }
  }

  if (nextNode == null) {
    nextNode = {
      label: category[0],
      type: 'category',
      children: []
    };
    node.children.push(nextNode);
  }

  insertMetric(nextNode, metricDefinitionForPlugin, category.slice(1), type);
}

function sortCategories(node) {
  if (node.children) {
    node.children.sort((a, b) => {
      const aLabel = typeof a.label === 'function' ? a.label() : a.label;
      const bLabel = typeof b.label === 'function' ? b.label() : b.label;
      return aLabel.localeCompare(bLabel);
    });
    node.children.forEach(sortCategories);
  }
}

/**
 * Custom metrics which full metric name is not defined by Instana, and are added for our Acceptor only.
 * @param pre The mandatory prefix of the metric.
 * @param post The optional postfix of the metric.
 */
export function getCustomMetricMatch(pre, post) {
  return post ? new RegExp(`^${pre}\\.(.*)\\.${post}$`, 'i') : new RegExp(`^${pre}\\.(.*)$`, 'i');
}

/**
 * Dynamic built-in metrics using this match-definition are also included as built-in metrics for Custom Events.
 * As of now, only a single placeholder is supported.
 * @param pre The mandatory prefix of the metric.
 * @param post The optional postfix of the metric.
 * @param placeholderLabel The label of the placeholder in the metric-pattern, to explain what it represents.
 */
export function getDynamicMetricMatch(pre, post, placeholderLabel = 'Placeholder') {
  const patternString = post ? `^${pre}\\.(.*)\\.${post}$` : `^${pre}\\.(.*)$`;
  return {
    pattern: new RegExp(patternString, 'i'),
    pre,
    post,
    placeholderLabel
  };
}

export function isMetricPercentile(plugin, metricName) {
  if (!plugin || !metricName) {
    return false;
  }

  const categories = getCategories(plugin);
  if (!categories) {
    return false;
  }

  let isPercentile = false;
  categories.forEach(category => {
    if (category.children) {
      category.children.forEach(child => {
        if (metricName === child.metric && child.isPercentile) {
          isPercentile = true;
          return;
        }
      });
    } else if (metricName === category.metric && category.isPercentile) {
      isPercentile = true;
    }

    if (isPercentile) {
      return;
    }
  });
  return isPercentile;
}
