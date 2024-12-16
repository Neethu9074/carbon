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

interface GatewayEntryRow {
  key: string;
  gatewayEntry: Map<string, object>;
}

const cols = [
  {
    title: t('in-sap:dashboards.timeStamp'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayEntryRow) {
        return shorten(row.gatewayEntry.get('timeStamp') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.serviceName'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayEntryRow) {
        return shorten(row.gatewayEntry.get('serviceName') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.processingTime'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayEntryRow) {
        return shorten(row.gatewayEntry.get('processingTime') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.gatewayBackendOverhead'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayEntryRow) {
        return shorten(row.gatewayEntry.get('gatewayBackendOverhead') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.sumOfApplicationTimes'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayEntryRow) {
        return shorten(row.gatewayEntry.get('sumOfApplicationTimes') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.requestSize'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayEntryRow) {
        return shorten(row.gatewayEntry.get('requestSize') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.responseSize'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayEntryRow) {
        return shorten(row.gatewayEntry.get('responseSize') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.numberEntry'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayEntryRow) {
        return shorten(row.gatewayEntry.get('numEntry') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.userId'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayEntryRow) {
        return shorten(row.gatewayEntry.get('userId') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.transactionId'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayEntryRow) {
        return shorten(row.gatewayEntry.get('transactionId') as any, 128);
      }
    }
  }
];

export default function GatewayStats({ snapshotId }: SnapshotData) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'gatewayStats'), [snapshotId]);
  const gatewayEntrys = data ? (data as SnapshotData).get('raw_payload') : null;
  const rows: GatewayEntryRow[] = gatewayEntrys
    ? gatewayEntrys.toArray().map((gatewayEntry: any, idx: any) => {
        return {
          key: String(idx),
          gatewayEntry
        };
      })
    : [];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.GatewayStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
    />
  );
}
