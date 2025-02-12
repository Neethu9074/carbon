/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

interface userProfileRow {
  key: string;
  configDetail: Map<string, object>;
}

interface userProfileProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row: userProfileRow) {
        return shorten(row.configDetail.get('MANDT') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.clientName'),
    type: 'string',
    typeArgs: {
      getValue(row: userProfileRow) {
        return shorten(row.configDetail.get('MTEXT') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.clientRole'),
    type: 'string',
    typeArgs: {
      getValue(row: userProfileRow) {
        return shorten(row.configDetail.get('CCCATEGORY') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.objectChanges'),
    type: 'string',
    typeArgs: {
      getValue(row: userProfileRow) {
        return shorten(row.configDetail.get('CCCORACTIV') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.logicalSystem'),
    type: 'string',
    typeArgs: {
      getValue(row: userProfileRow) {
        return shorten(row.configDetail.get('LOGSYS') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.changeBy'),
    type: 'string',
    typeArgs: {
      getValue(row: userProfileRow) {
        return shorten(row.configDetail.get('CHANGEUSER') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.changedOn'),
    type: 'string',
    typeArgs: {
      getValue(row: userProfileRow) {
        return shorten(row.configDetail.get('CHANGEDATE') as any, 128);
      }
    }
  }
];

export default function UserConfigurationChanges({ snapshotId, timeConfig }: userProfileProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'userChanges', timeConfig),
    [snapshotId, timeConfig]
  );
  if (!data) {
    return null;
  }

  const configDetails = (data as SnapshotData).get('raw_payload');
  if (configDetails.size === 0) {
    return null;
  }

  const rows: userProfileRow[] = configDetails.toArray().map((configDetail: any, idx: any) => {
    return {
      key: String(idx),
      configDetail
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.clientConfigurationChanges')}
      cols={cols}
      rows={rows}
      initialSortColumn={6}
      initialSortDirection="desc"
    />
  );
}
