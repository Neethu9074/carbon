/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { TcpStatusEnum, ProtocolEnum } from './NetstatConst';
import { bytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.remotePortAndAddress'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.netstatStringData.get('remotePortAndAddress');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bindUser'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.netstatStringData.get('bindUser');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.localPortAndAddress'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.netstatStringData.get('localPortAndAddress');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.remotePortName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.netstatStringData.get('remotePortName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.localPortName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.netstatStringData.get('localPortName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bytesSentRemotely'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `netstatMetricsBytesIn.${row.key}.bytesSentRemotely`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bytesReceivedLocally'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `netstatMetricsBytesIn.${row.key}.bytesReceivedLocally`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.protocol'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `netstatMetricsBytesIn.${row.key}.protocol`;
      },
      getContent: ProtocolEnum,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.tcpState'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `netstatMetricsBytesIn.${row.key}.tcpState`;
      },
      getContent: TcpStatusEnum,
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
      data: getRawPayloadWithTimestamp(snapshotId, 'netstatInfoRawPayloadBytesIn')
    };
  },
  function netstatInfoTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const netstatInfoRawPayloadBytesIn = data.get('raw_payload');
    if (netstatInfoRawPayloadBytesIn.size === 0) {
      return null;
    }

    const rows = netstatInfoRawPayloadBytesIn
      .map((netstatStringData, key) => {
        return {
          key,
          netstatStringData,
          timeConfig,
          snapshotId
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.ibmiNetworkInfo.dashboard.tables.netstatInfo.bytesInName')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={6}
        initialSortDirection="desc"
      />
    );
  }
);
