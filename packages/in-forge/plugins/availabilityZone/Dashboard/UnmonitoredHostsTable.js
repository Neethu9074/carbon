/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import getHostsInAvailabilityZone from 'in-stores/graph/getHostsInAvailabilityZone';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: t('in-forge:plugins.availabilityZone.titleIPAddress'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.host.getIn(['data', 'ipv4']);
      }
    }
  },
  {
    title: t('in-forge:plugins.availabilityZone.titleDNSName'),
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
      <Table withoutPadding cardTitle={t('in-forge:plugins.titleHost')} cols={cols} rows={rows} maxItemsPerPage={40} />
    );
  }
);
