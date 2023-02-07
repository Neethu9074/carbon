/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getIbmMqttChannelsForQueueManager from 'in-forge/plugins/ibmMqQueueManager/subscriptions/getIbmMqttChannelsForQueueManager';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'channelStatus']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.channelType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'channelType']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.clientId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'clientId']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.connectionName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'connectionName']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.connections'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'connections';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.startDateTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'startDateTime']);
      }
    }
  }
];

export default connectTo(
  props => ({
    mqttchannels: timeConfig$
      .flatMap(timeConfig => getIbmMqttChannelsForQueueManager({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function MqttChannelsTable({ mqttchannels, timeConfig }) {
    if (mqttchannels == null || mqttchannels.length === 0) {
      return null;
    }

    const rows = mqttchannels.map(mqttchannel => {
      const id = mqttchannel.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: mqttchannel,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmMqQueueManager.dashboard.mqttChannelsWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
