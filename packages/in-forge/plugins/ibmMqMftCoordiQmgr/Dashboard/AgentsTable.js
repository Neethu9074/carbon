/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import getIbmMqMftAgentsForCoordiQmgr from '../subscriptions/getIbmMqMftAgentsForCoordiQmgr';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmMqMftAgent.dashboard.agentName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftAgent.dashboard.queueManager'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'queueManager']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftAgent.dashboard.AgentStartTimeUTC'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'AgentStartTimeUTC']);
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftAgent.dashboard.totalSourceTransfers'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'totalSourceTransfers';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftAgent.dashboard.totalDestinationTransfers'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'totalDestinationTransfers';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftAgent.dashboard.agentStatus'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        var status = t('in-forge:plugins.ibmMqMftAgent.dashboard.statusUnknown');
        if (row.snapshot.getIn(['data', 'agentStatus']) == 'Started') {
          status = t('in-forge:plugins.ibmMqMftAgent.dashboard.statusRunning');
        }
        return status;
      }
    }
  }
];

export default connectTo(
  props => ({
    agents: timeConfig$
      .flatMap(timeConfig => getIbmMqMftAgentsForCoordiQmgr({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
  }),
  function MftAgentsTable({ agents, timeConfig }) {
    if (agents == null || agents.length === 0) {
      return null;
    }

    const rows = agents.map(agent => {
      const id = agent.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: agent,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.agentsWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
