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

interface rfcErrorRow {
  key: string;
  configDetail: Map<string, object>;
}

const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row: rfcErrorRow) {
        return shorten(row.configDetail.get('CLIENT') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: rfcErrorRow) {
        return shorten(row.configDetail.get('E2E_USER') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.severity'),
    type: 'string',
    typeArgs: {
      getValue(row: rfcErrorRow) {
        return shorten(row.configDetail.get('E2E_SEVERITY') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.errorId'),
    type: 'string',
    typeArgs: {
      getValue(row: rfcErrorRow) {
        return shorten(row.configDetail.get('ERROR_ID') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.description'),
    type: 'string',
    typeArgs: {
      getValue(row: rfcErrorRow) {
        return shorten(row.configDetail.get('DESC') as any, 128);
      }
    }
  },
  {
    title: t('in-sap:dashboards.dateAndTime'),
    type: 'string',
    typeArgs: {
      getValue(row: rfcErrorRow) {
        return shorten(row.configDetail.get('E2E_DATE') as any, 128);
      }
    }
  }
];

export default function RfcErrorLogs({ snapshotId }: SnapshotData) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'rfcErrorLogs'), [snapshotId]);
  if (!data) {
    return null;
  }

  const configDetails = (data as SnapshotData).get('raw_payload');
  if (configDetails.size === 0) {
    return null;
  }

  const rows: rfcErrorRow[] = configDetails.toArray().map((configDetail: any, idx: any) => {
    return {
      key: String(idx),
      configDetail
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.rfcErrorLogs')}
      cols={cols}
      rows={rows}
      initialSortColumn={5}
      initialSortDirection="desc"
    />
  );
}
