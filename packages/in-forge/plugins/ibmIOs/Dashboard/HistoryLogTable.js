/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { MessageTypeEnum } from './MessageTypeConst';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.messageId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.historyLogRawData.get('messageId');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.fromUser'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.historyLogRawData.get('fromUser');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.fromJob'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.historyLogRawData.get('fromJob');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.fromProgram'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.historyLogRawData.get('fromProgram');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.messageType'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `historyLogMetrics.${row.key}.messageType`;
      },
      getContent: MessageTypeEnum,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.severity'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `historyLogMetrics.${row.key}.severity`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.messageTimestamp'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.historyLogRawData.get('messageTimestamp');
      }
    }
  }
];

export default connectTo(
  props => {
    const { snapshotId } = props;
    return {
      data: getRawPayloadWithTimestamp(snapshotId, 'historyLogInfoRawPayload')
    };
  },
  function HistoryLogTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const historyLogInfoRawPayload = data.get('raw_payload');
    if (historyLogInfoRawPayload.size === 0) {
      return null;
    }

    const rows = historyLogInfoRawPayload
      .map((historyLogRawData, key) => {
        return {
          key,
          historyLogRawData,
          timeConfig,
          snapshotId
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.name')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={6}
        initialSortDirection="desc"
        getRowDetails={getRowDetails}
      />
    );
  }
);

function getRowDetails(row) {
  return (
    <div>
      <p>
        <label>
          <strong>{t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.messageText')}</strong>
          {' : '}
        </label>
        {row.historyLogRawData.get('messageText')}
      </p>
      <p>
        <label>
          <strong>{t('in-forge:plugins.ibmIOs.dashboard.tables.historyLog.messageSecondLevelText')}</strong>
          {' : '}
        </label>
        {row.historyLogRawData.get('messageSecondLevelText')}
      </p>
    </div>
  );
}
