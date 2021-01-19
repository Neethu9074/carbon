/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { zeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Link from 'in-components/Link';

const cols = [
  {
    title: 'Application Id',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.app.get('id');
      }
    }
  },
  {
    title: 'State',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.app.get('state');
      }
    }
  },
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.app.get('name');
      }
    }
  },
  {
    title: 'User',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.app.get('user');
      }
    }
  },
  {
    title: 'Start Time',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.app.get('startTime');
      },
      getContent: formatDateTime
    }
  },
  {
    title: 'Finish Time',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.app.get('finishTime');
      },
      getContent: function(finishTime) {
        if (finishTime > 0) {
          return formatDateTime(finishTime);
        } else {
          return 'Not finished';
        }
      }
    }
  },
  {
    title: 'Cores',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.app.get('cores');
      },
      getContent: zeroDecimalPlaces
    }
  },
  {
    title: 'Memory Per Node',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.app.get('memoryPerNode');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: 'Tracking URL',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.app.get('trackingUrl');
      },
      getContent(value) {
        return (
          <Link href={value} external>
            Tracking URL
          </Link>
        );
      }
    }
  }
];

export default function AppsTable({ snapshot, timeConfig }) {
  const apps = snapshot.getIn(['data', 'apps.mostRecent'], emptyList);
  if (apps.size === 0) {
    return null;
  }

  const rows = apps
    .map(app => {
      return {
        key: app.get('id'),
        app,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    })
    .toArray();

  return (
    <Table
      withoutPadding
      cardTitle="Most Recent Apps"
      cols={cols}
      rows={rows}
      initialSortColumn={5}
      initialSortDirection={'asc'}
    />
  );
}
