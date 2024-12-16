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

interface ICMRow {
  key: string;
  icmDetail: Map<string, object>;
}

const cols = [
  {
    title: t('in-sap:dashboards.hostName'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMRow) {
        return shorten(row.icmDetail.get('HOSTNAME') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.service'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMRow) {
        return shorten(row.icmDetail.get('SERVICE') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.status'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMRow) {
        return shorten(row.icmDetail.get('ACTIVE') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.extBind'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMRow) {
        return shorten(row.icmDetail.get('EXTBIND') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.protocol'),
    type: 'number',
    typeArgs: {
      getValue(row: ICMRow) {
        return row.icmDetail.get('PROTOCOL');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.keepAlive'),
    type: 'number',
    typeArgs: {
      getValue(row: ICMRow) {
        return row.icmDetail.get('KEEPALIVE');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.procTimeOut'),
    type: 'number',
    typeArgs: {
      getValue(row: ICMRow) {
        return row.icmDetail.get('PROC_TIMEOUT');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.vcClient'),
    type: 'number',
    typeArgs: {
      getValue(row: ICMRow) {
        return row.icmDetail.get('VCLIENT');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.virtualhostIdx'),
    type: 'number',
    typeArgs: {
      getValue(row: ICMRow) {
        return row.icmDetail.get('VIRT_HOST_IDX');
      },
      getContent: number.compact
    }
  }
];

export default function ICMServicesList({ snapshotId }: SnapshotData) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'icmservices'), [snapshotId]);
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
      cardTitle={t('in-sap:dashboards.icmService3List')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
    />
  );
}
