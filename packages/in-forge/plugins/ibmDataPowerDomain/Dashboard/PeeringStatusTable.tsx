/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { List } from 'immutable';
import React from 'react';

import { TimeConfig } from '@instana/types';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const addressCol = {
  title: t('in-forge:plugins.ibmDataPowerDomain.peeringStatusAddress'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.address;
    }
  }
};
const nameCol = {
  title: t('in-forge:plugins.ibmDataPowerDomain.peeringStatusName'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.name;
    }
  }
};
const primaryCol = {
  title: t('in-forge:plugins.ibmDataPowerDomain.peeringStatusPrimary'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.primary;
    }
  }
};
const linkCol = {
  title: t('in-forge:plugins.ibmDataPowerDomain.peeringStatusLink'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.link;
    }
  }
};

const pendingCol = {
  title: t('in-forge:plugins.ibmDataPowerDomain.peeringStatusPending'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return row.key + '.pending';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const offsetCol = {
  title: t('in-forge:plugins.ibmDataPowerDomain.peeringStatusOffset'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return row.key + '.offset';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

export default function peeringStatusTable({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id') as string;
  const uniqueKeys = new Set();

  const rows = snapshot
    .getIn(['data'], List())
    .map((_value: string, key: string) => {
      if (key.startsWith('peeringStatus.')) {
        const prefix = key.substring(0, key.lastIndexOf('.'));
        if (!uniqueKeys.has(prefix)) {
          uniqueKeys.add(prefix);

          return {
            key: prefix,
            name: prefix.substring(prefix.indexOf('.') + 1, prefix.indexOf(':')),
            address: prefix.split(':')[1],
            link: snapshot.getIn(['data', prefix + '.link']),
            primary: snapshot.getIn(['data', prefix + '.primary']),
            timeConfig,
            snapshotId
          };
        }
      }
      return null;
    })
    .filter(Boolean)
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }
  const cols = [addressCol, nameCol, pendingCol, offsetCol, linkCol, primaryCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmDataPowerDomain.peeringStatusCount', {
        len: uniqueKeys.size
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      initialSortColumn={cols.indexOf(nameCol)}
    />
  );
}

function getRowDetails(row: any) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: [row.key + '.pending'],
          labels: [t('in-forge:plugins.ibmDataPowerDomain.peeringStatusPending')],
          type: 'line',
          formatter: number.compact
        }}
      />
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: [row.key + '.offset'],
          labels: [t('in-forge:plugins.ibmDataPowerDomain.peeringStatusOffset')],
          type: 'line',
          formatter: number.compact
        }}
      />
    </div>
  );
}
