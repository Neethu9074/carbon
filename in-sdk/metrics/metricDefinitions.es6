import {number} from 'in-services/formatters/number';
import {emptyArray} from 'in-services/fixedObjects';

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
//       test(),
//       metric,
//       label,
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
const metricDefinitions = {};

export function registerMetricDefinition(plugin, metricDefinition) {
  // unsure that all definitions have the same structure
  if (!metricDefinition.metrics) {
    metricDefinition.metrics = [metricDefinition.metric];
    metricDefinition.labels = [metricDefinition.label];
  }

  const metricDefinitionsForPlugin = metricDefinitions[plugin] = metricDefinitions[plugin] || [];

  for (let i = 0, len = metricDefinition.metrics.length; i < len; i++) {
    const metric = metricDefinition.metrics[i];
    const label = metricDefinition.labels[i];
    metricDefinitionsForPlugin.push({
      metric,
      label: label || String(metric),
      test: getTestFunction(metric),
      category: metricDefinition.category || [],
      getMin: getMin(metricDefinition),
      getMax: getMax(metricDefinition),
      formatter: metricDefinition.formatter || number
    });
  }
}

function getMin(metricDefinition) {
  if (metricDefinition.min != null) {
    return metricDefinition.min;
  }
  return metricDefinition.getMin || alwaysUndefined;
}


function getMax(metricDefinition) {
  if (metricDefinition.max != null) {
    return metricDefinition.max;
  }
  return metricDefinition.getMax || alwaysUndefined;
}


function getTestFunction(metric) {
  const type = typeof metric;
  if (type === 'string') {
    return s => s === type;
  } else if (metric instanceof RegExp) {
    return s => metric.test(s);
  }

  throw new Error(`Unsupported metric of type ${type}: ${metric}`);
}


function alwaysUndefined() { return undefined; }
function alwaysTrue() { return true; }


export function getMetricDefinition(plugin, metric) {
  const metricDefinitionsForPlugin = metricDefinitions[plugin];
  if (!metricDefinitionsForPlugin) {
    return getDefaultMetricDefinition(metric);
  }

  for (let i = 0, len = metricDefinitionsForPlugin.length; i < len; i++) {
    const metricDefinition = metricDefinitionsForPlugin[i];
    if (metricDefinition.test(metric)) {
      return metricDefinition;
    }
  }

  return getDefaultMetricDefinition(metric);
}


function getDefaultMetricDefinition(metric) {
  return {
    metric,
    label: metric,
    test: alwaysTrue,
    category: emptyArray,
    getMin: alwaysUndefined,
    getMax: alwaysUndefined,
    formatter: number
  };
}


export function getCategories(plugin) {
  if (categories[plugin]) {
    return categories[plugin];
  }
  const pluginCategories = categories[plugin] = buildCategories(plugin);
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
    // we cannot categorise metrics which are matched based on regex
    if (typeof metricDefinitionForPlugin.metric === 'string') {
      insertMetric(root, metricDefinitionForPlugin);
    }
  });

  sortCategories(root);
  return root.children;
}


function insertMetric(node, metricDefinitionForPlugin, category) {
  category = category || metricDefinitionForPlugin.category;

  if (category.length === 0) {
    node.children.push({
      label: metricDefinitionForPlugin.label,
      metric: metricDefinitionForPlugin.metric,
      type: 'metric'
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

  insertMetric(nextNode, metricDefinitionForPlugin, category.slice(1));
}


function sortCategories(node) {
  if (node.children) {
    node.children.sort((a, b) => a.label.localeCompare(b.label));
    node.children.forEach(sortCategories);
  }
}
