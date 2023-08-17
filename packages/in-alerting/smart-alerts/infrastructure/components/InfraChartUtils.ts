/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { AggregationType, InfraAlertConfigWithMetadata, ThresholdConfigUnion, TimeConfig } from '@instana/types';

interface UnifiedMetricConfigProps {
  alertConfig: InfraAlertConfigWithMetadata;
  metricFormatterId: any;
  line: { id: string; label: string };
  aggregation: AggregationType;
  metricLabel: string;
  metricName: string;
  entityType: string;
}

export function getUnifiedMetricConfig({
  alertConfig,
  metricFormatterId,
  line,
  aggregation,
  metricLabel,
  metricName,
  entityType
}: UnifiedMetricConfigProps) {
  return {
    type: 'TIME_SERIES',
    granularity: alertConfig.granularity,
    y1: {
      formatter: metricFormatterId,
      min: 0,
      renderer: line.id,
      metrics: [
        {
          aggregation: aggregation,
          label: metricLabel,
          metric: metricName,
          source: 'INFRASTRUCTURE_METRICS',
          tagFilterExpression: alertConfig.tagFilterExpression,
          timeShift: 0,
          type: entityType
        }
      ]
    }
  };
}

interface ChartConfigProps {
  threshold: ThresholdConfigUnion;
  timeConfig: TimeConfig;
  chartViewConfig: { timeConfig: TimeConfig };
  metricName: string;
  granularity: number;
  aggregation: AggregationType;
}

export function getChartConfig({
  threshold,
  timeConfig,
  chartViewConfig,
  metricName,
  granularity,
  aggregation
}: ChartConfigProps) {
  return {
    customHeight: 182,
    thresholdType: threshold.type,
    timeConfig: timeConfig,
    metricsConfiguration: {
      timeConfig: chartViewConfig.timeConfig,
      metrics: {
        [metricName]: {
          metric: metricName,
          granularity,
          aggregation
        }
      }
    }
  };
}
