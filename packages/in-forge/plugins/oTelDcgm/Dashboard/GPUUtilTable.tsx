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
  namespace: string;
  pod: string;
  container: string;
  keyName: string;
  key: string;
  snapshotId: string;
  timeConfig: TimeConfig;
}

export default function GPUUtilTable({
  snapshot,
  timeConfig,
  metric,
  keyName,
  title,
  formatter
}: Readonly<{
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
  metric: [];
  keyName: string;
  title: string;
  formatter: (v: number) => string;
}>) {
  const snapshotId = snapshot.get('id') as string;

  const rows = metric.map(metric => {
    const { containerKey, gpu, namespace, pod, container } = parseMetricIdentifier(metric, keyName);
    return {
      key: containerKey,
      name: containerKey,
      keyName: keyName,
      gpu,
      namespace,
      pod,
      container,
      timeConfig,
      snapshot,
      snapshotId
    };
  });

  const containerCol = {
    title: t('in-forge:plugins.oTelDcgm.container.containerName'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.container;
      }
    }
  };

  const podCol = {
    title: t('in-forge:plugins.oTelDcgm.container.podName'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.pod;
      }
    }
  };

  const namespaceCol = {
    title: t('in-forge:plugins.oTelDcgm.container.namespaceName'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.namespace;
      }
    }
  };

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
    title: title,
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

  function getRowDetails(row: Row) {
    return (
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: formatter,
          metrics: [`${row.keyName}.${row.key}`],
          labels: [title],
          type: 'line'
        }}
      />
    );
  }

  if (rows.length === 0) {
    return null;
  }
  const cols = [containerCol, podCol, namespaceCol, gpuNumberCol, metricCol];

  return <Table withoutPadding cardTitle={title} cols={cols} rows={rows} getRowDetails={getRowDetails} />;
}

function parseMetricIdentifier(metric: string, key: string) {
  const trimmedMetric = metric.replace(key + '.', '');
  const match = /^(\d+(?: \(IID \d+\))?)_container=(.*)_pod=(.*)_namespace=(.*)$/.exec(trimmedMetric);

  if (match) {
    const [, gpu, container, pod, namespace] = match;
    return { containerKey: trimmedMetric, gpu, namespace, pod, container };
  } else {
    return { containerKey: '', gpu: '', namespace: '', pod: '', container: '' };
  }
}
