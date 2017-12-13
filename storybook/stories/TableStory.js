import { storiesOf } from '@storybook/react';
import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { always } from 'in-services/fixedStreams';
import Table from 'in-components/Table';

storiesOf('Table', module)
  .add('Simple', () => <Simple />)
  .add('Column Types', () => <Columns />)
  .add('With Details', () => <Details />)
  .add('Pages', () => <Pages />);

function SampleTable({ cols, getRowDetails, maxItemsPerPage }) {
  const rows = [1, 2, 3, 4, 5, 6].map(i => ({
    key: String(i),
    label: `item ${i}`,
    boolean: i % 2 === 0,
    date: 134562353,
    metric: 'metric',
    number: i,
    details: 'details…'
  }));

  return <Table cols={cols} rows={rows} maxItemsPerPage={maxItemsPerPage} getRowDetails={getRowDetails} />;
}

function Simple() {
  const cols = [
    {
      title: 'String',
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.label;
        }
      }
    }
  ];

  return <SampleTable cols={cols} />;
}

function Columns() {
  const cols = [
    {
      title: 'String',
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.label;
        }
      }
    },
    {
      title: 'Boolean',
      type: 'boolean',
      typeArgs: {
        getValue(row) {
          return row.boolean;
        },
        onChange() {},
        getStatus(row) {
          return row.boolean;
        }
      }
    },
    {
      title: 'Date Time',
      type: 'dateTime',
      typeArgs: {
        getValue(row) {
          return row.date;
        }
      }
    },
    {
      title: 'Health',
      type: 'health',
      typeArgs: {
        getSnapshotId(row) {
          return row.key;
        }
      }
    },
    {
      title: 'Link Button',
      type: 'linkButton',
      disableSorting: true,
      typeArgs: {
        get$(row) {
          return always({
            href: '',
            label: row.label
          });
        }
      }
    },
    {
      title: 'Metric',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.key;
        },
        getMetricName(row) {
          return row.metric;
        },
        getContent: zeroDecimalPlaces,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    },
    {
      title: 'Number',
      type: 'number',
      disableSorting: true,
      typeArgs: {
        getValue(row) {
          return row.number;
        },
        getContent: zeroDecimalPlaces
      }
    },
    {
      title: 'Snapshot Link',
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.key;
        }
      }
    }
  ];

  return <SampleTable cols={cols} />;
}

function Details() {
  const cols = [
    {
      title: 'String',
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.label;
        }
      }
    }
  ];

  return <SampleTable cols={cols} getRowDetails={getRowDetails} />;
}

function getRowDetails(row) {
  return <div>{row.details}</div>;
}

function Pages() {
  const cols = [
    {
      title: 'String',
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.label;
        }
      }
    }
  ];

  return <SampleTable cols={cols} maxItemsPerPage={3} />;
}
