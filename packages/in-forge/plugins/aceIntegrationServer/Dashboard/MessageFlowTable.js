/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { combineLatest } from '@instana/observables';

import { percentageZeroDecimalPlaces, timeByMicroTwoDecimalPlaces } from 'in-services/formatters/number';
import { getClusterMembers } from 'in-sdk/clusterMembers';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const missingValue = 'N/A';

const msgflowName_Col = {
  title: t('in-forge:plugins.aceIntegrationServer.messageFlowName'),
  type: 'snapshotLink',
  typeArgs: {
    getSnapshotId(row) {
      return row.key;
    }
  }
};
const msgflowAppName_Col = {
  title: t('in-forge:plugins.aceIntegrationServer.messageFlowApplicationName'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.snapshot.getIn(['data', 'applicationName'], missingValue);
    }
  }
};
const msgflowStatus_Col = {
  title: t('in-forge:plugins.aceIntegrationServer.status'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.snapshot.getIn(['data', 'state'], missingValue);
    }
  }
};
const msgflowThreadUtilization_Col = {
  title: t('in-forge:plugins.aceMessageFlow.messageFlowThreadUtilization'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName() {
      return 'threadUtilization';
    },
    getContent: function(threadUtilization) {
      if (threadUtilization < 0) {
        return missingValue;
      } else {
        return percentageZeroDecimalPlaces(threadUtilization);
      }
    },
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const msgflowMaxElapsedTime_Col = {
  title: t('in-forge:plugins.aceMessageFlow.maxElapsedTime'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName() {
      return 'maxElapsedTime';
    },
    getContent: function(maxElapsedTime) {
      if (maxElapsedTime < 0) {
        return missingValue;
      } else {
        return timeByMicroTwoDecimalPlaces(maxElapsedTime);
      }
    },
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const msgflowHealthIndicator_Col = {
  title: t('in-forge:plugins.aceMessageFlow.messageFlowHealth'),
  type: 'health',
  typeArgs: {
    getSnapshotId(row) {
      return row.key;
    }
  }
};

export default connectTo(
  props => ({
    messageFlows: getClusterMembers(props.snapshotId)
      // Always start with an empty set to avoid inconsistent view,
      // displaying running components for a previously selected snapshot.
      .flatMap(messageFlowIds => combineLatest(messageFlowIds.toArray().map(id => getSnapshot(id))))
      .throttle(1000)
  }),

  function MessageFlowTable({ messageFlows, timeConfig, isCloud }) {
    if (messageFlows == null || messageFlows.length === 0) {
      return null;
    }

    const rows = messageFlows.map(messageFlow => {
      const id = messageFlow.get('id');
      return {
        key: id,
        snapshotId: id,
        snapshot: messageFlow,
        timeConfig
      };
    });
    const cols = [msgflowName_Col, msgflowAppName_Col, msgflowStatus_Col, msgflowMaxElapsedTime_Col];
    if (!isCloud) {
      cols.push(msgflowThreadUtilization_Col);
    }
    cols.push(msgflowHealthIndicator_Col);
    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.aceIntegrationServer.messageFlowNumber', { count: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
