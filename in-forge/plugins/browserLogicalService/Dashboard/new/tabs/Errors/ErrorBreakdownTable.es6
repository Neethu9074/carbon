import React from 'react';

import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { Row, Col } from 'in-components/Grid';

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
      kind: 'default',
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

export default function ErrorBreakdownTable({ result, errorMessage, websiteLabel, pageName }) {
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

  const pageRows = result.data.get('pages').toArray().map(page => {
    return {
      key: page.get('hash'),
      name: page.get('name'),
      count: page.get('count'),
      query: `entity.website.label:"${luceneEscapeString(
        websiteLabel
      )}" span.webEum.error.message:"${luceneEscapeString(errorMessage)}" span.webEum.page:"${luceneEscapeString(
        page.get('name')
      )}"`
    };
  });

  return (
    <Row>
      <Col cols={6}>
        {browserRows.length > 0
          ? <DashboardTile title={`Browsers (${browserRows.length})`}>
              <Table cols={cols} rows={browserRows} initialSortColumn={1} initialSortDirection="desc" />
            </DashboardTile>
          : null}
      </Col>
      <Col cols={6}>
        {pageRows.length > 0
          ? <DashboardTile title={`Pages (${pageRows.length})`}>
              <Table cols={cols} rows={pageRows} initialSortColumn={1} initialSortDirection="desc" />
            </DashboardTile>
          : null}
      </Col>
    </Row>
  );
}
