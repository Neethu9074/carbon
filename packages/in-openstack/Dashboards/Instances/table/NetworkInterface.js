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
    title: t('in-openstack:mac'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-openstack:recievedErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `nicdetails.${row.key}.rxErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-openstack:recievedPackets'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `nicdetails.${row.key}.rxPackets`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-openstack:recievedPacketsDrop'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `nicdetails.${row.key}.rxDrop`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-openstack:recievedRate'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `nicdetails.${row.key}.rxRate`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-openstack:transmittedErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `nicdetails.${row.key}.txErrors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-openstack:transmittedPackets'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `nicdetails.${row.key}.txPackets`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-openstack:transmittedPacketsDrop'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `nicdetails.${row.key}.txDrop`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-openstack:transmittedRate'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.data.id;
      },
      getMetricName(row) {
        return `nicdetails.${row.key}.txRate`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function NetworkInterface({ data, timeConfig }) {
  const rows = [
    ...data.nicdetails.map(nic => {
      return {
        key: nic,
        nic,
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
      cardTitle={t('in-openstack:dashboards.networkInterfaceControllers')}
      withoutPadding
      cols={cols}
      rows={rows}
      initialSortDirection="desc"
    />
  );
}
