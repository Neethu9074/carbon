/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-phmc:drc'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovLogicalPort.get('drcIndex');
      }
    }
  },
  {
    title: t('in-phmc:vnicDeviceMode'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovLogicalPort.get('vnicDeviceMode');
      }
    }
  },
  {
    title: t('in-phmc:configurationType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovLogicalPort.get('configurationType');
      }
    }
  },
  {
    title: t('in-phmc:physicalPortId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovLogicalPort.get('physicalPortId');
      }
    }
  },
  {
    title: t('in-phmc:physicalLocation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovLogicalPort.get('physicalLocation');
      }
    }
  },
  {
    title: t('in-phmc:sentPackets'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovLogicalPort.get('sentPackets');
      }
    }
  },
  {
    title: t('in-phmc:recievedPackets'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovLogicalPort.get('receivedPackets');
      }
    }
  },
  {
    title: t('in-phmc:sentBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovLogicalPort.get('sentBytes');
      }
    }
  },
  {
    title: t('in-phmc:recievedBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovLogicalPort.get('receivedBytes');
      }
    }
  },
  {
    title: t('in-phmc:transferredBytes'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovLogicalPort.get('transferredBytes');
      }
    }
  },
  {
    title: t('in-phmc:errorIn'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovLogicalPort.get('errorIn');
      }
    }
  },
  {
    title: t('in-phmc:errorOut'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.sriovLogicalPort.get('errorOut');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'sriovLogicalPorts')
    };
  },
  function SriovLogicalPort({ data }) {
    if (!data) {
      return null;
    }
    const sriovLogicalPorts = data.toArray();

    if (sriovLogicalPorts.size === 0) {
      return null;
    }
    const rows = sriovLogicalPorts.map((sriovLogicalPort, idx) => {
      return {
        key: String(idx),
        sriovLogicalPort
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-phmc:dashboards.sriovLogicalPort')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
