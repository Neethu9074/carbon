/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { percentage } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const containerCol = {
  title: t('in-forge:plugins.oTelDcgm.container.containerName'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.CONTAINER;
    }
  }
};

const podCol = {
  title: t('in-forge:plugins.oTelDcgm.container.podName'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.POD;
    }
  }
};

const namespaceCol = {
  title: t('in-forge:plugins.oTelDcgm.container.namespaceName'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.NAMESPACE;
    }
  }
};

const gpuNumberCol = {
  title: t('in-forge:plugins.oTelDcgm.container.gpuNumber'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.GPU;
    }
  }
};

const gpuUtilCol = {
  title: t('in-forge:plugins.oTelDcgm.container.util'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return row.KEYNAME + '.' + row.key;
    },
    getContent: percentage.detailed,
    getTimeWindowAggregation() {
      return 'mean';
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
    const { containerKey, GPU, NAMESPACE, POD, CONTAINER } = parseMetricIdentifier(metric, keyName);
    return {
      key: containerKey,
      name: containerKey,
      KEYNAME: keyName,
      GPU,
      NAMESPACE,
      POD,
      CONTAINER,
      timeConfig,
      snapshot,
      snapshotId
    };
  });

  if (rows.length === 0) {
    return null;
  }
  const cols = [containerCol, podCol, namespaceCol, gpuNumberCol, gpuUtilCol];
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

function getRowDetails(row: any) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: percentage.detailed,
        metrics: [row.KEYNAME + '.' + row.key],
        labels: [
          row.KEYNAME === 'DCGM_FI_DEV_GPU_UTIL'
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
  const parts = trimmedMetric.split('_');
  const containerKey = trimmedMetric;

  if (parts.length >= 3) {
    const GPU = parts[0];
    const NAMESPACE = parts[1];
    const POD = parts.slice(2, -1).join('_');
    const CONTAINER = parts[parts.length - 1];

    return { containerKey, GPU, NAMESPACE, POD, CONTAINER };
  } else {
    return { containerKey: '', GPU: '', NAMESPACE: '', POD: '', CONTAINER: '' };
  }
}
