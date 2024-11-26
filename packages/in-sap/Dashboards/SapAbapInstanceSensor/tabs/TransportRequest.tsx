/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { requestStatusMap, statusList } from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/TransportRequestStatus';
import Table from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Table';
import ComboBox from 'in-components/ComboBox/LegacyComboBox';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/ComboBox.mless';

interface TransportRequestRow {
  key: string;
  requestEntry: Map<string, object>;
}

const cols = [
  {
    title: t('in-sap:dashboards.owner'),
    type: 'string',
    typeArgs: {
      getValue(row: TransportRequestRow) {
        return row.requestEntry.get('owner');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.request'),
    type: 'string',
    typeArgs: {
      getValue(row: TransportRequestRow) {
        return row.requestEntry.get('request');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.target'),
    type: 'string',
    typeArgs: {
      getValue(row: TransportRequestRow) {
        return row.requestEntry.get('target');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.category'),
    type: 'string',
    typeArgs: {
      getValue(row: TransportRequestRow) {
        return row.requestEntry.get('category');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.status'),
    type: 'string',
    typeArgs: {
      getValue(row: TransportRequestRow) {
        return row.requestEntry.get('statusValue');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.type'),
    type: 'string',
    typeArgs: {
      getValue(row: TransportRequestRow) {
        return row.requestEntry.get('type');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.date'),
    type: 'string',
    typeArgs: {
      getValue(row: TransportRequestRow) {
        return row.requestEntry.get('date');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.time'),
    type: 'string',
    typeArgs: {
      getValue(row: TransportRequestRow) {
        return row.requestEntry.get('time');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  }
];

export default function TransportRequest({ snapshotId }: SnapshotData) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'transportRequest'), [snapshotId]);
  // @ts-expect-error Module needs to be translated to TS
  const [{ logonType }, setPhase] = useState(requestStatusMap);
  const rightHeader = (
    <ComboBox
      placeholder={t('in-sap:dashboards.status')}
      isSearchable={false}
      value={logonType}
      className={locals.filter}
      // @ts-expect-error Module needs to be translated to TS
      onChange={t => setPhase({ logonType: t ? t.value : null })}
      options={requestStatusMap}
    />
  );

  const requestEntrys = data ? (data as SnapshotData).get('raw_payload', []) : null;

  const rows: TransportRequestRow[] = requestEntrys
    ? requestEntrys
        .toArray()
        .map((requestEntry: any, idx: any) => {
          return {
            key: String(idx),
            requestEntry
          };
        })
        .filter(function (rows: TransportRequestRow) {
          if (logonType == null) {
            return rows;
          } else if (logonType == 'Others') {
            const type = rows.requestEntry.get('statusValue');
            return rows != null && typeof type === 'string' && !statusList.includes(type);
          } else {
            return rows != null && rows.requestEntry.get('statusValue') === logonType;
          }
        })
    : [];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.transportRequest')}
      cols={cols}
      rows={rows}
      initialSortColumn={6}
      initialSortDirection="desc"
      rightHeader={rightHeader}
    />
  );
}

function Args({ args }: any) {
  return <code>{args}</code>;
}
