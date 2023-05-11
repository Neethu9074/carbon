/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { List } from 'immutable';
import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { number, percentage } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const typeCol = {
  title: t('in-forge:plugins.ibmDataPowerDomain.xmlNameType'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.key.split('.')[1];
    }
  }
};

const uesdCol = {
  title: t('in-forge:plugins.ibmDataPowerDomain.xmlNameUsed'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'xmlNames.' + row.key.split('.')[1] + '.used';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const percentFreeCol = {
  title: t('in-forge:plugins.ibmDataPowerDomain.xmlNamePercentFree'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.snapshotId;
    },
    getMetricName(row: any) {
      return 'xmlNames.' + row.key.split('.')[1] + '.percentFree';
    },
    getContent: percentage.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const maximumCol = {
  title: t('in-forge:plugins.ibmDataPowerDomain.xmlNameMaximum'),
  type: 'number',
  typeArgs: {
    getValue(row: any) {
      return row.maximum;
    },
    getContent: number.compact
  }
};

export default function XmlNamesTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;
  const rows = snapshot
    .getIn(['data'], List())
    .map((maximum: Map<string, any>, name: string) => {
      if (name.startsWith('xmlNames') && name.endsWith('maximum')) {
        return {
          key: name,
          maximum,
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
  const cols = [typeCol, uesdCol, percentFreeCol, maximumCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmDataPowerDomain.xmlNamesCount', {
        len: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      initialSortColumn={cols.indexOf(typeCol)}
    />
  );
}

function getRowDetails(row: any) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <Chart
        margins={{
          left: 90,
          right: 90
        }}
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: ['xmlNames.' + row.key.split('.')[1] + '.used'],
          labels: [t('in-forge:plugins.ibmDataPowerDomain.xmlNameUsed')],
          type: 'line',
          formatter: number.compact
        }}
      />
      <Chart
        margins={{
          left: 90,
          right: 90
        }}
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: ['xmlNames.' + row.key.split('.')[1] + '.percentFree'],
          labels: [t('in-forge:plugins.ibmDataPowerDomain.xmlNamePercentFree')],
          type: 'line',
          formatter: percentage.compact
        }}
      />
    </div>
  );
}
