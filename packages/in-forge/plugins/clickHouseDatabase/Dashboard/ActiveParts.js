import React from 'react';

import DashboardNotification from 'in-components/DashboardNotification';
import LoadingIndicator from 'in-components/LoadingIndicator';
import getAgentResponse from 'in-subscription/agentResponse';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'Database',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.database;
      }
    }
  },
  {
    title: 'Table',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.table;
      }
    }
  },
  {
    title: 'Active Parts',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return parseInt(row.activeParts, 10);
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  ({ snapshot, timeConfig }) => ({
    response:
      timeConfig.focusedMoment == null &&
      getAgentResponse({
        action: 'clickHouse.getActiveParts',
        target: snapshot.get('volatileId'),
        args: {}
      })
  }),
  function ActiveParts({ timeConfig, response }) {
    let content = null;

    if (timeConfig.focusedMoment != null) {
      content = (
        <DashboardNotification type="info">Active part analysis is only available in live mode.</DashboardNotification>
      );
    } else if (response == null) {
      content = <LoadingIndicator type="dark" />;
    } else if (response.error) {
      content = (
        <DashboardNotification type="danger">
          Failed to retrieve active part analysis: {response.error}
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
          cardTitle="Active Parts"
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
