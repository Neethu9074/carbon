import { bar, stackedBar, stackedArea } from 'in-stores/metric/renderer';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import { getFormatter } from 'in-stores/metric/formatters';
import { aggregationLabels } from 'in-stores/metric';

const latencyDistributionAggregation = {
  id: 'DISTRIBUTION',
  label: aggregationLabels['DISTRIBUTION'],
  renderers: [defaultRenderer('latency', 'DISTRIBUTION')]
};

export const ungroupedChartingOptions = [
  {
    metricId: 'latency',
    label: 'Latency',
    formatter: metricFormatter('latency'),
    aggregations: [latencyDistributionAggregation]
  }
];

export const groupedChartingOptions = {
  calls: convertMetricConfigToChartingOptions(dataSourceConstants['calls'].metricConfiguration),
  traces: convertMetricConfigToChartingOptions(dataSourceConstants['traces'].metricConfiguration)
};

function convertMetricConfigToChartingOptions(metricConfiguration) {
  let options = Object.entries(metricConfiguration).map(([metric, value]) => ({
    metricId: metric,
    label: value.label,
    formatter: metricFormatter(metric),
    aggregations: value.aggregations.map(aggregation => {
      return {
        id: aggregation,
        label: aggregationLabels[aggregation],
        renderers: [defaultRenderer(metric, aggregation)]
      };
    })
  }));

  // add latency distribution chart
  const latencyOption = options.find(option => option.metricId === 'latency');
  latencyOption.aggregations.unshift(latencyDistributionAggregation);

  return options;
}

function metricFormatter(metric) {
  if (metric === 'latency') {
    return 'millis.detailed';
  }
  if (metric === 'errors') {
    return 'percentage.detailed';
  }
  return 'number.compact';
}

export function defaultRenderer(metric, aggregation) {
  if (metric === 'latency') {
    return aggregation === 'DISTRIBUTION' ? bar : stackedArea;
  }
  return stackedBar;
}

export function getGroupChartFormatter(metric) {
  return getFormatter(metricFormatter(metric));
}
