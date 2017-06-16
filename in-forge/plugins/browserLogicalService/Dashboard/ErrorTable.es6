import React from 'react';

import ErrorBreakdownTable from 'in-forge/plugins/browserLogicalService/Dashboard/ErrorBreakdownTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import { luceneEscapeString } from 'in-stores/search/manipulation';
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
  },
  {
    title: '',
    type: 'linkButton',
    disableSorting: true,
    typeArgs: {
      get$(row) {
        return getTraceViewLinkWithQuery(
          `entity.website.label:"${luceneEscapeString(
            row.websiteLabel
          )}" AND span.webEum.error.message:"${luceneEscapeString(row.message)}" `
        ).map(href => {
          return {
            href,
            label: 'Traces'
          };
        });
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      result: combineDataAndError(
        getErrorsForWebsite({
          websiteSnapshotId: props.snapshotId,
          timeframe: props.timeframe,
          pageHash: props.pageHash
        })
      )
    };
  },
  function ErrorTable({ result, snapshotId, timeframe, websiteLabel, pageHash }) {
    // TODO show message when timeframe extends beyond our trace storage time

    if (!result) {
      return null;
    }

    if (result.error) {
      logger.warn('Failed to retrieve EUM error overview', result.error);
      return (
        <DashboardNotification type="danger">
          <strong>Failed to retrieve EUM error overview.</strong> Please refresh the page or contact customer{' '}
          support should this issue persist.
        </DashboardNotification>
      );
    }

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
        pageHash
      };
    });

    if (rows.length === 0) {
      return null;
    }

    return (
      <DashboardSection title={`Uncaught Error Breakdown (${rows.length})`}>
        <Table
          cols={cols}
          rows={rows}
          initialSortColumn={1}
          initialSortDirection="desc"
          getRowDetails={getRowDetails}
        />
      </DashboardSection>
    );
  }
);

function getRowDetails(row) {
  return (
    <ErrorBreakdownTable
      errorHash={row.hash}
      websiteSnapshotId={row.snapshotId}
      timeframe={row.timeframe}
      errorMessage={row.message}
      websiteLabel={row.websiteLabel}
      pageHash={row.pageHash}
    />
  );
}
