/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import getSubscriptionforCdc from 'in-forge/plugins/ibmInfosphereCdc/subscriptions/getSubscriptionforCdc';
// @ts-expect-error needs TS migration
import { getSnapshots } from 'in-stores/snapshot';
import { seconds } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { SnapshotData } from 'in-stores/snapshot';
import { t } from 'in-i18n';

interface SubscriptionProps {
  snapshotId: SnapshotData;
  timeConfig: TimeConfig;
}

interface SubscriptionRow {
  key: string;
  snapshotId: string;
  timeConfig: TimeConfig;
  subscriptionTable: Map<string, string | number>;
}

const cols = [
  {
    title: t('in-forge:plugins.ibmInfosphereCdc.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: SubscriptionRow) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceEngineLatency'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: SubscriptionRow) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'sourceLatency';
      },
      getContent: seconds.fixedCompact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmInfosphereCdcSubscription.targetApplyLatency'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: SubscriptionRow) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'targetLatency';
      },
      getContent: seconds.fixedCompact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

const SubscriptionInterfacesTable = ({ snapshotId, timeConfig }: SubscriptionProps) => {
  const subscriptionInterfaces: any = useObservable(
    () => timeConfig$.flatMap(timeConfig => getSubscriptionforCdc({ snapshotId, timeConfig })).flatMap(getSnapshots),
    [snapshotId, timeConfig]
  );
  if (!subscriptionInterfaces) {
    return null;
  }
  const rows = subscriptionInterfaces.map((subscriptionInterface: any) => {
    return {
      key: subscriptionInterface.get('id'),
      snapshotId: subscriptionInterface.get('id'),
      subscriptionTable: subscriptionInterface,
      timeConfig
    };
  });
  return (
    <Table withoutPadding cardTitle={t('in-forge:plugins.ibmInfosphereCdc.subscriptions')} cols={cols} rows={rows} />
  );
};

export default SubscriptionInterfacesTable;
