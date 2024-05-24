/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { number, seconds, bytes, percentage } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import getAgentResponse from 'in-subscription/agentResponse';
import { pendingResult } from 'in-services/fixedObjects';
import Table from 'in-sdk/components/dashboard/Table';
import { isLoading } from 'in-services/util/result';
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
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleEstimate'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return Number(row.estimate);
      },
      getContent: seconds.detailed
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleElapsed'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return Number(row.elapsed);
      },
      getContent: seconds.detailed
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleProgress'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return Number(row.progress);
      },
      getContent: percentage.compact
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleIsMutation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.is_mutation === 1 ? 'True' : 'False';
      }
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleTotalSizeBytesCompressed'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return Number(row.total_size_bytes_compressed);
      },
      getContent: bytes.compact
    }
  },
  {
    title: t('in-forge:plugins.clickhouseDatabase.dashboard.titleRowsRead'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return Number(row.rows_read);
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

export default function RunningMerges({ timeConfig, snapshot }) {
  let content = null;
  const response =
    useObservable(
      () =>
        getAgentResponse({
          action: 'clickHouse.getRunningMerges',
          target: snapshot.get('volatileId'),
          args: {}
        }),
      [snapshot]
    ) ?? pendingResult;
  if (timeConfig.focusedMoment != null) {
    content = (
      <DashboardNotification type="info">
        {t('in-forge:plugins.clickhouseDatabase.dashboard.explanationRunningMergesNotAvailable')}
      </DashboardNotification>
    );
  } else if (isLoading(response)) {
    content = <LoadingIndicator />;
  } else if (response.error) {
    content = (
      <DashboardNotification type="danger">
        {t('in-forge:plugins.clickhouseDatabase.dashboard.errorRetrieveRunningMerges')}: {response.error}
      </DashboardNotification>
    );
  } else {
    const data = JSON.parse(response.data);
    const rows = data.data.map((r, i) => ({
      key: String(i),
      ...r
    }));
    if (rows.length === 0) {
      content = (
        <DashboardNotification type="info">
          {t('in-forge:plugins.clickhouseDatabase.dashboard.infoNoRunningMerges')}
        </DashboardNotification>
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
