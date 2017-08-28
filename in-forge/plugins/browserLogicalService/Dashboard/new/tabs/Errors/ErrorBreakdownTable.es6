import React from 'react';

import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import { compareIgnoreCase } from 'in-services/util/string';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { always } from 'in-services/fixedStreams';

const cols = [
  {
    title: 'Name',
    type: 'link',
    typeArgs: {
      comparator: compareIgnoreCase,
      get$(row) {
        if (row.href$) {
          return row.href$.map(href => {
            return { value: row.name, label: row.name, href };
          });
        }
        return always({ value: row.name, label: row.name });
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
  },
  {
    title: '',
    type: 'linkButton',
    disableSorting: true,
    cellStyle: {
      width: '120px'
    },
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

export default function ErrorBreakdownTable({ result, errorMessage, websiteLabel, pageName, snapshot }) {
  const browserRows = result.data.get('browsers').toArray().map(browser => {
    let query = `entity.website.label:"${luceneEscapeString(websiteLabel)}"`;
    if (pageName) {
      query += ` span.webEum.page:"${luceneEscapeString(pageName)}"`;
    }
    query += ` span.webEum.error.message:"${luceneEscapeString(errorMessage)}"`;
    query += ` span.webEum.userAgent.browser.name:"${browser.get('name')}"`;
    return {
      key: browser.get('hash'),
      name: browser.get('name'),
      count: browser.get('count'),
      query
    };
  });

  const existingPages = snapshot.getIn(['data', 'service_endpoints']);
  const pageRows = result.data.get('pages').toArray().map(page => {
    const name = page.get('name');
    const isMonitoredRightNow = existingPages.contains(name);
    return {
      key: page.get('hash'),
      name,
      count: page.get('count'),
      isMonitoredRightNow: existingPages.contains(page.get('name')),
      query: `entity.website.label:"${luceneEscapeString(
        websiteLabel
      )}" span.webEum.error.message:"${luceneEscapeString(errorMessage)}" span.webEum.page:"${luceneEscapeString(
        page.get('name')
      )}"`,
      href$: isMonitoredRightNow ? getSubDashboardLink(`/pages/${encodeURIComponent(page.get('hash'))}`) : null
    };
  });

  return (
    <Columize>
      {browserRows.length > 0
        ? <DashboardTile title={`Browsers (${browserRows.length})`}>
            <Table cols={cols} rows={browserRows} initialSortColumn={1} initialSortDirection="desc" />
          </DashboardTile>
        : null}
      {pageRows.length > 0
        ? <DashboardTile title={`Pages (${pageRows.length})`}>
            <Table cols={cols} rows={pageRows} initialSortColumn={1} initialSortDirection="desc" />
          </DashboardTile>
        : null}
    </Columize>
  );
}
