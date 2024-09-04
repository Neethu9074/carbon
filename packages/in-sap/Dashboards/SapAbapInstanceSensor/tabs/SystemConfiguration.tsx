/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

interface configRow {
  key: string;
  configDetail: Map<string, object>;
}

const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row: configRow) {
        return shorten(row.configDetail.get('MANDANT') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: configRow) {
        return shorten(row.configDetail.get('USERNAME') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.modifiedInTCode'),
    type: 'string',
    typeArgs: {
      getValue(row: configRow) {
        return shorten(row.configDetail.get('TCODE') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.objectID'),
    type: 'string',
    typeArgs: {
      getValue(row: configRow) {
        return shorten(row.configDetail.get('OBJECTID') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.objectClass'),
    type: 'string',
    typeArgs: {
      getValue(row: configRow) {
        return shorten(row.configDetail.get('OBJECTCLAS') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.changeRecordNumber'),
    type: 'string',
    typeArgs: {
      getValue(row: configRow) {
        return shorten(row.configDetail.get('CHANGENR') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.updatedDateTime'),
    type: 'string',
    typeArgs: {
      getValue(row: configRow) {
        return shorten(row.configDetail.get('updatedDateTime') as any, 128);
      }
    }
  }
];

export default function SystemConfiguration({ snapshotId }: SnapshotData) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'configChanges'), [snapshotId]);
  if (!data) {
    return null;
  }

  const configDetails = (data as SnapshotData).get('raw_payload');
  if (configDetails.size === 0) {
    return null;
  }

  const rows: configRow[] = configDetails.toArray().map((configDetail: any, idx: any) => {
    return {
      key: String(idx),
      configDetail
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.systemConfigurationChanges')}
      cols={cols}
      rows={rows}
      initialSortColumn={6}
      initialSortDirection="desc"
    />
  );
}
