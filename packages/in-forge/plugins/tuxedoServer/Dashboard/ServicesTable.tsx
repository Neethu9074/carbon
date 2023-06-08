/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { List, Map } from 'immutable';
import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const nameCol = {
  title: t('in-forge:plugins.tuxedoServer.name'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.key.split('.')[1];
    }
  }
};

const queuedCol = {
  title: t('in-forge:plugins.tuxedoServer.queued'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'services.' + row.key.split('.')[1] + `.numQueued`;
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const completedCol = {
  title: t('in-forge:plugins.tuxedoServer.completed'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'services.' + row.key.split('.')[1] + `.numCompleted`;
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const stateCol = {
  title: t('in-forge:plugins.tuxedoServer.state'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      if (row.key.startsWith('services')) {
        return row.service;
      }
    }
  }
};

export default function ServicesTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;
  const rows = snapshot
    .getIn(['data'], List())
    .map((service: Map<string, any>, name: string) => {
      if (name.startsWith('services')) {
        return {
          key: name,
          service,
          timeConfig,
          snapshotId
        };
      }
      return null;
    })
    .valueSeq()
    .toArray()
    .filter(Boolean);

  if (rows.length === 0) {
    return null;
  }
  const cols = [nameCol, queuedCol, completedCol, stateCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tuxedoServer.servicesWithCount', {
        len: rows.length
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
          metrics: [
            'services.' + row.key.split('.')[1] + '.numQueued',
            'services.' + row.key.split('.')[1] + `.numCompleted`
          ],
          labels: [t('in-forge:plugins.tuxedoServer.queued'), t('in-forge:plugins.tuxedoServer.completed')],
          type: 'line',
          formatter: number.compact
        }}
      />
    </div>
  );
}
