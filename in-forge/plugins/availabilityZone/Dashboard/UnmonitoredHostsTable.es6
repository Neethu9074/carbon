import React from 'react';

import getHostsInAvailabilityZone from 'in-stores/graph/getHostsInAvailabilityZone';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'IP Address',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.host.getIn(['data', 'ipv4']);
      }
    }
  },
  {
    title: 'DNS Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.host.getIn(['data', 'dnsName']);
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
  function UnmonitoredHostsTable({ hosts }) {
    if (hosts == null || hosts.length === 0) {
      return null;
    }
    const rows = hosts.map(host => {
      return {
        key: host.getIn(['data', 'ipv4']),
        host
      };
    });

    return (
      <DashboardSection title="Hosts">
        <Table cols={cols} rows={rows} maxItemsPerPage={40} />
      </DashboardSection>
    );
  }
);
