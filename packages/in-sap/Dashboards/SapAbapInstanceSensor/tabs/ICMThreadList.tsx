/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from './RawTableFormat.mless';

interface ICMRow {
  key: string;
  icmDetail: Map<string, object>;
}

const cols = [
  {
    title: t('in-sap:dashboards.threadState'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMRow) {
        return row.icmDetail.get('THR_STAT');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.reqType'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMRow) {
        return row.icmDetail.get('REQ_TYPE');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.conn'),
    type: 'number',
    typeArgs: {
      getValue(row: ICMRow) {
        return row.icmDetail.get('CONN');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.guid'),
    type: 'number',
    typeArgs: {
      getValue(row: ICMRow) {
        return row.icmDetail.get('GUID');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.threadID'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMRow) {
        return row.icmDetail.get('THR_ID');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.reqCount'),
    type: 'number',
    typeArgs: {
      getValue(row: ICMRow) {
        return row.icmDetail.get('REQ_COUNT');
      },
      getContent: number.compact
    }
  }
];

export default function ICMThreadList({ snapshotId }: SnapshotData) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'icmthread'), [snapshotId]);
  if (!data) {
    return null;
  }

  const icmDetails = (data as SnapshotData).get('raw_payload');
  if (icmDetails.size === 0) {
    return null;
  }

  const rows: ICMRow[] = icmDetails.toArray().map((icmDetail: any, idx: any) => {
    return {
      key: String(idx),
      icmDetail
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.icmThreadMetrics')}
      cols={cols}
      rows={rows}
      initialSortColumn={5}
      initialSortDirection="asc"
    />
  );
}

function Args({ args }: any) {
  return <code className={locals.statement}>{args}</code>;
}
