/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

const workProcessObj = [
  {
    key: 'DIA',
    metrics: ['workloadcounts.dialogProcessWaiting', 'workloadcounts.numberOfDialogProcess']
  },
  {
    key: 'UPD',
    metrics: ['workloadcounts.updateProcessWaiting', 'workloadcounts.numberOfUpdateProcess']
  },
  {
    key: 'BTC',
    metrics: ['workloadcounts.batchProcessWaiting', 'workloadcounts.numberOfBatchProcess']
  },
  {
    key: 'SPO',
    metrics: ['workloadcounts.spoolProcessWaiting', 'workloadcounts.numberOfSpoolProcess']
  },
  {
    key: 'UPD2',
    metrics: ['workloadcounts.update2ProcessWaiting', 'workloadcounts.numberOfUpdate2Process']
  }
];

export default function getWorkProcessStatus(item: SnapshotData) {
  const snapshotId = item.id;
  return (
    <div>
      {workProcessObj.map((resource, index) => (
        <span key={resource.key}>
          {resource.key} <MetricValue snapshotId={snapshotId} metric={resource.metrics[1]} formatter={number.compact} />
          /<MetricValue snapshotId={item.id} metric={resource.metrics[0]} formatter={number.compact} />
          {index !== 4 && ' | '}
        </span>
      ))}
    </div>
  );
}
