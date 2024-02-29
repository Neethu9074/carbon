/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import getSpaceforOrganization from 'in-forge/plugins/ibmApiConnectCatalog/subscriptions/getSpaceforOrganization';
// @ts-expect-error needs TS migration
import { getSnapshots } from 'in-stores/snapshot';
import { number, millis } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { SnapshotData } from 'in-stores/snapshot';
import { t } from 'in-i18n';

interface SpaceProps {
  snapshotId: SnapshotData;
  timeConfig: TimeConfig;
}

interface SpaceRow {
  key: string;
  snapshotId: string;
  timeConfig: TimeConfig;
  SpaceTable: Map<string, string | number>;
}

const cols = [
  {
    title: t('in-forge:plugins.ibmApiConnect.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: SpaceRow) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmApiConnect.totalApiCalls'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: SpaceRow) {
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
      getSnapshotId(row: SpaceRow) {
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
      getSnapshotId(row: SpaceRow) {
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

const SpaceInterfacesTable = ({ snapshotId, timeConfig }: SpaceProps) => {
  const spaceInterfaces: any = useObservable(
    () => timeConfig$.flatMap(timeConfig => getSpaceforOrganization({ snapshotId, timeConfig })).flatMap(getSnapshots),
    [snapshotId, timeConfig]
  );
  if (!spaceInterfaces) {
    return null;
  }
  const rows = spaceInterfaces.map((spaceInterface: any) => {
    return {
      key: spaceInterface.get('id'),
      snapshotId: spaceInterface.get('id'),
      spaceTable: spaceInterface,
      timeConfig
    };
  });
  return <Table withoutPadding cardTitle={t('in-forge:plugins.ibmApiConnect.spaces')} cols={cols} rows={rows} />;
};

export default SpaceInterfacesTable;
