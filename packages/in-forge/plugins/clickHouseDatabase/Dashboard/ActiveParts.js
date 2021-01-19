/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { number, bytes } from 'in-services/formatters/number';
import getAgentResponse from 'in-subscription/agentResponse';
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
  },
  {
    title: 'Bytes on Disk',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return parseInt(row.bytesOnDisk, 10);
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
      content = <LoadingIndicator />;
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
