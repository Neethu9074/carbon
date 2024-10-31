/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { number, bytes } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const deviceColumn = {
  title: t('in-nutanix:dashboards.device'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.key;
    }
  }
};
const urlColumn = {
  title: t('in-nutanix:dashboards.url'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.filesystem.url;
    }
  }
};
const typeColumn = {
  title: t('in-nutanix:dashboards.type'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.filesystem.type;
    }
  }
};
const maxFileSizeColumn = {
  title: t('in-nutanix:dashboards.maxFileSize'),
  type: 'number',
  typeArgs: {
    getValue(row) {
      return row.filesystem.maxFileSize;
    },
    getContent: bytes.detailed
  }
};
const capacityColumn = {
  title: t('in-nutanix:dashboards.capacity'),
  type: 'number',
  typeArgs: {
    getValue(row) {
      return row.filesystem.capacity;
    },
    getContent: bytes.detailed
  }
};
const freeSpaceColumn = {
  title: t('in-nutanix:dashboards.freeSpace'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.data.id;
    },
    getMetricName(row) {
      return 'datastore.freeSpace.' + row.key;
    },
    getContent: bytes.detailed,
    getTimeWindowAggregation() {
      return 'mean';
    }
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
      cardTitle={t('in-nutanix:dashboards.filesystems')}
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
  const fsId = row.filesystem.id;

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
              'datastore.datastoreReadIops.number.latest.' + fsId,
              'datastore.datastoreWriteIops.number.latest.' + fsId,
              'datastore.datastoreTotalIops.number.latest.' + fsId
            ],
            labels: [
              t('in-nutanix:dashboards.iopsRead'),
              t('in-nutanix:dashboards.iopsWrite'),
              t('in-nutanix:dashboards.iopsTotal')
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
              'datastore.numberReadAveraged.number.average.' + fsId,
              'datastore.numberWriteAveraged.number.average.' + fsId
            ],
            labels: [t('in-nutanix:dashboards.readPerSec'), t('in-nutanix:dashboards.writePerSec')],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: bytes.compact,
            tooltipFormatter: bytes.detailed,
            metrics: [
              'datastore.datastoreReadBytes.number.latest.' + fsId,
              'datastore.datastoreWriteBytes.number.latest.' + fsId
            ],
            labels: [t('in-nutanix:dashboards.byteReadPerSec'), t('in-nutanix:dashboards.byteWritePerSec')],
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
              'datastore.datastoreNormalReadLatency.number.latest.' + fsId,
              'datastore.datastoreNormalWriteLatency.number.latest.' + fsId,
              'datastore.datastoreNormalTotalLatency.number.latest.' + fsId
            ],
            labels: [
              t('in-nutanix:dashboards.latencyRead'),
              t('in-nutanix:dashboards.latencyWrite'),
              t('in-nutanix:dashboards.latencyTotal')
            ],
            type: 'line'
          }}
        />
        <Chart
          snapshotId={row.data.id}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailed,
            metrics: ['datastore.freeSpace.' + row.key],
            labels: [t('in-nutanix:dashboards.freeSpace')],
            type: 'line'
          }}
        />
      </Columize>
    </Fragment>
  );
}
