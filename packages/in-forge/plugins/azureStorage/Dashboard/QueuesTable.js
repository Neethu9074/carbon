/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getQueuesForStorage from 'in-subscription/azureStorage/getQueuesForStorage';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.azureStorage.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureStorage.dashboard.type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'type']);
      }
    }
  },
  {
    title: t('in-forge:plugins.azureStorage.dashboard.location'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'location']);
      }
    }
  }
];

export default connectTo(
  props => ({
    queues: timeConfig$
      .flatMap(timeConfig => getQueuesForStorage({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function QueuesTable({ queues, timeConfig }) {
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