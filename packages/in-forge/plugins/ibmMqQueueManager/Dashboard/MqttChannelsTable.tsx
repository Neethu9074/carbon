/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import getIbmMqttChannelsForQueueManager from '../subscriptions/getIbmMqttChannelsForQueueManager';
import { getSnapshot, SnapshotData } from 'in-stores/snapshot/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

//import { Result } from '@instana/types';

// import { combineLatest, just } from '@instana/observables';
// import { Result } from '@instana/types';
// import getIbmMqMftMonitorsForCoordiQmgr from '../subscriptions/getIbmMqMftMonitorsForCoordiQmgr';
// import { pendingResult } from 'in-services/fixedObjects';
// import { success } from 'in-services/util/result';
// import connectTo from 'in-hoc/connectTo';import { t } from 'in-i18n';
// import { useObservable } from '@instana/hooks/types/useObservable/useObservable';

const cols = [
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.status'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'channelStatus']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.channelType'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'channelType']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.clientId'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'clientId']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.connectionName'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'connectionName']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.connections'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
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
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'startDateTime']);
      }
    }
  }
];

export default function MqttChannelsTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;
  const mqttchannels = useObservable(
    getIbmMqttChannelsForQueueManager({ snapshotId, timeConfig: timeConfig }).flatMap(result =>
      result.data
        ? combineLatest(result.data.map(mqttchannel => getSnapshot(mqttchannel, timeConfig))).map(mqttchannels =>
            success(mqttchannels)
          )
        : just(pendingResult as Result<SnapshotData[]>)
    ),
    [snapshotId, timeConfig]
  );

  if (!mqttchannels?.data) {
    return null;
  }

  const rows = mqttchannels.data?.map(mqttchannel => {
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
