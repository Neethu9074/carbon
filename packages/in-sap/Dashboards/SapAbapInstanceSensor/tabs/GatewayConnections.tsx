/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

interface GatewayConnectionRow {
  key: string;
  gatewayConnection: Map<string, object>;
}

interface GatewayConnectionRowProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.name'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayConnectionRow) {
        return shorten(row.gatewayConnection.get('LUNAME') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.tpName'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayConnectionRow) {
        return shorten(row.gatewayConnection.get('TPNAME') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.systemType'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayConnectionRow) {
        return shorten(row.gatewayConnection.get('SYSTYPE') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.host'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayConnectionRow) {
        return shorten(row.gatewayConnection.get('HOST') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.address'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayConnectionRow) {
        return shorten(row.gatewayConnection.get('ADDR') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.lastReq'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayConnectionRow) {
        return shorten(row.gatewayConnection.get('LAST_REQ') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.tableType'),
    type: 'string',
    typeArgs: {
      getValue(row: GatewayConnectionRow) {
        return shorten(row.gatewayConnection.get('TBLTYPE') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.numberOfConnections'),
    type: 'number',
    typeArgs: {
      getValue(row: GatewayConnectionRow) {
        return row.gatewayConnection.get('NO');
      },
      getContent: number.compact
    }
  }
];

export default function GatewayConnections({ snapshotId, timeConfig }: GatewayConnectionRowProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'gatewayconnection', timeConfig),
    [snapshotId, timeConfig]
  );
  if (!data) {
    return null;
  }
  const gatewayConnections = (data as SnapshotData).get('raw_payload');
  if (gatewayConnections.size === 0) {
    return null;
  }

  const rows: GatewayConnectionRow[] = gatewayConnections.toArray().map((gatewayConnection: any, idx: any) => {
    return {
      key: String(idx),
      gatewayConnection
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.gatewayConnections')}
      cols={cols}
      rows={rows}
      initialSortColumn={7}
      initialSortDirection="desc"
    />
  );
}
