import {number} from 'in-services/formatters/number';
import {emptyArray} from 'in-services/fixedObjects';

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
    metricDefinition.labels = [metricDefinition.labels];
  }

  const metricDefinitionsForPlugin = metricDefinitions[plugin] = metricDefinitions[plugin] || [];

  for (let i = 0, len = metricDefinition.metrics.length; i < len; i++) {
    const metric = metricDefinition.metrics[i];
    const label = metricDefinition.labels[i];
    metricDefinitionsForPlugin.push({
      metric,
      label,
      test: getTestFunction(metric),
      category: metricDefinition.category || [],
      getMin: metricDefinition.getMin || alwaysUndefined,
      getMax: metricDefinition.getMax || alwaysUndefined,
      formatter: metricDefinition.formatter || number
    });
  }
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
