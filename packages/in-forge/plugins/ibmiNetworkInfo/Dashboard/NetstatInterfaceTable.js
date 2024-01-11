/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const StatusFormatter = status => {
  switch (status) {
    case 0:
      return 'ENDING';
    case 1:
      return 'ACTIVE';
    case 2:
      return 'FAILED';
    case 3:
      return 'FAILED_TCP';
    case 4:
      return 'INACTIVE';
    case 5:
      return 'RCYCNL';
    case 6:
      return 'RCYPND';
    case 7:
      return 'STARTING';
    case 8:
      return 'ACQUIRING';
    case 9:
      return 'DOD';
    default:
      return '-';
  }
};

const cols = [
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInterfaces.internetAddress'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.netstatInterfaceStringData.get('internetAddress');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInterfaces.subnetMask'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.netstatInterfaceStringData.get('subnetMask');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInterfaces.connectionType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.netstatInterfaceStringData.get('connectionType');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInterfaces.InterfaceLineType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.netstatInterfaceStringData.get('InterfaceLineType');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInterfaces.lineDescription'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.netstatInterfaceStringData.get('lineDescription');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInterfaces.virtualLanId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.netstatInterfaceStringData.get('virtualLanId');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInterfaces.status'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `netstatInterfaceMetrics.${row.key}.status`;
      },
      getContent: StatusFormatter,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    const { snapshotId } = props;
    return {
      data: getRawPayloadWithTimestamp(snapshotId, 'netstatInterfacesRawPayload')
    };
  },
  function netstatInfoTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const netstatInterfacesRawPayload = data.get('raw_payload');
    if (netstatInterfacesRawPayload.size === 0) {
      return null;
    }

    const rows = netstatInterfacesRawPayload
      .map((netstatInterfaceStringData, key) => {
        return {
          key,
          netstatInterfaceStringData,
          timeConfig,
          snapshotId
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInterfaces.name')}
        cols={cols}
        rows={rows}
        initialSortColumn={6}
        initialSortDirection="desc"
      />
    );
  }
);
