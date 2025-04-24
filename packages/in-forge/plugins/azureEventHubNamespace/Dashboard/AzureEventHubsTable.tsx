/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { List } from 'immutable';
import React from 'react';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface EventHubRow {
  key: string;
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
  snapshotId: string;
}

const cols = [
  {
    title: t('in-forge:plugins.azureEventHubNamespace.eventhub.labelName'),
    type: 'string',
    typeArgs: {
      getValue({ snapshot, key }: EventHubRow) {
        return snapshot.getIn(['data', 'eventHubs', key, 'name'], '');
      }
    }
  },
  {
    title: t('in-forge:plugins.azureEventHubNamespace.eventhub.labelResourceGroup'),
    type: 'string',
    typeArgs: {
      getValue({ snapshot, key }: EventHubRow) {
        return snapshot.getIn(['data', 'eventHubs', key, 'resourceGroup'], '');
      }
    }
  },
  {
    title: t('in-forge:plugins.azureEventHubNamespace.eventhub.labelLocation'),
    type: 'string',
    typeArgs: {
      getValue({ snapshot, key }: EventHubRow) {
        return snapshot.getIn(['data', 'eventHubs', key, 'location'], '');
      }
    }
  },
  {
    title: t('in-forge:plugins.azureEventHubNamespace.eventhub.labelSubscriptionID'),
    type: 'string',
    typeArgs: {
      getValue({ snapshot, key }: EventHubRow) {
        return snapshot.getIn(['data', 'eventHubs', key, 'subscription'], '');
      }
    }
  },
  {
    title: t('in-forge:plugins.azureEventHubNamespace.eventhub.labelType'),
    type: 'string',
    typeArgs: {
      getValue({ snapshot, key }: EventHubRow) {
        return snapshot.getIn(['data', 'eventHubs', key, 'type'], '');
      }
    }
  },
  {
    title: t('in-forge:plugins.azureEventHubNamespace.eventhub.labeState'),
    type: 'string',
    typeArgs: {
      getValue({ snapshot, key }: EventHubRow) {
        return snapshot.getIn(['data', 'eventHubs', key, 'status'], '');
      }
    }
  }
];

export default function AzureEventHubsTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;
  const eventHubs = snapshot.getIn(['data', 'eventHubs'], List());
  if (!eventHubs || eventHubs.size === 0) {
    return null;
  }

  const rows: EventHubRow[] = eventHubs
    .keySeq()
    .toArray()
    .map((eventHubName: string) => {
      return {
        key: eventHubName,
        snapshot: snapshot,
        timeConfig,
        snapshotId
      };
    });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.azureEventHubNamespace.eventhub.titleEventHubCount', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
