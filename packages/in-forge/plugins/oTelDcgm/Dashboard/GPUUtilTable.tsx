/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { WINDOW_FOR_LATEST_METRIC } from 'in-forge/plugins/oTelDcgm/constants';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { percentage } from 'in-services/formatters/number';
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

const gpuUtilCol = {
  title: t('in-forge:plugins.oTelDcgm.container.util'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: Row) {
      return row.snapshotId;
    },
    getMetricName(row: Row) {
      return `${row.keyName}.${row.key}`;
    },
    getContent: percentage.detailed,
    getTimeWindowAggregation() {
      return 'mean';
    },
    getWindowForLatest() {
      return WINDOW_FOR_LATEST_METRIC;
    }
  }
};

export default function GPUUtilTable({
  snapshot,
  timeConfig,
  metric,
  keyName
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
  metric: [];
  keyName: string;
}) {
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

  if (rows.length === 0) {
    return null;
  }
  const cols = [containerCol, podCol, namespaceCol, gpuNumberCol, gpuUtilCol];
  window.console.log(cols);
  return (
    <Table
      withoutPadding
      cardTitle={t(
        keyName === 'DCGM_FI_DEV_GPU_UTIL'
          ? 'in-forge:plugins.oTelDcgm.container.gpuUtil'
          : 'in-forge:plugins.oTelDcgm.container.memoryCpyUtil',
        { count: rows.length }
      )}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row: Row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: percentage.detailed,
        metrics: [`${row.keyName}.${row.key}`],
        labels: [
          row.keyName === 'DCGM_FI_DEV_GPU_UTIL'
            ? t('in-forge:plugins.oTelDcgm.container.gpuUtil')
            : t('in-forge:plugins.oTelDcgm.container.memoryCpyUtil')
        ],
        type: 'line'
      }}
    />
  );
}

function parseMetricIdentifier(metric: string, key: string) {
  const trimmedMetric = metric.replace(key + '.', '');

  const regex = /^([^_]+)_([^_]+)_(.+)_([^_]+)$/;
  const match = trimmedMetric.match(regex);

  if (match) {
    const [, gpu, namespace, pod, container] = match;
    return { containerKey: trimmedMetric, gpu, namespace, pod, container };
  } else {
    return { containerKey: '', gpu: '', namespace: '', pod: '', container: '' };
  }
}
