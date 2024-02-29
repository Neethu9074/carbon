/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import { getSnapshots } from 'in-stores/snapshot';
import getQueuesForStorage from 'in-forge/plugins/azureStorage/subscriptions/getQueuesForStorage';
// @ts-expect-error Module needs to be translated to TS
import connectTo from 'in-hoc/connectTo';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.azureStorage.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureStorage.dashboard.type'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'type']);
      }
    }
  },
  {
    title: t('in-forge:plugins.azureStorage.dashboard.location'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'location']);
      }
    }
  }
];

interface QueueInformationProps {
  snapshot: any;
  location: any;
  queues: any[];
  timeConfig: TimeConfig;
}

export default connectTo(
  (props: QueueInformationProps) => ({
    queues: timeConfig$
      .flatMap(timeConfig => getQueuesForStorage({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function QueuesTable({ queues, timeConfig }: QueueInformationProps) {
    if (queues == null || queues.length === 0) {
      return null;
    }

    const rows = queues.map(queue => {
      const id = queue.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: queue,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.azureStorage.dashboard.queuesWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
