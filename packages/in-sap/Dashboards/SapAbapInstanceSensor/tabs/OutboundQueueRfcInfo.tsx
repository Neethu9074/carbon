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

interface ICMOutboundQRFCRow {
  key: string;
  rfcDetail: Map<string, object>;
}

interface ICMOutboundQRFCProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}
const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMOutboundQRFCRow) {
        return shorten(row.rfcDetail.get('MANDT') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMOutboundQRFCRow) {
        return shorten(row.rfcDetail.get('QRFCUSER') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.destinations'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMOutboundQRFCRow) {
        return shorten(row.rfcDetail.get('DEST') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.procId'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMOutboundQRFCRow) {
        return shorten(row.rfcDetail.get('ARFCPID') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.rfcQueueName'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMOutboundQRFCRow) {
        return shorten(row.rfcDetail.get('QNAME') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.functionModule'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMOutboundQRFCRow) {
        return shorten(row.rfcDetail.get('QRFCFNAM') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.queueState'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMOutboundQRFCRow) {
        return shorten(row.rfcDetail.get('QSTATE') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:abapsensor.date'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMOutboundQRFCRow) {
        return shorten(row.rfcDetail.get('QRFCDATUM') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:abapsensor.time'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMOutboundQRFCRow) {
        return shorten(row.rfcDetail.get('QRFCUZEIT') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.message'),
    type: 'string',
    typeArgs: {
      getValue(row: ICMOutboundQRFCRow) {
        return shorten(row.rfcDetail.get('ERRMESS') as any, 128);
      }
    }
  }
];

export default function OutboundQueueRfcInfo({ snapshotId, timeConfig }: ICMOutboundQRFCProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'outboundQRfcInfo', timeConfig),
    [snapshotId, timeConfig]
  );
  const tRFCDetails = data ? (data as SnapshotData).get('raw_payload') : null;
  const rows: ICMOutboundQRFCRow[] = tRFCDetails
    ? tRFCDetails.toArray().map((tRFCDetail: any, idx: any) => {
        return {
          key: String(idx),
          tRFCDetail
        };
      })
    : [];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.outboundQueueRfcInfo')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="desc"
    />
  );
}
