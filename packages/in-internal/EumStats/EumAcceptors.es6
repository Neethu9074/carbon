import React from 'react';

import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { compareIgnoreCase } from 'in-services/util/string';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'link',
    typeArgs: {
      comparator: compareIgnoreCase,
      get$(row) {
        return getDashboardLink(row.dropwizardSnapshotId, {
          pathname: '/physical/dashboard'
        }).map(href => ({
          value: row.hostLabel,
          label: row.hostLabel,
          href
        }));
      }
    }
  },
  {
    title: 'Processed',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizardSnapshotId;
      },
      getMetricName() {
        return `metrics.meters.instana.beaconProcessing.processed`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      },
      forceTimeWindowAggregation: true
    }
  },
  {
    title: 'Dropped',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizardSnapshotId;
      },
      getMetricName() {
        return `metrics.meters.instana.beaconProcessing.dropped`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      },
      forceTimeWindowAggregation: true
    }
  },
  {
    title: 'Ignored',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizardSnapshotId;
      },
      getMetricName() {
        return `metrics.meters.instana.beaconProcessing.ignored`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      },
      forceTimeWindowAggregation: true
    }
  },
  {
    title: 'Translation Errors',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizardSnapshotId;
      },
      getMetricName() {
        return `metrics.meters.instana.beaconProcessing.translationErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      },
      forceTimeWindowAggregation: true
    }
  }
];

export default function CpuTable({ region, nodes }) {
  const rows = nodes.map(n => ({
    key: n.dropwizardSnapshotId,
    ...n
  }));

  return (
    <div>
      <h1>eum-acceptors within {region}</h1>
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </div>
  );
}

function getRowDetails() {
  return <div>Details coming soon…</div>;
}
