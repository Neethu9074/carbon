import { siPrefixPerSecond, siPrefix } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { isInstanaTenant } from 'in-services/config';

const metricDefinitions = [
  {
    metric: getMetricMatch('metrics', 'gauges'),
    label(snapshot, metricMatch) {
      return metricMatch[1];
    },
    formatter: siPrefix
  },
  {
    metric: getMetricMatch('metrics', 'counters'),
    label(snapshot, metricMatch) {
      return metricMatch[1];
    },
    min: 0,
    formatter: siPrefix
  }
];

if (isInstanaTenant()) {
  metricDefinitions.push(
    {
      metric: 'metrics.meters.com.instana.filler.topology.spans.SpansStreamInitializer.accepted-from-kafka-spans',
      label: 'Accepted Spans',
      min: 0,
      formatter: siPrefixPerSecond
    },
    {
      metric: 'metrics.meters.com.instana.filler.spanbuffer.ScheduledSpanBatcher.dropped-spans',
      label: 'Dropped Spans',
      min: 0,
      formatter: siPrefixPerSecond
    },
    {
      metric: 'metrics.meters.com.instana.filler.topology.RawMessagesStreamInitializer.dropped-messages',
      label: 'Dropped Messages',
      min: 0,
      formatter: siPrefixPerSecond
    }
  );
}

export default metricDefinitions;
