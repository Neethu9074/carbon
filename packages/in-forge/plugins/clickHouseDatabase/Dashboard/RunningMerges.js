/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { createAgentResponseObservable, getAgentResponse } from 'in-subscription/agentResponse';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { number, seconds, bytes } from 'in-services/formatters/number';
import { pendingResult } from 'in-services/fixedObjects';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleDatabase'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.database;
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleTable'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.table;
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titlePartitionId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.partition_id;
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleResultPartName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.result_part_name;
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleNumberOfParts'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return Number(row.num_parts);
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleElapsed'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return Number(row.elapsed);
      },
      getContent: seconds.fixedDetailed
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleRowsRead'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return Number(row.elapsed);
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleRowsWritten'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return Number(row.rows_written);
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleMemoryUsage'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return Number(row.memory_usage);
      },
      getContent: bytes.compact
    }
  }
];

/*
export function getRunningMerges(snapshot) {
  () => createAgentResponseObservable({action: 'clickHouse.getRunningMerges',
                                                            target: snapshot.get('volatileId'),
                                                            args: {}
                                                           }).once(response => {console.log('response')});
}
export default function RunningMerges({ snapshot, timeConfig }) {
  const response = useObservable(getRunningMerges(snapshot), []);
  console.log(response);
  //const response = getRunningMerges(snapshot);
  let content = null;
  */
export default connectTo(
  ({ snapshot, timeConfig }) => ({
    response:
      timeConfig.focusedMoment == null &&
      getAgentResponse({
        action: 'clickHouse.getRunningMerges',
        target: snapshot.get('volatileId'),
        args: {}
      })
  }),
  function RunningMerges({ timeConfig, response }) {
    let content = null;
    if (timeConfig.autoRefresh == false) {
      content = (
        <DashboardNotification type="info">Running merges list is only available in live mode.</DashboardNotification>
      );
    //console.log(response);
    } else if (response == null) {
      content = <LoadingIndicator />;
    } else if (response.error) {
      content = (
        <DashboardNotification type="danger">Failed to retrieve running merges: {response.error}</DashboardNotification>
      );
    } else {
      const data = JSON.parse(response.data);
      const rows = data.data.map((r, i) => ({
        key: String(i),
        ...r
      }));
      if (rows.length === 0) {
        content = (
          <DashboardNotification type="info">No running merges</DashboardNotification>
        );
      } else {
        content = (
          <Table
            withoutPadding
            cardTitle={t('in-forge:plugins.clickhouseDatabase.dashboard.titleRunningMerges')}
            cols={cols}
            rows={rows}
            maxItemsPerPage={25}
            initialSortColumn={5}
            initialSortDirection="desc"
          />
        );
      }
    }
    return content;
  }
);
