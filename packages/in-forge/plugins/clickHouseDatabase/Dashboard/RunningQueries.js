/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { number, seconds, bytes } from 'in-services/formatters/number';
import getAgentResponse from 'in-subscription/agentResponse';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleQueryID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.query_id || '<without query id>';
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleQuery'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.query;
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleElapsed'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.elapsed;
      },
      getContent: seconds.fixedDetailed
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleReadRows'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return Number(row.read_rows);
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleReadBytes'),
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
          cardTitle={t('in-forge:plugins.clickhouseDatabase.dashboard.titleRunningQueries')}
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
