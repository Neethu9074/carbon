/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { t } from 'in-i18n';

import { number, bytesTwoDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';

const deviceColumn = {
  title: t('in-vsphere:dashboards.device'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.key;
    }
  }
};
const urlColumn = {
  title: t('in-vsphere:dashboards.url'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.filesystem.url;
    }
  }
};
const typeColumn = {
  title: t('in-vsphere:dashboards.type'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.filesystem.type;
    }
  }
};
const maxFileSizeColumn = {
  title: t('in-vsphere:dashboards.maxFileSize'),
  type: 'number',
  typeArgs: {
    getValue(row) {
      return row.filesystem.maxFileSize;
    },
    getContent: bytesTwoDecimalPlaces
  }
};
const capacityColumn = {
  title: t('in-vsphere:dashboards.capacity'),
  type: 'number',
  typeArgs: {
    getValue(row) {
      return row.filesystem.capacity;
    },
    getContent: bytesTwoDecimalPlaces
  }
};
const freeSpaceColumn = {
  title: t('in-vsphere:dashboards.freeSpace'),
  type: 'number',
  typeArgs: {
    getValue(row) {
      return row.filesystem.freeSpace;
    },
    getContent: bytesTwoDecimalPlaces
  }
};

export default function FilesystemsTable({ data, timeConfig }) {
  const rows = [
    ...data.datastores.map(filesystem => {
      return {
        key: filesystem.label,
        filesystem,
        timeConfig,
        data
      };
    })
  ];

  if (rows.length === 0) {
    return null;
  }

  const cols = [deviceColumn, urlColumn, typeColumn, maxFileSizeColumn, capacityColumn, freeSpaceColumn];

  return (
    <Table
      cardTitle={t('in-vsphere:dashboards.filesystems')}
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      initialSortDirection="desc"
      initialSortColumn={cols.indexOf(capacityColumn)}
    />
  );
}

function getDetails(row) {
  return (
    <Fragment>
      <Columize>
        <Chart
          snapshotId={row.data.id}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [
              'datastore.datastoreReadIops.number.latest.' + row.filesystem.id,
              'datastore.datastoreWriteIops.number.latest.' + row.filesystem.id,
              'datastore.datastoreTotalIops.number.latest.' + row.filesystem.id
            ],
            labels: [
              t('in-vsphere:dashboards.iopsRead'),
              t('in-vsphere:dashboards.iopsWrite'),
              t('in-vsphere:dashboards.iopsTotal')
            ],
            type: 'line'
          }}
        />
        <Chart
          snapshotId={row.data.id}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [
              'datastore.numberReadAveraged.number.average.' + row.filesystem.id,
              'datastore.numberWriteAveraged.number.average.' + row.filesystem.id
            ],
            labels: [t('in-vsphere:dashboards.readPerSec'), t('in-vsphere:dashboards.writePerSec')],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            tooltipFormatter: bytesZeroDecimalPlaces,
            metrics: [
              'datastore.datastoreReadBytes.number.latest.' + row.filesystem.id,
              'datastore.datastoreWriteBytes.number.latest.' + row.filesystem.id
            ],
            labels: [t('in-vsphere:dashboards.byteReadPerSec'), t('in-vsphere:dashboards.byteWritePerSec')],
            type: 'line'
          }}
        />
      </Columize>
      <Columize>
        <Chart
          snapshotId={row.data.id}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: [
              'datastore.datastoreNormalReadLatency.number.latest.' + row.filesystem.id,
              'datastore.datastoreNormalWriteLatency.number.latest.' + row.filesystem.id,
              'datastore.datastoreNormalTotalLatency.number.latest.' + row.filesystem.id
            ],
            labels: [
              t('in-vsphere:dashboards.latencyRead'),
              t('in-vsphere:dashboards.latencyWrite'),
              t('in-vsphere:dashboards.latencyTotal')
            ],
            type: 'line'
          }}
        />
      </Columize>
    </Fragment>
  );
}
