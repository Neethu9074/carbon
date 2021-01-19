/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getHostsInAvailabilityZone from 'in-stores/graph/getHostsInAvailabilityZone';
import { percentage } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: 'CPU Usage',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return `cpu.used`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Memory Usage',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return `memory.used`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Health',
    type: 'health',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      hosts: getHostsInAvailabilityZone(props.snapshotId).flatMap(snapshotIds => getSnapshots(snapshotIds))
    };
  },
  function HostsTable({ hosts }) {
    if (hosts == null || hosts.length === 0) {
      return null;
    }

    const rows = hosts.map(host => {
      const id = host.get('id');
      return {
        key: id
      };
    });

    return <Table withoutPadding cardTitle="Hosts" cols={cols} rows={rows} maxItemsPerPage={40} />;
  }
);
