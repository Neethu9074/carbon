/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { emptyMap } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface ServiceListTableProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

interface Row {
  key: string;
  service: Map<string, string | number>;
  timeConfig: TimeConfig;
  snapshotId: string;
}

const cols = [
  {
    title: t('in-forge:plugins.mapRCluster.serviceName'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.mapRCluster.active'),
    type: 'number',
    typeArgs: {
      getValue(row: Row) {
        return row.service.get('active');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.mapRCluster.stopped'),
    type: 'number',
    typeArgs: {
      getValue(row: Row) {
        return row.service.get('stopped');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.mapRCluster.failed'),
    type: 'number',
    typeArgs: {
      getValue(row: Row) {
        return row.service.get('failed');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.mapRCluster.total'),
    type: 'number',
    typeArgs: {
      getValue(row: Row) {
        return row.service.get('total');
      },
      getContent: number.compact
    }
  }
];

export default function ServiceListTable({ snapshot, timeConfig }: ServiceListTableProps) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'services'], emptyMap)
    .map((service: Object, key: string) => {
      return {
        key,
        service,
        timeConfig,
        snapshotId
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.mapRCluster.services', {
        len: rows.length
      })}
      cols={cols}
      rows={rows}
    />
  );
}
