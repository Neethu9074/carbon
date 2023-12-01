/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import getCatalogforOrganization from 'in-forge/plugins/ibmApiConnect/subscriptions/getCatalogforOrganization';
// @ts-expect-error needs TS migration
import { getSnapshots } from 'in-stores/snapshot';
import { number, millis } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { SnapshotData } from 'in-stores/snapshot';
import { t } from 'in-i18n';

interface CatalogProps {
  snapshotId: SnapshotData;
  timeConfig: TimeConfig;
}

interface CatalogRow {
  key: string;
  snapshotId: string;
  timeConfig: TimeConfig;
  catalogTable: Map<string, string | number>;
}

const cols = [
  {
    title: t('in-forge:plugins.ibmApiConnect.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: CatalogRow) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmApiConnect.totalApiCalls'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: CatalogRow) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'totalApiCalls';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmApiConnect.totalErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: CatalogRow) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'totalError';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmApiConnect.maxApiResponse'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: CatalogRow) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'maxResponseTime';
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

const CatalogInterfacesTable = ({ snapshotId, timeConfig }: CatalogProps) => {
  const catalogInterfaces: any = useObservable(
    () =>
      timeConfig$.flatMap(timeConfig => getCatalogforOrganization({ snapshotId, timeConfig })).flatMap(getSnapshots),
    [snapshotId, timeConfig]
  );
  if (!catalogInterfaces) {
    return null;
  }
  const rows = catalogInterfaces.map((catalogInterface: any) => {
    return {
      key: catalogInterface.get('id'),
      snapshotId: catalogInterface.get('id'),
      catalogTable: catalogInterface,
      timeConfig
    };
  });
  return <Table withoutPadding cardTitle={t('in-forge:plugins.ibmApiConnect.catalogs')} cols={cols} rows={rows} />;
};

export default CatalogInterfacesTable;
