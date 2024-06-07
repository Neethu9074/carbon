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
    title: t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.messageId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.messageQueueStringData.get('messageId');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.messageQueueLibrary'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.messageQueueStringData.get('messageQueueLibrary');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.messageQueueName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.messageQueueStringData.get('messageQueueName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.messageKey'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.messageQueueStringData.get('messageKey');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.messageType'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `messageQueueMetrics.${row.key}.messageType`;
      },
      getContent: MessageTypeEnum,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.severity'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `messageQueueMetrics.${row.key}.severity`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.messageTimestamp'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.messageQueueStringData.get('messageTimestamp');
      }
    }
  }
];

export default connectTo(
  props => {
    const { snapshotId } = props;
    return {
      data: getRawPayloadWithTimestamp(snapshotId, 'messageQueueInfoRawPayload')
    };
  },
  function jobQueueTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const messageQueueInfoRawPayload = data.get('raw_payload');
    if (messageQueueInfoRawPayload.size === 0) {
      return null;
    }

    const rows = messageQueueInfoRawPayload
      .map((messageQueueStringData, key) => {
        return {
          key,
          messageQueueStringData,
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
            title={t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.name')}
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
          <strong>{t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.messageText')}</strong>
          {' : '}
        </label>
        {row.messageQueueStringData.get('messageText')}
      </p>
      <p>
        <label>
          <strong>
            {t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.messageSecondLevelText')}
          </strong>
          {' : '}
        </label>
        {row.messageQueueStringData.get('messageSecondLevelText')}
      </p>
    </div>
  );
}
