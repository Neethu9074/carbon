import { bar, stackedBar, stackedArea } from 'in-stores/metric/renderer';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import { getFormatter } from 'in-stores/metric/formatters';
import { aggregationLabels } from 'in-stores/metric';

// Converts the available chart metrics into a format required by ChartingConfiguratorSection.
// At the moment the charting options are dynamic based on the metrics selected for the result
// table or group list.
export function chartingOptions({ dataSource, isGrouped, selectedMetrics }) {
  // latency distribution chart metric is always available
  const latencyDistribution = { metric: 'latency', aggregation: 'DISTRIBUTION' };
  const metrics = isGrouped ? [...selectedMetrics, latencyDistribution] : [latencyDistribution];

  const aggregationsByMetric = metrics.reduce((result, { metric, aggregation }) => {
    const aggregations = result[metric] ?? [];
    result[metric] = [...aggregations, aggregation];
    return result;
  }, {});

  return Object.entries(aggregationsByMetric).map(([ metric, aggregations ]) => {
    return {
      metricId: metric,
      label: dataSourceConstants[dataSource].metricConfiguration[metric]?.label,
      formatter: metricFormatter(metric),
      aggregations: aggregations.map(aggregation => {
        return { id: aggregation, label: aggregationLabels[aggregation], renderers: [defaultRenderer(metric, aggregation)] };
      })
    };
  });
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
  // return stackedArea;
  return stackedBar;
}

export function getGroupChartFormatter(metric) {
  return getFormatter(metricFormatter(metric));
}
