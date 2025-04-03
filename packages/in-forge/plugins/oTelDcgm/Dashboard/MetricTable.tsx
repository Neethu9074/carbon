/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { WINDOW_FOR_LATEST_METRIC } from 'in-forge/plugins/oTelDcgm/constants';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface Row {
  gpu: string;
  instances: string[];
  keyName: string;
  key: string;
  snapshotId: string;
  timeConfig: TimeConfig;
}

export default function MetricTable({
  snapshot,
  timeConfig,
  metric,
  keyName,
  formatter,
  title,
  colHeader
}: Readonly<{
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
  metric: any[];
  keyName: string;
  formatter: (v: number) => string;
  title: string;
  colHeader: string;
}>) {
  const snapshotId = snapshot.get('id') as string;

  const gpuNumberCol = {
    title: t('in-forge:plugins.oTelDcgm.container.gpuNumber'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.gpu;
      }
    }
  };

  const metricCol = {
    title: colHeader,
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.snapshotId;
      },
      getMetricName(row: Row) {
        return `${row.keyName}.${row.key}`;
      },
      getContent: formatter,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getWindowForLatest() {
        return WINDOW_FOR_LATEST_METRIC;
      }
    }
  };

  function extractGPUNumber(str: string): string | null {
    const match = RegExp(`^${keyName}\\.(\\d+) \\(IID \\d+\\)(_container=(.*)_pod=(.*)_namespace=(.*))?$`).exec(str);
    if (match) {
      return match[1];
    }
    return null;
  }

  function generateLabels(metrics: string[], defaultLabel: string) {
    return metrics.map((metric: string) => {
      const match = RegExp(`^${keyName}\\.(\\d+) \\((IID \\d+)\\)(_container=(.*)_pod=(.*)_namespace=(.*))?$`).exec(
        metric
      );
      if (match) {
        return match[2]; // The first captured group (the first number after "DCGM_FI_DEV_GPU_TEMP.")
      }
      return defaultLabel;
    });
  }

  function getRowDetails(row: Row) {
    return (
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: formatter,
          metrics: row.instances,
          labels: generateLabels(row.instances, 'IID unknown'),
          type: 'line'
        }}
      />
    );
  }

  const gpus = Array.from(new Set(metric.map(extractGPUNumber).filter(gpu => gpu != null)));
  const instancePattern = RegExp(`^${keyName}\\.\\d+ \\(IID \\d+\\)(_container=(.*)_pod=(.*)_namespace=(.*))?$`);
  const rows = gpus.map(gpu => {
    return {
      key: `${gpu}`,
      name: `${gpu}`,
      keyName: keyName,
      gpu,
      formatter: formatter,
      instances: metric.filter(m => instancePattern.test(m)),
      timeConfig,
      snapshot,
      snapshotId
    };
  });

  if (rows.length === 0) {
    return null;
  }
  const cols = [gpuNumberCol, metricCol];

  return <Table withoutPadding cardTitle={title} cols={cols} rows={rows} getRowDetails={getRowDetails} />;
}
