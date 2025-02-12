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

interface AbapDumps {
  key: string;
  dumpDetail: Map<string, object>;
}

interface AbapDumpsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.date'),
    type: 'string',
    typeArgs: {
      getValue(row: AbapDumps) {
        return shorten(row.dumpDetail.get('DATUM') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.dumps'),
    type: 'string',
    typeArgs: {
      getValue(row: AbapDumps) {
        return shorten(row.dumpDetail.get('DUMPS') as any, 128);
      }
    }
  }
];

export default function AbapShortDumps({ snapshotId, timeConfig }: AbapDumpsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'shortDumpsHistory', timeConfig),
    [snapshotId, timeConfig]
  );
  if (!data) {
    return null;
  }

  const dumpDetails = (data as SnapshotData).get('raw_payload');
  if (dumpDetails.size === 0) {
    return null;
  }

  const rows: AbapDumps[] = dumpDetails.toArray().map((dumpDetail: any, idx: any) => {
    return {
      key: String(idx),
      dumpDetail
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.shortDumpsHistory')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="desc"
    />
  );
}
