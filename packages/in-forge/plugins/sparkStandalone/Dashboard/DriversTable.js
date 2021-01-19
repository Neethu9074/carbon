/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Table from 'in-sdk/components/dashboard/Table';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';
import { zeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';

const cols = [
  {
    title: 'Driver Id',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.driver.get('id');
      }
    }
  },
  {
    title: 'State',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.driver.get('state');
      }
    }
  },
  {
    title: 'Worker',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.driver.get('worker');
      }
    }
  },
  {
    title: 'Start Time',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.driver.get('startTime');
      },
      getContent: formatDateTime
    }
  },
  {
    title: 'Cores',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.driver.get('cores');
      },
      getContent: zeroDecimalPlaces
    }
  },
  {
    title: 'Memory',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.driver.get('memory');
      },
      getContent: bytesTwoDecimalPlaces
    }
  }
];

export default function DriversTable({ snapshot, timeConfig }) {
  const drivers = snapshot.getIn(['data', 'drivers.mostRecent'], emptyList);
  if (drivers.size === 0) {
    return null;
  }

  const rows = drivers
    .map(driver => {
      return {
        key: driver.get('id'),
        driver,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    })
    .toArray();

  return (
    <Table
      withoutPadding
      cardTitle="Most Recent Drivers"
      cols={cols}
      rows={rows}
      initialSortColumn={4}
      initialSortDirection={'asc'}
    />
  );
}
