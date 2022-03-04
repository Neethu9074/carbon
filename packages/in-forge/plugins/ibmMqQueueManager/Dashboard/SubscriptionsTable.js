/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import getIbmMqSubscriptionsForQueueManager from 'in-forge/plugins/ibmMqQueueManager/subscriptions/getIbmMqSubscriptionsForQueueManager';
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
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.subType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.subName.getIn(['data', 'subType']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.topicString'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.subName.getIn(['data', 'topicString'], 'N/A');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.durable'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.subName.getIn(['data', 'durable']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.numberMessages'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'numberMessages';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqQueueManager.dashboard.subAlternatedAt'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.subName.getIn(['data', 'subAlternatedAtDateTime']);
      }
    }
  }
];

export default connectTo(
  props => ({
    subNames: timeConfig$
      .flatMap(timeConfig => getIbmMqSubscriptionsForQueueManager({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function SubscriptionsTable({ subNames, timeConfig }) {
    if (subNames == null || subNames.length === 0) {
      return null;
    }

    const rows = subNames.map(subName => {
      const id = subName.get('id');
      return {
        key: id,
        subName,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmMqQueueManager.dashboard.subsWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
