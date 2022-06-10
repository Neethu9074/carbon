/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getRocketMqBrokers from 'in-forge/plugins/rocketMqCluster/subscriptions/getRocketMqBrokers';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.rocketMqCluster.brokerName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  }
];

export default connectTo(
  props => ({
    brokers: timeConfig$
      .flatMap(timeConfig => getRocketMqBrokers({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshots)
  }),
  function BrokersTable({ brokers, timeConfig }) {
    if (brokers == null || brokers.length === 0) {
      return null;
    }

    const rows = brokers.map(broker => {
      const id = broker.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: broker,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.rocketMqCluster.brokersNumber', { count: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
