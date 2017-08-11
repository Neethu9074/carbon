import React from 'react';

import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import DashboardTile from 'in-components/Dashboard/components/DashboardTile';
import DashboardNotification from 'in-components/DashboardNotification';
import { getErrorsForWebsite } from 'in-services/api/eumErrors';
import { compareIgnoreCase } from 'in-services/util/string';
import { combineDataAndError } from 'in-services/util/ro';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { createLogger } from 'instalog';

const logger = createLogger('browserLogicalService/ErrorTable');

const cols = [
  {
    title: 'Message',
    type: 'link',
    typeArgs: {
      comparator: compareIgnoreCase,
      get$(row) {
        return getSubDashboardLink(`/errors/${encodeURIComponent(row.hash)}`).map(href => {
          return {
            label: row.message,
            value: row.message,
            href
          };
        });
      }
    }
  },
  {
    title: 'Occurences',
    type: 'number',
    cellStyle: {
      width: '120px'
    },
    typeArgs: {
      getValue(row) {
        return row.count;
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    return {
      // TODO this request is executed waaaaayyyy too often. This likely to result in problems on the backend side.
      // We probably need to memoize this call for some to avoid issues
      result: combineDataAndError(
        getErrorsForWebsite({
          websiteSnapshotId: props.snapshot.get('id'),
          timeframe: props.timeframe,
          pageHash: props.pageHash
        })
      )
    };
  },
  function Errors({ result, snapshot, timeframe, pageHash, pageLabel }) {
    if (!result) {
      return null;
    }
    const websiteLabel = getLabel(snapshot);

    // TODO show message when timeframe extends beyond our trace storage time

    if (result.error) {
      logger.warn('Failed to retrieve EUM error overview', result.error);
      return (
        <DashboardNotification type="danger">
          <strong>Failed to retrieve EUM error overview.</strong> Please refresh the page or contact customer{' '}
          support should this issue persist.
        </DashboardNotification>
      );
    }

    const snapshotId = snapshot.get('id');
    const rows = result.data.toArray().map(error => {
      const hash = error.get('hash');
      return {
        key: hash,
        hash,
        message: error.get('name'),
        count: error.get('count'),
        snapshotId,
        websiteLabel,
        timeframe,
        pageHash,
        pageLabel: pageLabel
      };
    });

    if (rows.length === 0) {
      return (
        <DashboardTile title={`Uncaught Errors`}>
          No errors in the given time window
        </DashboardTile>
      );
    }

    return (
      <DashboardTile title={`Uncaught Error Breakdown (${rows.length})`}>
        <Table cols={cols} rows={rows} initialSortColumn={1} initialSortDirection="desc" />
      </DashboardTile>
    );
  }
);
