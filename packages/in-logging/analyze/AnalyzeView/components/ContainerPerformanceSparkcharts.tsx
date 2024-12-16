/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Stack } from '@instana/components';

// @ts-expect-error
import HistoricMetricSparkChart from 'in-components/SparkChart/HistoricMetricSparkChart';
import { percentage } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

import locals from './ContainerPerformanceSparkcharts.mless';

export { extendWindowSizeOnLiveMode, getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';

interface Props {
  snapshotId?: string;
}

const ContainerPerformanceSparkCharts = (props: Props): JSX.Element | null => {
  const { snapshotId } = props;

  if (!snapshotId) {
    return null;
  }

  const metrics = [
    {
      label: t('in-logging:cpuTotal'),
      name: 'cpu.total_usage'
    },
    {
      label: t('in-logging:memoryUsage'),
      name: 'memory.used_percentage'
    }
  ];

  return (
    <Stack direction="horizontal" gap="large">
      {metrics.map((metric, i) => (
        <Stack key={i} direction="horizontal" gap="small">
          <HistoricMetricSparkChart
            width={56}
            height={48}
            snapshotId={snapshotId}
            metric={metric.name}
            tooltipFormatter={percentage.detailed}
            label={metric.label}
            aggregation="mean"
            showDots
          />
          <Stack direction="vertical" gap="xsmall" distribution="center">
            <label className={locals.metricLabel}>{metric.label}</label>
            <MetricValue
              className={locals.metricValue}
              snapshotId={snapshotId}
              metric={metric.name}
              formatter={percentage.detailed}
            />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

export default ContainerPerformanceSparkCharts;
