import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import { getErrorsForWebsite } from 'in-services/api/eumErrors';
import { combineDataAndError } from 'in-services/util/ro';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { createLogger } from 'instalog';

const logger = createLogger('browserLogicalService/ErrorTable');

const cols = [
  {
    title: 'Message',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.message;
      }
    }
  },
  {
    title: 'Occurences in selected time window',
    type: 'number',
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
      result: combineDataAndError(
        getErrorsForWebsite({
          websiteSnapshotId: props.snapshotId,
          timeframe: props.timeframe
        })
      )
    };
  },
  function ErrorTable({ result }) {
    // TODO show message when timeframe extends beyond our trace storage time

    if (!result) {
      return null;
    }

    if (result.error) {
      logger.warn('Failed to retrieve EUM error overview', result.error);
      return (
        <DashboardNotification type="danger">
          Please refresh the table or contact customer support should this issue persist.
        </DashboardNotification>
      );
    }

    const rows = result.data.toArray().map(error => {
      const hash = error.get('hash');
      return {
        key: hash,
        hash,
        message: error.get('message'),
        count: error.get('count')
      };
    });

    if (rows.length === 0) {
      return null;
    }

    return (
      <DashboardSection title={`Uncaught Error Breakdown (${rows.length})`}>
        <Table cols={cols} rows={rows} initialSortColumn={1} initialSortDirection="desc" />
      </DashboardSection>
    );
  }
);
