import React from 'react';

import getHostsInAvailabilityZone from 'in-stores/graph/getHostsInAvailabilityZone';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { percentage } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshots } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Mtd from 'in-components/Mtd';

const cols = [
  {
    title: 'Health',
    type: 'health',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    },
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

    return (
      <DashboardSection title="Hosts">
        <Table cols={cols} rows={rows} maxItemsPerPage={40} />
      </DashboardSection>
    );
  }
);
