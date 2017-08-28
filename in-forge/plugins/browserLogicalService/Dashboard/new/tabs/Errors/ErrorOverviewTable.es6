import React from 'react';

import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import DashboardNotification from 'in-components/DashboardNotification';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { getErrorsForWebsite } from 'in-services/api/eumErrors';
import LoadingIndicator from 'in-components/LoadingIndicator';
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
        let path = `/errors/${encodeURIComponent(row.hash)}`;
        if (row.pageHash) {
          path = `/pages/${encodeURIComponent(row.pageHash)}${path}`;
        }
        return getSubDashboardLink(path).map(href => {
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

// ensure that react repaints do not result in frequent backend calls
const getBreakdown = memoize(
  ({ snapshot, timeframe, pageHash }) =>
    combineDataAndError(
      getErrorsForWebsite({
        websiteSnapshotId: snapshot.get('id'),
        timeframe: timeframe,
        pageHash: pageHash
      })
    ).delayedStop(35000),
  ({ snapshot, timeframe, pageHash }) => snapshot.get('id') + timeframe.to + timeframe.windowSize + pageHash,
  30000
);

export default connectTo(
  props => {
    return {
      result: getBreakdown(props)
    };
  },
  function Errors({ result, snapshot, timeframe, pageHash, pageName }) {
    if (!result) {
      return <LoadingIndicator type="dark" />;
    }
    const websiteLabel = getLabel(snapshot);

    if (result.error) {
      logger.warn('Failed to retrieve EUM error overview', result.error);
      return (
        <DashboardNotification type="danger">
          <strong>Failed to retrieve error list.</strong> Please refresh the page or contact customer{' '}
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
        pageName: pageName
      };
    });

    if (rows.length === 0) {
      return null;
    }

    return (
      <DashboardTile title="Uncaught Errors">
        <Table cols={cols} rows={rows} initialSortColumn={1} initialSortDirection="desc" />
      </DashboardTile>
    );
  }
);
