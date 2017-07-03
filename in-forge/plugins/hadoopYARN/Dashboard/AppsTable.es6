import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import DashboardNotification from 'in-components/DashboardNotification';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';

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
    title: 'Final Status',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.app.get('finalStatus');
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
    title: 'Type',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.app.get('type');
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
      getContent: formatDateTime
    }
  },
  {
    title: 'Tracking URL',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.app.get('trackingUrl');
      },
      getContent: function(value) {
        return (
          <a target="_blank" rel="noopener noreferrer" href={value}>
            Tracking URL
          </a>
        );
      }
    }
  }
];

export default function AppsTable({ snapshot, timeframe }) {
  const apps = snapshot.getIn(['data', 'apps'], emptyList);

  if (apps.size === 0) {
    return null;
  }

  const rows = apps
    .map(app => {
      return {
        key: app.get('id'),
        app,
        timeframe,
        snapshotId: snapshot.get('id')
      };
    })
    .toArray();

  return (
    <DashboardSection title="Most Recent Apps">
      <Table cols={cols} rows={rows} initialSortColumn={7} initialSortDirection={'asc'} getRowDetails={getDetails} />
    </DashboardSection>
  );
}

function getDetails(row) {
  const diagnostics = row.app.get('diagnostics');
  if (diagnostics) {
    return (
      <DashboardNotification type="danger">
        <b>Diagnostics:</b> {diagnostics}
      </DashboardNotification>
    );
  } else {
    return null;
  }
}
