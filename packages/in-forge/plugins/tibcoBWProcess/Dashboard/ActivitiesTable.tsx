/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { millis, number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';
import { TimeConfig } from '@instana/types';

interface Row {
  key: string;
  timeConfig: TimeConfig;
  snapshotId: string;
}

const nameCol = {
  title: t('in-forge:plugins.tibcoBWProcess.name'),
  type: 'string',
  typeArgs: {
    getValue(row: Row) {
      return row.key.split('.')[1];
    }
  }
};

const createdCol = {
  title: t('in-forge:plugins.tibcoBWProcess.created'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: Row) {
      return row.snapshotId;
    },
    getMetricName(row: Row) {
      return 'activities.' + row.key.split('.')[1] + '.created';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const faultedCol = {
  title: t('in-forge:plugins.tibcoBWProcess.faulted'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: Row) {
      return row.snapshotId;
    },
    getMetricName(row: Row) {
      return 'activities.' + row.key.split('.')[1] + '.faulted';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

export default function ActivitiesTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .get('metricIds')
    .filter((id: string) => id.startsWith("activities.") && id.endsWith(".created"))
    .map((name: string) => {
      return {
        key: name,
        timeConfig,
        snapshotId
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }
  const cols = [nameCol, createdCol, faultedCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tibcoBWProcess.activitiesWithCount', {
        len: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      initialSortColumn={cols.indexOf(nameCol)}
    />
  );
}

function getRowDetails(row: Row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;
  const name = row.key.split('.')[1];

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: [
            'activities.' + name + '.totExec',
            'activities.' + name + '.minExec',
            'activities.' + name + '.maxExec'
          ],
          labels: [
            t('in-forge:plugins.tibcoBWProcess.totActExec'),
            t('in-forge:plugins.tibcoBWProcess.minActExec'),
            t('in-forge:plugins.tibcoBWProcess.maxActExec'),
          ],
          type: 'line',
          formatter: millis.fixedCompact
        }}
        y2={{
          metrics: [
            'activities.' + name + '.totElap',
            'activities.' + name + '.minElap',
            'activities.' + name + '.maxElap'
          ],
          labels: [
            t('in-forge:plugins.tibcoBWProcess.totActElap'),
            t('in-forge:plugins.tibcoBWProcess.minActElap'),
            t('in-forge:plugins.tibcoBWProcess.maxActElap'),
          ],
          type: 'line',
          formatter: millis.fixedCompact
        }}
      />
    </div>
  );
}
