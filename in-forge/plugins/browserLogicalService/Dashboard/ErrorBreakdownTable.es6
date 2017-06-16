import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import { getErrorBreakdownForWebsite } from 'in-services/api/eumErrors';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import { combineDataAndError } from 'in-services/util/ro';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { createLogger } from 'instalog';

const logger = createLogger('browserLogicalService/ErrorBreakdownTable');

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
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
        return getTraceViewLinkWithQuery(row.query).map(href => {
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
        getErrorBreakdownForWebsite({
          websiteSnapshotId: props.websiteSnapshotId,
          timeframe: props.timeframe,
          errorHash: props.errorHash,
          pageHash: props.pageHash
        })
      )
    };
  },
  function ErrorBreakdownTable({ result, errorMessage, websiteLabel }) {
    if (!result) {
      return null;
    }

    if (result.error) {
      logger.warn('Failed to retrieve EUM error breakdown', result.error);
      return (
        <DashboardNotification type="danger">
          <strong>Failed to retrieve EUM error breakdown.</strong> Please refresh the page or contact customer{' '}
          support should this issue persist.
        </DashboardNotification>
      );
    }

    const browserRows = result.data.get('browsers').toArray().map(browser => {
      return {
        key: browser.get('hash'),
        name: browser.get('name'),
        count: browser.get('count'),
        query: `entity.website.label:"${luceneEscapeString(
          websiteLabel
        )}" AND span.webEum.error.message:"${luceneEscapeString(
          errorMessage
        )}" AND span.webEum.userAgent.browser.name:"${browser.get('name')}"`
      };
    });

    const pageRows = result.data.get('pages').toArray().map(page => {
      return {
        key: page.get('hash'),
        name: page.get('name'),
        count: page.get('count'),
        query: `entity.website.label:"${luceneEscapeString(
          websiteLabel
        )}" AND span.webEum.error.message:"${luceneEscapeString(
          errorMessage
        )}" AND span.webEum.page:"${luceneEscapeString(page.get('name'))}"`
      };
    });

    return (
      <div>
        <TwoColumnRow>
          {browserRows.length > 0
            ? <DashboardSection title={`Browsers (${browserRows.length})`}>
                <Table cols={cols} rows={browserRows} initialSortColumn={1} initialSortDirection="desc" />
              </DashboardSection>
            : null}

          {pageRows.length > 0
            ? <DashboardSection title={`Pages (${pageRows.length})`}>
                <Table cols={cols} rows={pageRows} initialSortColumn={1} initialSortDirection="desc" />
              </DashboardSection>
            : null}
        </TwoColumnRow>
      </div>
    );
  }
);
