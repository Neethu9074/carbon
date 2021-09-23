/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-zhmc:dashboards.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.packetsSent'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `networkPorts.${row.key}.packetsSent`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.packetsReceived'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `networkPorts.${row.key}.packetsReceived`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.packetsSentDiscarded'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `networkPorts.${row.key}.packetsSentDiscarded`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.packetsReceivedDiscarded'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `networkPorts.${row.key}.packetsReceivedDiscarded`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.packetsReceivedDropped'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `networkPorts.${row.key}.packetsReceivedDropped`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.multicastPacketsSent'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `networkPorts.${row.key}.multicastPacketsSent`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.multicastPacketsReceived'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `networkPorts.${row.key}.multicastPacketsReceived`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.broadcastPacketsSent'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `networkPorts.${row.key}.broadcastPacketsSent`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.broadcastPacketsReceived'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `networkPorts.${row.key}.broadcastPacketsReceived`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function PacketsTable({ data, timeConfig }) {
  const rows = [
    ...data.networkPorts.map(networkPort => {
      return {
        key: networkPort,
        networkPort,
        timeConfig,
        data
      };
    })
  ];

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      cardTitle={t('in-zhmc:dashboards.packet')}
      withoutPadding
      cols={cols}
      rows={rows}
      initialSortDirection="desc"
    />
  );
}
