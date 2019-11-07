import React, { Fragment } from 'react';

import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import { number, bytesTwoDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';

const deviceColumn = {
  title: 'Device',
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.key;
    }
  }
};
const urlColumn = {
  title: 'Url',
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.filesystem.url;
    }
  }
};
const typeColumn = {
  title: 'Type',
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.filesystem.type;
    }
  }
};
const maxFileSizeColumn = {
  title: 'Max file size',
  type: 'number',
  typeArgs: {
    getValue(row) {
      return row.filesystem.maxFileSize;
    },
    getContent: bytesTwoDecimalPlaces
  }
};
const capacityColumn = {
  title: 'Capacity',
  type: 'number',
  typeArgs: {
    getValue(row) {
      return row.filesystem.capacity;
    },
    getContent: bytesTwoDecimalPlaces
  }
};
const freeSpaceColumn = {
  title: 'Free space',
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
      cardTitle="Filesystems"
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
              'datastore.datastoreWriteIops.number.latest.' + row.filesystem.id
            ],
            labels: ['IOPS Read', 'IOPS Write'],
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
            labels: ['Read/s', 'Write/s'],
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
            labels: ['Byte Read/s', 'Byte Write/s'],
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
              'datastore.datastoreNormalWriteLatency.number.latest.' + row.filesystem.id
            ],
            labels: ['Latency Read', 'Latency Write'],
            type: 'line'
          }}
        />
      </Columize>
    </Fragment>
  );
}
