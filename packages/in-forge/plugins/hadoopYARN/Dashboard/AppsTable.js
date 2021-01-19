/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { formatDateTime } from 'in-services/formatters/date';
import Table from 'in-sdk/components/dashboard/Table';
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

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'apps')
    };
  },
  function AppsTable({ snapshot, data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const apps = data.get('raw_payload');
    if (apps.size === 0) {
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
      <Table
        withoutPadding
        cardTitle={<TimeOfLastUpdateCardTitle title="Most Recent Apps" timestamp={data.get('timestamp')} />}
        cols={cols}
        rows={rows}
        initialSortColumn={7}
        initialSortDirection={'asc'}
        getRowDetails={getDetails}
      />
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
