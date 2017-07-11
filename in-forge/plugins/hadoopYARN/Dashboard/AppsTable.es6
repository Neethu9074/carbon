import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import { formatDateTime } from 'in-services/formatters/date';
import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
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
          <Link href={value} external>
            Tracking URL
          </Link>
        );
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      apps: getRawPayload(props.snapshot.get('id'), 'apps')
    };
  },
  function AppsTable({ snapshot, apps }) {
    if (!apps || apps.size === 0) {
      return null;
    }

    const rows = apps
      .map(app => {
        return {
          key: app.get('id'),
          app,
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
);

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
