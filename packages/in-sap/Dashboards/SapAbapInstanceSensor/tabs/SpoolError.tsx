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

interface SpoolErrorRow {
  key: string;
  spoolErrorEntry: Map<string, object>;
}

interface SpoolErrorRowProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row: SpoolErrorRow) {
        return shorten(row.spoolErrorEntry.get('PJClient') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.owner'),
    type: 'string',
    typeArgs: {
      getValue(row: SpoolErrorRow) {
        return shorten(row.spoolErrorEntry.get('PJOwner') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.destination'),
    type: 'string',
    typeArgs: {
      getValue(row: SpoolErrorRow) {
        return shorten(row.spoolErrorEntry.get('PJDestination') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.status'),
    type: 'string',
    typeArgs: {
      getValue(row: SpoolErrorRow) {
        return shorten(row.spoolErrorEntry.get('PJStatus') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.date'),
    type: 'string',
    typeArgs: {
      getValue(row: SpoolErrorRow) {
        return shorten(row.spoolErrorEntry.get('date') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.time'),
    type: 'string',
    typeArgs: {
      getValue(row: SpoolErrorRow) {
        return shorten(row.spoolErrorEntry.get('time') as any, 128);
      }
    }
  }
];

export default function SpoolError({ snapshotId, timeConfig }: SpoolErrorRowProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'spoolErrorStats', timeConfig),
    [snapshotId, timeConfig]
  );
  const spoolErrorEntrys = data ? (data as SnapshotData).get('raw_payload') : null;
  const rows: SpoolErrorRow[] = spoolErrorEntrys
    ? spoolErrorEntrys.toArray().map((spoolErrorEntry: any, idx: any) => {
        return {
          key: String(idx),
          spoolErrorEntry
        };
      })
    : [];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.spoolError')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
    />
  );
}
