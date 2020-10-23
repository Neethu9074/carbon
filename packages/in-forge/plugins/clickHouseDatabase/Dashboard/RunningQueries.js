import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { number, seconds, bytes } from 'in-services/formatters/number';
import getAgentResponse from 'in-subscription/agentResponse';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'Query ID',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.query_id || '<without query id>';
      }
    }
  },
  {
    title: 'Query',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.query;
      }
    }
  },
  {
    title: 'Elapsed',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.elapsed;
      },
      getContent: seconds.fixedDetailed
    }
  },
  {
    title: 'Read Rows',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return Number(row.read_rows);
      },
      getContent: number.compact
    }
  },
  {
    title: 'Read Bytes',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return Number(row.read_bytes);
      },
      getContent: bytes.detailed
    }
  }
];

export default connectTo(
  ({ snapshot, timeConfig }) => ({
    response:
      timeConfig.focusedMoment == null &&
      getAgentResponse({
        action: 'clickHouse.getRunningQueries',
        target: snapshot.get('volatileId'),
        args: {}
      })
  }),
  function ActiveParts({ timeConfig, response }) {
    let content = null;

    if (timeConfig.focusedMoment != null) {
      content = (
        <DashboardNotification type="info">Running queries list is only available in live mode.</DashboardNotification>
      );
    } else if (response == null) {
      content = <LoadingIndicator />;
    } else if (response.error) {
      content = (
        <DashboardNotification type="danger">
          Failed to retrieve running queries: {response.error}
        </DashboardNotification>
      );
    } else {
      const data = JSON.parse(response.data);
      const rows = data.data.map((r, i) => ({
        key: String(i),
        ...r
      }));
      content = (
        <Table
          withoutPadding
          cardTitle="Running Queries"
          cols={cols}
          rows={rows}
          maxItemsPerPage={25}
          initialSortColumn={2}
          initialSortDirection="desc"
        />
      );
    }

    return content;
  }
);
